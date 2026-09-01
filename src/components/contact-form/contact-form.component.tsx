import { useState, type FormEvent } from "react";
import styles from "./contact-form.module.scss";
import { sendContactMessage } from "../../services/contact-api";
import { trackEvent } from "../../lib/analytics";

export const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // The honeypot (see the hidden input below) — humans never see it, so a
  // non-empty value means a bot filled the form.
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      await sendContactMessage({
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        company,
      });
      setSent(true);
      trackEvent("contact_submit");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong sending your message."
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.successTitle}>Message sent ✅</div>
          <div className={styles.successText}>
            Thanks for reaching out — Jorge will get back to you at {email.trim()}.
          </div>
          <button
            type="button"
            className={styles.sendAnother}
            onClick={() => {
              setSent(false);
              setSubject("");
              setMessage("");
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Your email</span>
          <input
            className={styles.input}
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={sending}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Subject</span>
          <input
            className={styles.input}
            type="text"
            required
            maxLength={150}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="What's this about?"
            disabled={sending}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Message</span>
          <textarea
            className={styles.textarea}
            required
            maxLength={3000}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message..."
            disabled={sending}
          />
        </label>
        {/* Honeypot — kept out of sight (not display:none, which some bots
            check for) and out of the tab order. */}
        <input
          className={styles.honeypot}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          name="company"
        />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submit} type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
};
