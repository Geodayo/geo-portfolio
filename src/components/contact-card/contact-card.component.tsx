import styles from "./contact-card.module.scss";

export interface ContactEntry {
  /** Which icon to draw — falls back to a generic link glyph for anything
   * not in the icons map below. */
  icon?: string;
  label: string;
  /** What's shown under the label, e.g. the address itself — so a visitor
   * can read/copy it without having to click through. */
  value?: string;
  href: string;
}

export interface ContactCardProps {
  entries: ContactEntry[];
}

const icons: Record<string, React.ReactNode> = {
  email: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7.88L4.2 6.6a.5.5 0 0 0-.2.4v.55l8 5.33 8-5.33V7a.5.5 0 0 0-.2-.4L12 11.88ZM4 9.96V18h16V9.96l-7.45 4.96a1 1 0 0 1-1.1 0L4 9.96Z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10.59 13.41a1 1 0 0 1 0-1.41l3-3a1 1 0 1 1 1.41 1.41l-3 3a1 1 0 0 1-1.41 0Zm-2.12 4.95a3 3 0 0 1-4.24-4.24l3-3a3 3 0 0 1 4.24 0 1 1 0 1 1-1.41 1.41 1 1 0 0 0-1.42 0l-3 3a1 1 0 0 0 1.42 1.42l1.29-1.3a1 1 0 1 1 1.42 1.42l-1.3 1.29Zm11.3-8.48-3 3a3 3 0 0 1-4.24 0 1 1 0 1 1 1.41-1.41 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0-1.42-1.42l-1.29 1.3a1 1 0 1 1-1.42-1.42l1.3-1.29a3 3 0 0 1 4.24 4.24Z"
      />
    </svg>
  ),
};

export const ContactCard = ({ entries }: ContactCardProps) => {
  return (
    <div className={styles.container}>
      {entries.map((entry) => {
        const isExternal = /^https?:\/\//.test(entry.href);
        return (
          <a
            key={entry.href}
            className={styles.card}
            href={entry.href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <div className={styles.iconTile}>
              {icons[entry.icon ?? ""] ?? icons.link}
            </div>
            <div className={styles.body}>
              <div className={styles.label}>{entry.label}</div>
              {entry.value && <div className={styles.value}>{entry.value}</div>}
            </div>
          </a>
        );
      })}
    </div>
  );
};
