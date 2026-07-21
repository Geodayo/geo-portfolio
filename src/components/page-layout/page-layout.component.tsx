import { useEffect, useState } from "react";
import styles from "./page-layout.module.scss";
import { Server} from "../server/server.component";
import { Message, type MessageProps } from "../message/message.component";
import { Channel } from "../channel/channel.component";
import {
  ChannelList
} from "../channels-list/channels-list.component";
import { InputForm } from "../input-form/input-form.component";
import { UsersList, type UsersListProps } from "../users-list/users-list.component";
import cx from "clsx";

export interface ServerSummary {
  slug: string;
  name: string;
  thumbnail: string;
}

export interface ServerChannel {
  text: string;
  active: boolean;
  messages?: MessageProps[];
}

export interface ServerDetailData {
  channels: ServerChannel[];
  users?: UsersListProps;
}

export interface PageLayoutProps {
  servers: ServerSummary[];
  activeServerSlug: string | null;
  activeServerData: ServerDetailData | null;
  onSelectServer: (slug: string | null) => void;
}

const homeChannels: ServerChannel[] = [
  {
    text: "general",
    active: true,
    messages: [
      {
        messageText: [
          "Hi, I'm Geo, welcome to my portfolio.",
          "This site is styled like a chat app, each server on the left is a project I've worked on.",
          "Pick one to see the story, screenshots, and tech behind it.",
        ],
      },
    ],
  },
];

export const PageLayout = ({ servers, activeServerSlug, activeServerData, onSelectServer }: PageLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = activeServerSlug === null;
  const channels = isHome ? homeChannels : activeServerData?.channels ?? [];
  const [activeChannel, setActiveChannel] = useState<ServerChannel | undefined>(channels[0]);

  useEffect(() => {
    setActiveChannel(isHome ? homeChannels[0] : activeServerData?.channels[0]);
  }, [isHome, activeServerData]);

  const activeServerName = isHome
    ? "Front Page"
    : servers.find((server) => server.slug === activeServerSlug)?.name ?? "";

  return (
    <div className={styles.container}>
      <div className={styles.navigationColumn}>
        <div className={styles.serverColumn}>
          <div className={styles.serversWrapper}>
            <Server
              name={"Front Page"}
              thumbnail={"./discord-temp-icon.jpg"}
              serverLink={() => onSelectServer(null)}
            ></Server>
          </div>
          {servers.map((server) => {
            return (
              <div
                className={styles.serversWrapper}
                key={`server-${server.slug}`}
              >
                <Server
                  name={server.name}
                  thumbnail={server.thumbnail}
                  serverLink={() => onSelectServer(server.slug)}
                ></Server>
              </div>
            );
          })}
        </div>
        <div className={styles.channelColumn}>
          <div className={styles.channelHeader}>
            {activeServerName}
            <div
              className={styles.arrowIcon}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M11.293 4.707 17.586 11H4v2h13.586l-6.293 6.293 1.414 1.414L21.414 12l-8.707-8.707-1.414 1.414z" />
              </svg>
            </div>
          </div>
          <div className={styles.channelLists}>
            {channels.length > 0 && (
              <ChannelList
                key={activeServerSlug}
                channels={channels.map((channel) => ({
                  ...channel,
                  channelLink: () => setActiveChannel(channel),
                }))}
              ></ChannelList>
            )}
          </div>
        </div>
      </div>
      <div
        className={cx(styles.messageColumn, {
          [styles.open]: mobileOpen,
        })}
      >
        <div className={styles.messageHeader}>
          <div
            className={styles.arrowIcon}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M11.293 4.707 17.586 11H4v2h13.586l-6.293 6.293 1.414 1.414L21.414 12l-8.707-8.707-1.414 1.414z" />
            </svg>
          </div>
          <Channel
            active={false}
            disableHover={true}
            text={activeChannel?.text ?? ""}
            channelLink={() => void 0}
          ></Channel>
        </div>
        <div className={styles.messagesWrapper}>
          {activeChannel?.messages?.map((message, index2) => {
            return (
              <div key={`message-${index2}`}>
                <Message {...message}></Message>
              </div>
            );
          })}
        </div>
        <div className={styles.messageFooter}>
          <InputForm disableForm={true}></InputForm>
        </div>
      </div>
      <div className={styles.usersColumn}>
        <div className={styles.usersLists}>
          {activeServerData?.users && (
            <UsersList {...activeServerData.users}></UsersList>
          )}
        </div>
      </div>
    </div>
  );
};
