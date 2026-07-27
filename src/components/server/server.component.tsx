import cx from "clsx";
import styles from "./server.module.scss";

export interface ServerProps {
  name: string;
  thumbnail: string;
  active?: boolean;
  /**
   * Drops the light placeholder fill behind the thumbnail, for icons that are
   * a transparent glyph rather than a full-bleed image — otherwise the grey
   * circle meant to hold the space while a photo loads shows up as a disc
   * behind the artwork.
   */
  transparent?: boolean;
  serverLink: () => void;
}

export const Server = ({ name, thumbnail, active = false, transparent = false, serverLink }: ServerProps) => {
  return (
    <div className={cx(styles.container, { [styles.active]: active })}>
      <span className={styles.pill}></span>
      <div
        className={cx(styles.thumbnail, { [styles.transparent]: transparent })}
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={serverLink}
      >
        <div className={styles.name}>
          <span className={styles.text}>{name}</span>
          </div>
      </div>
    </div>
  );
};
