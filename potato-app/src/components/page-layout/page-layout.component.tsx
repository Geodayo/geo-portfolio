import React from "react";
import styles from "./page-layout.module.scss";
import { Server, ServerProps } from "../server/server.component";
import { Message, MessageProps } from "../message/message.component";
import { Channel } from "../channel/channel.component";
import {
  ChannelList,
  ChannelsListProps,
} from "../channels-list/channels-list.component";
import { InputForm } from "../input-form/input-form.component";
import { UsersList, UsersListProps } from "../users-list/users-list.component";

export interface PageLayoutProps {
  serverName: string;
  servers: ServerProps[];
  messages: MessageProps[];
  channels: ChannelsListProps;
  users: UsersListProps;
}

export const PageLayout = ({
  serverName,
  servers,
  messages,
  channels,
  users,
}: PageLayoutProps) => {
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
          {servers.map((server, index) => {
            return (
              <div
                className={styles.serversWrapper}
                key={`server-${server.name}`}
              >
                <Server
                  name={server.name}
                  thumbnail={server.thumbnail}
                  serverLink={server.serverLink}
                ></Server>
              </div>
            );
          })}
        </div>
        <div className={styles.channelColumn}>
          <div className={styles.channelHeader}>{serverName}</div>
          <div className={styles.channelLists}>
            {channels && <ChannelList {...channels}></ChannelList>}
          </div>
        </div>
      </div>
      <div className={styles.messageColumn}>
        <div className={styles.messageHeader}>
          <Channel
            active={false}
            disableHover={true}
            text={"general"}
            channelLink={"#"}
          ></Channel>
        </div>
        <div className={styles.messagesWrapper}>
          {messages.map((message, index) => {
            return (
              <div key={`message-${index}`}>
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
          {users && <UsersList {...users}></UsersList>}
        </div>
      </div>
    </div>
  );
};
