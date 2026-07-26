import cx from "clsx";
import styles from "./server.module.scss";

export interface ServerProps {
  name: string;
  thumbnail: string;
  active?: boolean;
  serverLink: () => void;
}

export const Server = ({ name, thumbnail, active = false, serverLink }: ServerProps) => {
  return (
    <div className={cx(styles.container, { [styles.active]: active })}>
      <span className={styles.pill}></span>
      <div
        className={styles.thumbnail}
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
