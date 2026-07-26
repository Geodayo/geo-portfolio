export interface ChatApiError {
  error: string;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiResponse {
  reply: string;
  /** Id/slug of something the reply mentioned (a server slug, or a channel
   * id like "channel-my-language-app-components") — see
   * resolvePointerTarget in src/lib/knowledge.ts. Lets the UI point the
   * arrow at it automatically when the bot talks about it. */
  pointerTarget: string | null;
}

export interface ChatPageContext {
  /** Slug of the server page the visitor is currently on, or null for the
   * Front Page. Tells the model what "this project"/"this one" refers to. */
  serverSlug: string | null;
  /** Display name of that page, e.g. "My Language App" or "Front Page". */
  serverName: string;
  /** Display names of that page's channels, e.g. ["general", "Components"],
   * so a reply mentioning one can be matched back to its id. */
  channels: string[];
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryMessage[] = [],
  context?: ChatPageContext
): Promise<ChatApiResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, context }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      (data as ChatApiError | null)?.error ??
      "Something went wrong talking to the assistant.";
    throw new Error(errorMessage);
  }

  const parsed = data as { reply?: string; pointerTarget?: string | null };
  return {
    reply: parsed.reply ?? "",
    pointerTarget: parsed.pointerTarget ?? null,
  };
}
