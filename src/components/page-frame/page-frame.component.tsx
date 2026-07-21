import styles from "./page-frame.module.scss";

export interface PageFrameProps {
  headerTitle: string;
  children: React.ReactNode;
}

export const PageFrame = ({ headerTitle, children }: PageFrameProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.frameHeader}>{headerTitle}</div>
        <div className={styles.frameContent}>{children}</div>
      </div>
    </div>
  );
};
