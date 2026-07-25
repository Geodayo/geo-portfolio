import { useState } from "react";
import styles from "./user-profile.module.scss";
import cx from "clsx";

export type UserStatus = "online" | "idle" | "dnd" | "offline";

export interface UserProfileCustomStatus {
  text: string;
  emoji?: string;
  color?: string;
}

export interface UserProfileProps {
  avatar: string;
  banner?: string;
  bannerColor?: string;
  status?: UserStatus;
  displayName: string;
  username: string;
  badges?: string[];
  mutualServers?: number;
  bio?: string[];
  links?: string[];
  customStatus?: UserProfileCustomStatus;
  disableMessage?: boolean;
  onSendMessage?: (text: string) => void;
  onClose?: () => void;
}

const BIO_PREVIEW_LENGTH = 120;

export const UserProfile = ({
  avatar,
  banner,
  bannerColor = "#5865f2",
  status = "online",
  displayName,
  username,
  badges,
  mutualServers,
  bio,
  links,
  customStatus,
  disableMessage = false,
  onSendMessage,
  onClose,
}: UserProfileProps) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [messageValue, setMessageValue] = useState("");

  const bioText = bio?.join(" ") ?? "";
  const isBioTruncatable = bioText.length > BIO_PREVIEW_LENGTH;
  const displayedBio =
    isBioTruncatable && !bioExpanded
      ? `${bioText.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}...`
      : bioText;

  const handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = messageValue.trim();
    if (!trimmed) return;
    onSendMessage?.(trimmed);
    setMessageValue("");
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.banner}
        style={
          banner
            ? { backgroundImage: `url(${banner})` }
            : { backgroundColor: bannerColor }
        }
      >
        <div className={styles.topActions}>
          <button type="button" aria-label="Add friend" className={styles.iconButton}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM2 20c0-3.31 3.13-6 7-6s7 2.69 7 6M18 8v6M15 11h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="More options"
            className={styles.iconButton}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="12" r="1.6" fill="currentColor" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              <circle cx="19" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.avatarWrap}>
        <div
          className={styles.avatar}
          style={{ backgroundImage: `url(${avatar})` }}
        >
          <span
            className={cx(styles.statusDot, styles[`status-${status}`])}
            aria-label={`Status: ${status}`}
          ></span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.identity}>
          <div className={styles.displayName}>{displayName}</div>
          <div className={styles.usernameRow}>
            <span className={styles.username}>{username}</span>
            {badges && badges.length > 0 && (
              <span className={styles.badges}>
                {badges.map((badge, index) => (
                  <span key={`badge-${index}`} className={styles.badge}>
                    {badge}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>

        {typeof mutualServers === "number" && (
          <div className={styles.mutualServers}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4h16v12H7l-3 3V4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {mutualServers} Mutual Server{mutualServers === 1 ? "" : "s"}
          </div>
        )}

        {bioText && (
          <div className={styles.section}>
            <div className={styles.bioText}>{displayedBio}</div>
            {isBioTruncatable && (
              <button
                type="button"
                className={styles.viewFullBio}
                onClick={() => setBioExpanded((expanded) => !expanded)}
              >
                {bioExpanded ? "View Less" : "View Full Bio"}
              </button>
            )}
          </div>
        )}

        {links && links.length > 0 && (
          <div className={styles.links}>
            {links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link}
              </a>
            ))}
          </div>
        )}

        {customStatus && (
          <div className={styles.customStatusCard}>
            <span
              className={styles.customStatusDot}
              style={{ backgroundColor: customStatus.color ?? "#3ea557" }}
            ></span>
            {customStatus.emoji && <span>{customStatus.emoji}</span>}
            <span>{customStatus.text}</span>
          </div>
        )}
      </div>

      {!disableMessage && (
        <form className={styles.messageBar} onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={messageValue}
            onChange={(event) => setMessageValue(event.target.value)}
            placeholder={`Message @${username}`}
          />
          <button type="button" className={styles.emojiButton} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="10" r="1.2" fill="currentColor" />
              <circle cx="15" cy="10" r="1.2" fill="currentColor" />
              <path
                d="M8.5 14c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
};
