import React from "react";
import styles from "./layout.module.scss";
import { Server, ServerProps } from "../server/server.component";



export interface LayoutProps {
  servers: ServerProps[];
}

export const Layout = ({ servers }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.navigationColumn}>
        <div className={styles.serverColumn}>
            {servers.map((server, index) => {
              return (
                <div className={styles.serversWrapper} key={`server-${server.name}`}>
                  <Server name={server.name} thumbnail={server.thumbnail} serverLink={server.serverLink}></Server>
                </div>
              )
            })}
        </div>
        <div className={styles.channelColumn}>
          <div className={styles.channelHeader}></div>
          Hello
        </div>
      </div>
      <div className={styles.messageColumn}>
        <div className={styles.messageHeader}></div>
        There
      </div>
      <div className={styles.usersColumn}></div>
    </div>
  );
};
