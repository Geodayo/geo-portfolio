import styles from "./channels-list.module.scss";
import { Channel, type ChannelProps } from "../channel/channel.component";

export interface ChannelsListProps {
  name?: string;
  channels: ChannelProps[];
}

// Fully controlled by the `active` flag on each channel — no internal
// highlight state here. It used to track its own `useState(0)` index, which
// meant the highlight only ever reflected clicks made inside this
// component and defaulted to the first channel otherwise; that silently
// broke once channels became deep-linkable (e.g. loading
// /my-language-app/components directly would show the right messages via
// PageLayout's own state, but highlight "general" in the sidebar since this
// component never knew about the URL). PageLayout now sets `active` on
// whichever channel object actually matches its real activeChannel.
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
              <li
                key={`message-${index}`}
                onClick={() => {
                  channel.channelLink?.();
                }}
              >
                <Channel
                  text={channel.text}
                  id={channel.id}
                  channelLink={() => {
                    channel.channelLink?.();
                  }}
                  disableHover={channel.disableHover}
                  active={channel.active}
                ></Channel>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
