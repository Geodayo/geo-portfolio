import Link from "next/link";
import cx from "clsx";
import styles from "./directory.module.scss";
import { servers } from "../../data";
import { slugifyChannelText } from "../../lib/slugify";
import { trackEvent } from "../../lib/analytics";

// Deliberately not the ServerSummary from page-layout.component: importing it
// here would make a cycle (page-layout → message → directory → page-layout),
// so the few fields the cards need are re-declared locally.
interface ServerSummary {
  slug: string;
  name: string;
  thumbnail: string;
  iconOnly?: boolean;
}

const serverSummaries = servers as ServerSummary[];

export interface DirectoryEntry {
  /** Slug of a server from servers.json — the card's name and thumbnail come
   * from there, so the directory can't drift out of sync with the sidebar. */
  server: string;
  description?: string;
  /** Channel names (exactly as written in that server's own JSON) to offer
   * as deep links under the card, e.g. sub-projects that live as channels. */
  channels?: string[];
}

export interface DirectoryProps {
  entries: DirectoryEntry[];
}

export const Directory = ({ entries }: DirectoryProps) => {
  return (
    <div className={styles.container}>
      {entries.map((entry) => {
        const server = serverSummaries.find((s) => s.slug === entry.server);
        if (!server) return null;
        return (
          <div className={styles.card} key={entry.server}>
            {/* Stretched link: the card body can't just BE a <Link> because
                the channel chips below are links themselves, and anchors
                can't nest. So this overlay covers the whole card and the
                chips sit above it (see z-indexes in the stylesheet). */}
            <Link
              href={`/${server.slug}`}
              className={styles.cardLink}
              aria-label={`Open ${server.name}`}
              onClick={() =>
                trackEvent("project_open", {
                  project: server.slug,
                  source: "directory",
                })
              }
            />
            <div
              className={cx(styles.thumbnail, {
                [styles.iconOnly]: server.iconOnly,
              })}
              style={{ backgroundImage: `url(${server.thumbnail})` }}
            ></div>
            <div className={styles.body}>
              <div className={styles.name}>{server.name}</div>
              {entry.description && (
                <div className={styles.description}>{entry.description}</div>
              )}
              {(entry.channels?.length ?? 0) > 0 && (
                <div className={styles.channels}>
                  {entry.channels!.map((channel) => (
                    <Link
                      key={channel}
                      className={styles.chip}
                      href={`/${server.slug}/${slugifyChannelText(channel)}`}
                      onClick={() =>
                        trackEvent("project_open", {
                          project: server.slug,
                          source: "directory_chip",
                          channel,
                        })
                      }
                    >
                      <span className={styles.hash}>#</span>
                      {channel}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
