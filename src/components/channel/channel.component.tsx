import styles from "./channel.module.scss";
import cx from "clsx";

export interface ChannelProps {
  text: string;
  active?: boolean;
  disableHover?: boolean;
  channelLink: () => void;
}

export const Channel = ({
  text,
  active,
  channelLink,
  disableHover,
}: ChannelProps) => {
  return (
    <div
      className={cx(styles.container, {
        [styles.active]: active,
        [styles.disableHover]: disableHover,
      })}
    >
      <a className={styles.link} onClick={channelLink}>
        <div className={styles.linkWrapper}>
          <div className={styles.waffle}>
            <svg
              className="icon__67ab4"
              aria-hidden="true"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
                clip-rule="evenodd"
                className=""
              ></path>
            </svg>
          </div>
          <div className={styles.text}>{text}</div>
        </div>
      </a>
    </div>
  );
};
