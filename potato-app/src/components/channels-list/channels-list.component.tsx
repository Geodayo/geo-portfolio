import React from "react";
import styles from "./channels-list.module.scss";
import { Channel, ChannelProps } from "../channel/channel.component";

export interface ChannelsListProps {
  name?: string;
  channels: ChannelProps[];
}

export const ChannelList = ({
  name = "Text Channels",
  channels,
}: ChannelsListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <svg
          className={styles.icon}
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
          ></path>
        </svg>
        {name}
      </div>
      <div>
        <ul className={styles.list}>
          {channels.map((channel, index) => {
            return (
              <li key={`message-${index}`}>
                <Channel {...channel}></Channel>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
