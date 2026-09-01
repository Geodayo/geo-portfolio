// Client for the contact form endpoint (src/app/api/contact/route.ts) —
// same shape as chat-api.ts's sendChatMessage: throws with the server's
// error text so the form can show it inline.

export interface ContactSubmission {
  email: string;
  subject: string;
  message: string;
  /** Honeypot — hidden from humans, so anything in here means a bot. Sent
   * along so the server can quietly drop the submission. */
  company?: string;
}

export async function sendContactMessage(submission: ContactSubmission): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Something went wrong sending your message.");
  }
}
