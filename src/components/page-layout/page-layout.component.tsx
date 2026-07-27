import { useEffect, useRef, useState } from "react";
import styles from "./page-layout.module.scss";
import { Server} from "../server/server.component";
import { Message, type MessageProps } from "../message/message.component";
import { PointerLine } from "../pointer-line/pointer-line.component";
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
import { users } from "../../data";
import cx from "clsx";

type UserProfileData = Omit<UserProfileProps, "onSendMessage" | "onClose">;

const profiles = users as unknown as Record<string, UserProfileData>;

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
  /** Channel to open on load, from the /[serverSlug]/[channelSlug] route —
   * matched against each channel's slugifyChannelText(text). Null falls
   * back to the channel flagged `active: true` in the data (or the first
   * one). Ignored on the Front Page, which has no channel route. */
  initialChannelSlug: string | null;
  onSelectServer: (slug: string | null) => void;
  /** Called when the visitor picks a different channel, so the container
   * can reflect it in the URL (e.g. router.push(`/${slug}/${channelSlug}`)). */
  onSelectChannel: (channelSlug: string) => void;
}

const BOT_NAME = "GeoBot";
const BOT_THUMBNAIL = "/bot-icon.svg";
const ANONYMOUS_THUMBNAIL = "/anonymous-icon.svg";

function findChannelBySlug(
  channels: ServerChannel[],
  slug: string | null
): ServerChannel | undefined {
  if (!slug) return undefined;
  return channels.find((channel) => slugifyChannelText(channel.text) === slug);
}

function findInitialChannel(
  channels: ServerChannel[],
  initialChannelSlug: string | null
): ServerChannel | undefined {
  return (
    findChannelBySlug(channels, initialChannelSlug) ??
    channels.find((channel) => channel.active) ??
    channels[0]
  );
}

/**
 * How many of a channel's messages are due immediately: the leading run that
 * has no `delay`. Shared by the initial state and the staged-reveal effect so
 * both agree on what "already revealed" means.
 *
 * This has to feed useState, not just the effect. Effects don't run during
 * server rendering and only run after the first commit on the client, so
 * seeding revealedCount at 0 puts an empty message list in the SSR HTML and
 * paints it before hydration can fill it in — the list visibly flashes empty
 * even for a single message with no delay.
 */
function immediateRevealCount(channel: ServerChannel | undefined): number {
  const messages = channel?.messages ?? [];
  const firstDelayed = messages.findIndex((message) => (message.delay ?? 0) > 0);
  return firstDelayed === -1 ? messages.length : firstDelayed;
}

export const PageLayout = ({ servers, activeServerSlug, activeServerData, frontPageData, initialChannelSlug, onSelectServer, onSelectChannel }: PageLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = activeServerSlug === null;
  const channels = isHome ? frontPageData?.channels ?? [] : activeServerData?.channels ?? [];

  // The visitor's own channel pick, held as a *slug* rather than as the
  // channel object. A slug compares by value, so re-deriving the channel from
  // a fresh copy of the data can't silently change its identity — which is
  // what used to restart the staged reveal below and blank the message list.
  //
  // It's an optimistic override, not the source of truth: clicking a channel
  // on a server page also pushes the URL, and the router is a round-trip
  // behind. This paints the click immediately; `urlKey` below hands authority
  // back the moment the URL actually moves. On the Front Page there's no
  // channel route at all (see onSelectChannel in the container), so there this
  // is the only thing tracking the selection.
  const [selectedChannelSlug, setSelectedChannelSlug] = useState<string | null>(
    null
  );

  // Whatever the URL currently says, as one value. Any change to it — browser
  // back/forward, a direct link, switching servers — means the visitor
  // navigated by some route other than clicking a channel, so the stale
  // override has to go. (Including the server is what stops a leftover pick
  // from the Front Page resolving against a same-named channel elsewhere.)
  const urlKey = `${activeServerSlug ?? "home"}::${initialChannelSlug ?? ""}`;
  const [seenUrlKey, setSeenUrlKey] = useState(urlKey);

  let selection = selectedChannelSlug;
  if (seenUrlKey !== urlKey) {
    setSeenUrlKey(urlKey);
    setSelectedChannelSlug(null);
    // Used for this render too, not just the re-render React schedules from
    // the setState above — the URL wins starting now.
    selection = null;
  }

  const activeChannel =
    findChannelBySlug(channels, selection) ??
    findInitialChannel(channels, initialChannelSlug);

  // Identifies the channel being looked at right now. Everything below that's
  // scoped to a single channel resets when this changes.
  const channelKey = `${activeServerSlug ?? "home"}::${activeChannel?.text ?? ""}`;

  const [sentMessages, setSentMessages] = useState<Record<string, MessageProps[]>>({});
  const [pendingReplies, setPendingReplies] = useState<Record<string, boolean>>({});
  const [activeProfile, setActiveProfile] = useState<{ id: string; rect: DOMRect } | null>(null);
  // Seeded, not 0 — see immediateRevealCount. The first render (server and
  // client) must already contain the messages that aren't waiting on a delay.
  const [revealedCount, setRevealedCount] = useState(() =>
    immediateRevealCount(activeChannel)
  );
  const [isStagingMessages, setIsStagingMessages] = useState(
    () =>
      immediateRevealCount(activeChannel) <
      (activeChannel?.messages?.length ?? 0)
  );
  const [pointerDismissed, setPointerDismissed] = useState(false);
  // See the effect further down for what a cue is and how `sourceIndex` and
  // `key` are used; it's declared up here so the reset below can clear it.
  const [pointerCue, setPointerCue] = useState<{
    targetId: string;
    sourceIndex: number;
    key: number;
  } | null>(null);
  const pointerCueCounter = useRef(0);

  // Per-channel state resets here, during render, rather than from an effect.
  // An effect only runs after the browser has already painted a frame — a
  // frame still carrying the previous channel's reveal count and pointer
  // arrow. That paint is the blank-and-flash this component kept getting
  // patched for. React throws this render pass away and immediately re-runs
  // the component with the new values, so nothing stale reaches the screen.
  const [seenChannelKey, setSeenChannelKey] = useState(channelKey);
  if (seenChannelKey !== channelKey) {
    setSeenChannelKey(channelKey);
    setRevealedCount(immediateRevealCount(activeChannel));
    setIsStagingMessages(
      immediateRevealCount(activeChannel) <
        (activeChannel?.messages?.length ?? 0)
    );
    // Otherwise a stale arrow keeps pointing at something in the old channel.
    setPointerCue(null);
    setPointerDismissed(false);
  }

  // Stage the reveal of a channel's own messages one at a time, honoring
  // each message's optional `delay` (ms since the previous message
  // appeared). Messages without a delay reveal right away, so channels that
  // don't opt in behave exactly as before (everything shows up at once).
  //
  // Only the *delayed* messages are this effect's business. The leading run
  // with no delay is already counted by useState's seed on first render and
  // by the reset above on every channel change — both of which happen before
  // a paint, which a timer or an effect cannot. So there's nothing to set
  // synchronously here: revealedCount is never momentarily wrong.
  useEffect(() => {
    const channelMessages = activeChannel?.messages ?? [];
    const immediateCount = immediateRevealCount(activeChannel);

    if (immediateCount >= channelMessages.length) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    channelMessages.forEach((message, index) => {
      elapsed += message.delay ?? 0;
      if (index < immediateCount) return;
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
    if (!activeProfile) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProfile(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProfile]);

  const handleProfileClick = (userId: string, rect: DOMRect) => {
    if (!profiles[userId]) return;
    setActiveProfile({ id: userId, rect });
  };

  const closeProfile = () => setActiveProfile(null);

  const activeServerName = isHome
    ? "Front Page"
    : servers.find((server) => server.slug === activeServerSlug)?.name ?? "";

  const channelMessages = activeChannel?.messages ?? [];
  const displayedMessages = [
    ...channelMessages.slice(0, revealedCount),
    ...(sentMessages[channelKey] ?? []),
  ];
  const nextStagedMessage = channelMessages[revealedCount];

  // Whenever a new message shows up — whether it's a scripted one finishing
  // its staged reveal, or a live GeoBot reply that opted into a pointer via
  // a [[point: ...]] tag (see extractPointerTag/resolvePointerTarget in
  // src/lib/knowledge.ts) — check if it called out a pointer target and, if
  // so, draw the line from that exact message's avatar to it. `sourceIndex`
  // pins down which message in `displayedMessages` triggered this cue: new
  // messages only ever get appended (never inserted before it), so the
  // index stays valid even after later messages arrive. `key` is a separate
  // incrementing counter (not just the target id) so the un-dismiss/retimer
  // effect below still fires even if the same target gets pointed at twice
  // in a row. (The state itself is declared up top, with the other
  // per-channel state it gets reset alongside.)
  const POINTER_SOURCE_ID = "pointer-source-avatar";

  useEffect(() => {
    const sourceIndex = displayedMessages.length - 1;
    const lastMessage = displayedMessages[sourceIndex];
    if (lastMessage?.pointerTarget) {
      pointerCueCounter.current += 1;
      setPointerCue({
        targetId: lastMessage.pointerTarget,
        sourceIndex,
        key: pointerCueCounter.current,
      });
      setPointerDismissed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelKey, displayedMessages.length]);

  const pointerTargetPoint = usePointerTarget(
    containerRef,
    pointerCue?.targetId ?? null,
    pointerCue?.key
  );
  // usePointerTarget gives the target's dead center, which tends to look
  // like the line is stabbing right into the icon. Nudge the landing spot
  // to the right instead (vertically centered), toward the edge the line
  // is approaching from (see PointerLine's END_TANGENT, which always
  // arrives heading left), so it reads as "pointing at" rather than
  // "landing on".
  const POINTER_LANDING_OFFSET = { x: 24, y: 0 };
  const arrowLandingPoint = pointerTargetPoint
    ? {
        x: pointerTargetPoint.x + POINTER_LANDING_OFFSET.x,
        y: pointerTargetPoint.y + POINTER_LANDING_OFFSET.y,
      }
    : null;
  // The other end of the line — the avatar of whichever message triggered
  // this cue (see POINTER_SOURCE_ID above, and the avatarId passed to
  // <Message> below).
  const pointerSourcePoint = usePointerTarget(
    containerRef,
    pointerCue ? POINTER_SOURCE_ID : null,
    pointerCue?.key
  );
  // Same idea as POINTER_LANDING_OFFSET, but for the start of the line —
  // starting exactly at the avatar's dead center makes it look like the
  // line is glued to the icon. Nudging it straight up instead starts the
  // line from the top-middle of the avatar, which also matches the line
  // always leaving heading straight up (see PointerLine's START_TANGENT).
  const POINTER_SOURCE_OFFSET = { x: 0, y: -22 };
  const pointerLineStart = pointerSourcePoint
    ? {
        x: pointerSourcePoint.x + POINTER_SOURCE_OFFSET.x,
        y: pointerSourcePoint.y + POINTER_SOURCE_OFFSET.y,
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

  const showPointerArrow =
    Boolean(arrowLandingPoint) && Boolean(pointerLineStart) && !pointerDismissed;

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
        channelName: activeChannel?.text ?? "",
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

  // Auto-scrolling is for LIVE chat only — a message the visitor just sent,
  // GeoBot's reply, or its typing indicator — since those land below the
  // fold otherwise. A channel's own scripted messages must not drag the view
  // down: opening a long channel should start at the top and let the visitor
  // read from the beginning, staged reveals included.
  const scrollState = useRef({
    key: channelKey,
    count: (sentMessages[channelKey] ?? []).length,
  });

  useEffect(() => {
    const el = messagesWrapperRef.current;
    if (!el) return;

    const sentCount = (sentMessages[channelKey] ?? []).length;
    const previous = scrollState.current;
    scrollState.current = { key: channelKey, count: sentCount };

    // Switched channel (or server): show the new one from its start rather
    // than inheriting wherever the previous channel was scrolled to.
    if (previous.key !== channelKey) {
      el.scrollTop = 0;
      return;
    }

    // Same channel, and the conversation just moved — follow it down.
    if (sentCount > previous.count || isReplyPending) {
      el.scrollTop = el.scrollHeight;
    }
  }, [channelKey, sentMessages, isReplyPending]);

  return (
    <div className={styles.container} ref={containerRef}>
      {arrowLandingPoint && pointerLineStart && (
        <PointerLine
          className={cx(styles.pointerArrow, { [styles.pointerArrowHidden]: !showPointerArrow })}
          from={pointerLineStart}
          to={arrowLandingPoint}
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
                  // Overrides the static "default channel" flag from the
                  // JSON with whichever channel is actually selected right
                  // now (which might've come from the URL) — ChannelList is
                  // a controlled component and just renders this as-is.
                  active: channel === activeChannel,
                  // Scoped by server so e.g. two servers both having a
                  // "general" channel don't collide — not that it'd matter
                  // in practice since only one channel list is ever mounted
                  // at a time, but it keeps ids self-documenting.
                  id: `channel-${activeServerSlug ?? "home"}-${slugifyChannelText(channel.text)}`,
                  channelLink: () => {
                    setSelectedChannelSlug(slugifyChannelText(channel.text));
                    onSelectChannel(slugifyChannelText(channel.text));
                  },
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
                <Message
                  {...message}
                  avatarId={index2 === pointerCue?.sourceIndex ? POINTER_SOURCE_ID : undefined}
                  onProfileClick={handleProfileClick}
                ></Message>
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
      {activeProfile && profiles[activeProfile.id] && (
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
