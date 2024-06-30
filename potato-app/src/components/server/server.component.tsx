import React from "react";
import styles from "./server.module.scss";

export interface ServerProps {
  name: string;
  thumbnail: string;
  serverLink: () => void;
}

export const Server = ({ name, thumbnail, serverLink }: ServerProps) => {
  return (
    <div className={styles.container}>
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
