import { useEffect, useState } from "react";
import styles from "./page-layout.module.scss";
import { Server} from "../server/server.component";
import { Message, type MessageProps } from "../message/message.component";
import { Channel } from "../channel/channel.component";
import {
  ChannelList
} from "../channels-list/channels-list.component";
import { InputForm } from "../input-form/input-form.component";
import { UsersList, type UsersListProps } from "../users-list/users-list.component";
import { UserProfile, type UserProfileProps } from "../user-profile/user-profile.component";
import { sendChatMessage, type ChatHistoryMessage } from "../../services/chat-api";
import cx from "clsx";

type UserProfileData = Omit<UserProfileProps, "onSendMessage" | "onClose">;

const POPOVER_WIDTH = 300;
const POPOVER_ESTIMATED_HEIGHT = 420;
const POPOVER_MARGIN = 8;

function getPopoverStyle(rect: DOMRect): React.CSSProperties {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = rect.right + POPOVER_MARGIN;
  if (left + POPOVER_WIDTH > viewportWidth - POPOVER_MARGIN) {
    left = rect.left - POPOVER_WIDTH - POPOVER_MARGIN;
  }
  left = Math.max(
    POPOVER_MARGIN,
    Math.min(left, viewportWidth - POPOVER_WIDTH - POPOVER_MARGIN)
  );

  let top = rect.top;
  if (top + POPOVER_ESTIMATED_HEIGHT > viewportHeight - POPOVER_MARGIN) {
    top = Math.max(
      POPOVER_MARGIN,
      viewportHeight - POPOVER_ESTIMATED_HEIGHT - POPOVER_MARGIN
    );
  }

  return { position: "fixed", left, top, zIndex: 1000 };
}

export interface ServerSummary {
  slug: string;
  name: string;
  thumbnail: string;
}

export interface ServerChannel {
  text: string;
  active: boolean;
  messages?: MessageProps[];
}

export interface ServerDetailData {
  channels: ServerChannel[];
  users?: UsersListProps;
}

export interface PageLayoutProps {
  servers: ServerSummary[];
  activeServerSlug: string | null;
  activeServerData: ServerDetailData | null;
  frontPageData: ServerDetailData | null;
  onSelectServer: (slug: string | null) => void;
}

const BOT_NAME = "GeoBot";
const BOT_THUMBNAIL = "/bot-icon.svg";
const ANONYMOUS_THUMBNAIL = "/anonymous-icon.svg";

export const PageLayout = ({ servers, activeServerSlug, activeServerData, frontPageData, onSelectServer }: PageLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = activeServerSlug === null;
  const channels = isHome ? frontPageData?.channels ?? [] : activeServerData?.channels ?? [];
  const [activeChannel, setActiveChannel] = useState<ServerChannel | undefined>(channels[0]);
  const [sentMessages, setSentMessages] = useState<Record<string, MessageProps[]>>({});
  const [pendingReplies, setPendingReplies] = useState<Record<string, boolean>>({});
  const [profiles, setProfiles] = useState<Record<string, UserProfileData> | null>(null);
  const [activeProfile, setActiveProfile] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isStagingMessages, setIsStagingMessages] = useState(false);

  useEffect(() => {
    setActiveChannel(isHome ? frontPageData?.channels[0] : activeServerData?.channels[0]);
  }, [isHome, activeServerData, frontPageData]);

  // Stage the reveal of a channel's own messages one at a time, honoring
  // each message's optional `delay` (ms since the previous message
  // appeared). Messages without a delay reveal right away, so channels that
  // don't opt in behave exactly as before (everything shows up at once).
  useEffect(() => {
    const channelMessages = activeChannel?.messages ?? [];

    if (channelMessages.length === 0) {
      setRevealedCount(0);
      setIsStagingMessages(false);
      return;
    }

    setRevealedCount(0);
    setIsStagingMessages(true);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    channelMessages.forEach((message, index) => {
      elapsed += message.delay ?? 0;
      timeouts.push(
        setTimeout(() => {
          setRevealedCount(index + 1);
          if (index === channelMessages.length - 1) setIsStagingMessages(false);
        }, elapsed)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeChannel]);

  useEffect(() => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then((json) => setProfiles(json))
      .catch(() => setProfiles({}));
  }, []);

  useEffect(() => {
    if (!activeProfile) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProfile(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProfile]);

  const handleProfileClick = (userId: string, rect: DOMRect) => {
    if (!profiles?.[userId]) return;
    setActiveProfile({ id: userId, rect });
  };

  const closeProfile = () => setActiveProfile(null);

  const activeServerName = isHome
    ? "Front Page"
    : servers.find((server) => server.slug === activeServerSlug)?.name ?? "";

  const channelKey = `${activeServerSlug ?? "home"}::${activeChannel?.text ?? ""}`;
  const channelMessages = activeChannel?.messages ?? [];
  const displayedMessages = [
    ...channelMessages.slice(0, revealedCount),
    ...(sentMessages[channelKey] ?? []),
  ];
  const nextStagedMessage = channelMessages[revealedCount];

  const handleSendMessage = async (text: string) => {
    const key = channelKey;

    // Snapshot the conversation so far (before this new message) so it can
    // be forwarded to the assistant — the API itself has no memory between
    // requests, so without this every message would look like the start of
    // a brand new conversation to it.
    const history: ChatHistoryMessage[] = (sentMessages[key] ?? [])
      .filter((entry) => entry.messageText?.length)
      .map((entry) => ({
        role: entry.userId === "geobot" ? "assistant" : "user",
        content: entry.messageText!.join(" "),
      }));

    setSentMessages((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] ?? []),
        {
          profileName: "Anonymous",
          profileThumbnail: ANONYMOUS_THUMBNAIL,
          userId: "anonymous",
          messageText: [text],
        },
      ],
    }));
    setPendingReplies((prev) => ({ ...prev, [key]: true }));

    try {
      const reply = await sendChatMessage(text, history);
      setSentMessages((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] ?? []),
          {
            profileName: BOT_NAME,
            profileThumbnail: BOT_THUMBNAIL,
            userId: "geobot",
            messageText: [reply],
          },
        ],
      }));
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : "Something went wrong reaching the assistant.";
      setSentMessages((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] ?? []),
          {
            profileName: BOT_NAME,
            profileThumbnail: BOT_THUMBNAIL,
            userId: "geobot",
            messageText: [errorText],
          },
        ],
      }));
    } finally {
      setPendingReplies((prev) => ({ ...prev, [key]: false }));
    }
  };

  const isReplyPending = pendingReplies[channelKey] ?? false;

  return (
    <div className={styles.container}>
      <div className={styles.navigationColumn}>
        <div className={styles.serverColumn}>
          <div className={styles.serversWrapper}>
            <Server
              name={"Front Page"}
              thumbnail={"/discord-temp-icon.jpg"}
              active={isHome}
              serverLink={() => onSelectServer(null)}
            ></Server>
          </div>
          {servers.map((server) => {
            return (
              <div
                className={styles.serversWrapper}
                key={`server-${server.slug}`}
              >
                <Server
                  name={server.name}
                  thumbnail={server.thumbnail}
                  active={activeServerSlug === server.slug}
                  serverLink={() => onSelectServer(server.slug)}
                ></Server>
              </div>
            );
          })}
        </div>
        <div className={styles.channelColumn}>
          <div className={styles.channelHeader}>
            {activeServerName}
            <div
              className={styles.arrowIcon}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M11.293 4.707 17.586 11H4v2h13.586l-6.293 6.293 1.414 1.414L21.414 12l-8.707-8.707-1.414 1.414z" />
              </svg>
            </div>
          </div>
          <div className={styles.channelLists}>
            {channels.length > 0 && (
              <ChannelList
                key={activeServerSlug}
                channels={channels.map((channel) => ({
                  ...channel,
                  channelLink: () => setActiveChannel(channel),
                }))}
              ></ChannelList>
            )}
          </div>
        </div>
      </div>
      <div
        className={cx(styles.messageColumn, {
          [styles.open]: mobileOpen,
        })}
      >
        <div className={styles.messageHeader}>
          <div
            className={styles.arrowIcon}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M11.293 4.707 17.586 11H4v2h13.586l-6.293 6.293 1.414 1.414L21.414 12l-8.707-8.707-1.414 1.414z" />
            </svg>
          </div>
          <Channel
            active={false}
            disableHover={true}
            text={activeChannel?.text ?? ""}
            channelLink={() => void 0}
          ></Channel>
        </div>
        <div className={styles.messagesWrapper}>
          {displayedMessages.map((message, index2) => {
            return (
              <div key={`message-${index2}`}>
                <Message {...message} onProfileClick={handleProfileClick}></Message>
              </div>
            );
          })}
        </div>
        {isStagingMessages && nextStagedMessage && (
          <div className={styles.typingIndicator}>
            <span className={styles.typingDots}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </span>
            <span>{nextStagedMessage.profileName ?? "Jorge"} is typing...</span>
          </div>
        )}
        {isReplyPending && (
          <div className={styles.typingIndicator}>
            <span className={styles.typingDots}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </span>
            <span>{BOT_NAME} is typing...</span>
          </div>
        )}
        <div className={styles.messageFooter}>
          <InputForm
            disableForm={isReplyPending}
            placeholder={isReplyPending ? "Waiting for a reply..." : undefined}
            onSendMessage={handleSendMessage}
          ></InputForm>
        </div>
      </div>
      <div className={styles.usersColumn}>
        <div className={styles.usersLists}>
          <UsersList
            {...(isHome ? frontPageData?.users : activeServerData?.users)}
            onProfileClick={handleProfileClick}
          ></UsersList>
        </div>
      </div>
      {activeProfile && profiles?.[activeProfile.id] && (
        <div className={styles.profileBackdrop} onClick={closeProfile}>
          <div
            className={styles.profilePopover}
            style={getPopoverStyle(activeProfile.rect)}
            onClick={(event) => event.stopPropagation()}
          >
            <UserProfile
              {...profiles[activeProfile.id]}
              onClose={closeProfile}
            ></UserProfile>
          </div>
        </div>
      )}
    </div>
  );
};
