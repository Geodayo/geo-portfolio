import { useState, type FormEvent } from "react";
import styles from "./input-form.module.scss";
import cx from "clsx";

export interface InputFormProps {
  disableForm?: boolean;
  placeholder?: string;
  onSendMessage?: (text: string) => void;
}

export const InputForm = ({
  disableForm,
  placeholder,
  onSendMessage,
}: InputFormProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSendMessage?.(trimmed);
    setValue("");
  };

  return (
    <div
      className={cx(styles.container, {
        [styles.disableForm]: disableForm,
      })}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.addButton} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4v16M4 12h16"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <input
          disabled={disableForm}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            placeholder ??
            (disableForm
              ? "You do not have permission to send messages in this channel."
              : "Send a message")
          }
        ></input>
      </form>
    </div>
  );
};
