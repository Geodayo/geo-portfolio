import { useState } from "react";
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

export interface PageLayoutProps {
  servers: {
    name: string;
    thumbnail: string;
    serverLink: () => void;
    channels: {
      text: string;
      active: boolean;
      channelLink?: () => void;
      messages?: MessageProps[];
    }[];
    users: UsersListProps;
  }[];
}

export const PageLayout = ({ servers }: PageLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeServer, setActiveServer] = useState(servers[0]);
  const [activeChannel, setActiveChannel] = useState(activeServer.channels[0]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationColumn}>
        <div className={styles.serverColumn}>
          <div className={styles.serversWrapper}>
            <Server
              name={"Front Page"}
              thumbnail={"./discord-temp-icon.jpg"}
              serverLink={() => console.log("home")}
            ></Server>
          </div>
          {servers.map((server) => {
            return (
              <div
                className={styles.serversWrapper}
                key={`server-${server.name}`}
              >
                <Server
                  name={server.name}
                  thumbnail={server.thumbnail}
                  serverLink={() => {
                    setActiveServer(server);
                    setActiveChannel(server.channels[0]);
                  }}
                ></Server>
              </div>
            );
          })}
        </div>
        <div className={styles.channelColumn}>
          <div className={styles.channelHeader}>
            {activeServer.name}
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
            {activeServer.channels && (
              <ChannelList
                channels={activeServer.channels.map((channel) => ({
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
            text={activeChannel.text}
            channelLink={() => void 0}
          ></Channel>
        </div>
        <div className={styles.messagesWrapper}>
          {activeChannel.messages &&
            activeChannel.messages.map((message, index2) => {
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
          {activeServer.users && (
            <UsersList {...activeServer.users}></UsersList>
          )}
        </div>
      </div>
    </div>
  );
};
