import styles from "./message.module.scss";
import { Gallery } from "../gallery/gallery.component";
import { Video } from "../video/video.component";

export interface MessageProps {
  headless?: boolean;
  date?: string;
  profileThumbnail?: string;
  profileName?: string;
  userId?: string;
  onProfileClick?: (userId: string, rect: DOMRect) => void;
  type?: "text" | "image" | "gallery" | "video";
  image?: string;
  gallery?: string[];
  video?: string;
  messageText?: string[];
  /**
   * Milliseconds to wait after the previous message reveals before this one
   * appears. Only consumed by PageLayout's staged-reveal effect (used to
   * simulate messages arriving live) — the Message component itself ignores
   * it. Omit or leave at 0 for messages that should just show up instantly.
   */
  delay?: number;
  /**
   * The DOM `id` of some element elsewhere on the page this message is
   * calling out (e.g. a server icon's slug, since PageLayout gives each one
   * `id={server.slug}`) — but it can be the id of literally anything.
   * Only consumed by PageLayout: once a message with a pointerTarget has
   * revealed, PageLayout looks up that id (see usePointerTarget) and shows
   * a decorative Arrow pointing at it. To make a new element pointable,
   * just give it a matching `id` somewhere in the tree.
   */
  pointerTarget?: string;
}

export const Message = ({
  headless = false,
  date,
  profileThumbnail = "/totoro-profile.jpg",
  profileName = "Jorge",
  userId = "geo",
  onProfileClick,
  type = "text",
  image,
  gallery,
  video,
  messageText,
}: MessageProps) => {
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    onProfileClick?.(userId, event.currentTarget.getBoundingClientRect());
  };

  return (
    <div className={styles.container}>
      {!headless && date && (
        <div className={styles.divider}>
          <span>{date}</span>
        </div>
      )}
      <div className={styles.content}>
        <div
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${profileThumbnail})` }}
          onClick={handleProfileClick}
        ></div>
        <div className={styles.message}>
          <div className={styles.profileName} onClick={handleProfileClick}>
            {profileName}
          </div>
          <div className={styles.media}>
            {type === "text" && (
              <div>
                {messageText?.map((text) => {
                  // Simple URL regex
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = text.split(urlRegex);

                  return (
                    <span key={text}>
                      {parts.map((part, i) =>
                        urlRegex.test(part) ? (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link} // optional for styling
                          >
                            {part}
                          </a>
                        ) : (
                          part
                        )
                      )}
                      <br />
                    </span>
                  );
                })}
              </div>
            )}
            {type === "image" && image && (
              <div className={styles.imageWrap}>
                <img
                  className={styles.image}
                  src={image}
                  alt=""
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            {type === "gallery" && gallery && <Gallery images={gallery} />}
            {type === "video" && video && <Video url={video} />}
          </div>
        </div>
      </div>
    </div>
  );
};
