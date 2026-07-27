import cx from "clsx";
import styles from "./server.module.scss";

export interface ServerProps {
  name: string;
  thumbnail: string;
  active?: boolean;
  /**
   * For servers whose thumbnail is a bare glyph on transparency rather than a
   * full-bleed logo. Instead of the light placeholder fill (which is there to
   * hold the space while a photo loads, and would show as a disc behind the
   * artwork), the tile gets its own grey background that turns blurple on
   * hover and while active — the same treatment Discord gives its own
   * icon-only buttons.
   */
  iconOnly?: boolean;
  serverLink: () => void;
}

export const Server = ({ name, thumbnail, active = false, iconOnly = false, serverLink }: ServerProps) => {
  return (
    <div className={cx(styles.container, { [styles.active]: active })}>
      <span className={styles.pill}></span>
      <div
        className={cx(styles.thumbnail, { [styles.iconOnly]: iconOnly })}
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
