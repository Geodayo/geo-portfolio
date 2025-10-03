import styles from "./input-form.module.scss";
import cx from "clsx";

export interface InputFormProps {
  disableForm?: boolean;
}

export const InputForm = ({
  disableForm,
}: InputFormProps) => {
  return (
    <div
      className={cx(styles.container, {
        [styles.disableForm]: disableForm,
      })}
    >
      <form className={styles.form}>
        <input disabled={disableForm} type="text" placeholder="You do not have permission to send messages in this channel."></input>
      </form>
    </div>
  );
};
