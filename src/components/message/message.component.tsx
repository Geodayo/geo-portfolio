import styles from "./message.module.scss";
import { Gallery } from "../gallery/gallery.component";
import { Video } from "../video/video.component";

export interface MessageProps {
  headless?: boolean;
  date?: string;
  profileThumbnail?: string;
  profileName?: string;
  type?: "text" | "image" | "gallery" | "video";
  image?: string;
  gallery?: string[];
  video?: string;
  messageText?: string[];
}

export const Message = ({
  headless = false,
  date,
  profileThumbnail = "./totoro-profile.jpg",
  profileName = "Geo",
  type = "text",
  image,
  gallery,
  video,
  messageText,
}: MessageProps) => {
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
        ></div>
        <div className={styles.message}>
          <div className={styles.profileName}>{profileName}</div>
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
