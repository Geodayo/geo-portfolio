import { useEffect, useRef, useState } from "react";
import styles from "./page-layout.module.scss";
import { Server} from "../server/server.component";
import { Message, type MessageProps } from "../message/message.component";
import { Arrow, ARROW_TIP } from "../arrow/arrow.component";
import { Channel } from "../channel/channel.component";
import {
  ChannelList
} from "../channels-list/channels-list.component";
import { InputForm } from "../input-form/input-form.component";
import { UsersList, type UsersListProps } from "../users-list/users-list.component";
import { UserProfile, type UserProfileProps } from "../user-profile/user-profile.component";
import { sendChatMessage, type ChatHistoryMessage } from "../../services/chat-api";
import { usePointerTarget } from "../../hooks/use-pointer-target";
import { slugifyChannelText } from "../../lib/slugify";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
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
  const [pointerDismissed, setPointerDismissed] = useState(false);

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

  // Whenever a new message shows up — whether it's a scripted one finishing
  // its staged reveal, or a live GeoBot reply that mentioned a project (see
  // findMentionedServerSlug in src/lib/knowledge.ts) — check if it called
  // out a pointer target and, if so, aim the arrow at it. `pointerCue` uses
  // an incrementing key (not just the target id) so the un-dismiss/retimer
  // effect below still fires even if the same target gets pointed at twice
  // in a row.
  const [pointerCue, setPointerCue] = useState<{ targetId: string; key: number } | null>(null);
  const pointerCueCounter = useRef(0);

  useEffect(() => {
    const lastMessage = displayedMessages[displayedMessages.length - 1];
    if (lastMessage?.pointerTarget) {
      pointerCueCounter.current += 1;
      setPointerCue({ targetId: lastMessage.pointerTarget, key: pointerCueCounter.current });
      setPointerDismissed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelKey, displayedMessages.length]);

  // Clear the pointer entirely when switching channels/servers, rather than
  // leaving a stale arrow pointing at something from the previous channel.
  useEffect(() => {
    setPointerCue(null);
    setPointerDismissed(false);
  }, [activeChannel]);

  const pointerTargetPoint = usePointerTarget(containerRef, pointerCue?.targetId ?? null);
  // usePointerTarget gives the target's dead center, which tends to look
  // like the arrow is stabbing right into the icon. Nudge the landing spot
  // up and to the right instead, toward the edge the arrow is approaching
  // from, so it reads as "pointing at" rather than "landing on".
  const POINTER_LANDING_OFFSET = { x: 24, y: -10 };
  const arrowLandingPoint = pointerTargetPoint
    ? {
        x: pointerTargetPoint.x + POINTER_LANDING_OFFSET.x,
        y: pointerTargetPoint.y + POINTER_LANDING_OFFSET.y,
      }
    : null;

  // Auto-dismiss the pointer arrow 10s after it appears, so it doesn't just
  // sit there indefinitely. Keyed on pointerCue so a fresh cue (new target,
  // or even the same target pointed at again) always restarts the clock.
  useEffect(() => {
    if (!pointerCue) return;
    const timeout = setTimeout(() => setPointerDismissed(true), 10000);
    return () => clearTimeout(timeout);
  }, [pointerCue]);

  const showPointerArrow = Boolean(arrowLandingPoint) && !pointerDismissed;

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
      const { reply, pointerTarget } = await sendChatMessage(text, history, {
        serverSlug: activeServerSlug,
        serverName: activeServerName,
        channels: channels.map((channel) => channel.text),
      });
      setSentMessages((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] ?? []),
          {
            profileName: BOT_NAME,
            profileThumbnail: BOT_THUMBNAIL,
            userId: "geobot",
            messageText: [reply],
            // If the reply was about a specific project, this drives the
            // pointer-arrow effect below (see the displayedMessages.length
            // effect) — it'll pop up pointing at that server's icon.
            pointerTarget: pointerTarget ?? undefined,
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

  // Keep the message list pinned to the bottom whenever new content shows
  // up — a newly-revealed message, a sent message, a bot reply, or either
  // typing indicator appearing/disappearing — instead of leaving the
  // visitor scrolled wherever they were (which, right after sending a
  // message, meant the new one landed below the fold).
  useEffect(() => {
    const el = messagesWrapperRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [channelKey, displayedMessages.length, isStagingMessages, isReplyPending]);

  return (
    <div className={styles.container} ref={containerRef}>
      {arrowLandingPoint && (
        <Arrow
          className={cx(styles.pointerArrow, { [styles.pointerArrowHidden]: !showPointerArrow })}
          // The base shape approaches its tip from almost directly above
          // (tail sits up-and-slightly-right of the tip). Since rotation
          // pivots around the tip itself, rotating further flattens the
          // arc so it reads as coming in from the side at roughly the same
          // height as the target, instead of arcing down from above it.
          rotate={95}
          style={{
            top: arrowLandingPoint.y - ARROW_TIP.y,
            left: arrowLandingPoint.x - ARROW_TIP.x,
          }}
        />
      )}
      <div className={styles.navigationColumn}>
        <div className={styles.serverColumn}>
          <div className={styles.serversWrapper} id="front-page">
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
                id={server.slug}
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
                  // Scoped by server so e.g. two servers both having a
                  // "general" channel don't collide — not that it'd matter
                  // in practice since only one channel list is ever mounted
                  // at a time, but it keeps ids self-documenting.
                  id: `channel-${activeServerSlug ?? "home"}-${slugifyChannelText(channel.text)}`,
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
        <div className={styles.messagesWrapper} ref={messagesWrapperRef}>
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
