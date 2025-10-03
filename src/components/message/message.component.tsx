import styles from "./message.module.scss";

export interface MessageProps {
  headless?: boolean;
  date?: string;
  profileThumbnail?: string;
  profileName?: string;
  type?: "text" | "image" | "gallery";
  image?: string;
  gallery?: string[];
  messageText?: string[];
}

export const Message = ({
  headless = false,
  date,
  profileThumbnail = "./totoro-profile.jpg",
  profileName = "Geo",
  type = "text",
  image,
  messageText,
}: MessageProps) => {
  return (
    <div className={styles.container}>
      {!headless && date && <div className={styles.divider}><span>{date}</span></div>}
      <div className={styles.content}>
        <div
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${profileThumbnail})` }}
        ></div>
        <div className={styles.message}>
          <div className={styles.profileName}>{profileName}</div>
          <div className={styles.media}>
            {type === "text" && <div>{messageText?.map((text) => <span key={text}>{text}<br /></span>)}</div>}
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
          </div>
        </div>
      </div>
    </div>
  );
};
