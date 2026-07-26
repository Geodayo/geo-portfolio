export interface ChatApiError {
  error: string;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryMessage[] = []
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      (data as ChatApiError | null)?.error ??
      "Something went wrong talking to the assistant.";
    throw new Error(errorMessage);
  }

  return (data as { reply: string }).reply;
}
