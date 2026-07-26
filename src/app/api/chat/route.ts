import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt, resolvePointerTarget, buildContextNote, type PageContext } from "@/lib/knowledge";
import { checkRateLimit } from "@/lib/rate-limit";

// Ported from wip/api/chat.ts (a plain Vercel Node function) into a Next.js
// App Router route handler. Runs on the Node.js runtime (the default for
// route handlers) rather than Edge.
export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 500;
const MAX_TOKENS = 300;
// How many prior turns of a conversation we'll forward to the model. Chat
// Completions APIs are stateless — the model only knows what's in this
// request's `messages` array — so without forwarding history, every message
// looks like the start of a brand new conversation to it.
const MAX_HISTORY_MESSAGES = 20;
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
// Override with the AI_GATEWAY_MODEL env var once you've picked a model in
// the Vercel dashboard (creator/model-name, e.g. "anthropic/claude-haiku-4.5").
const MODEL = process.env.AI_GATEWAY_MODEL || "anthropic/claude-haiku-4.5";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is not configured with an AI Gateway API key." },
      { status: 500 }
    );
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip).allowed) {
    return NextResponse.json(
      { error: "Too many messages — please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` },
      { status: 400 }
    );
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history = rawHistory
    .filter(
      (entry): entry is { role: "user" | "assistant"; content: string } =>
        typeof entry === "object" &&
        entry !== null &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string" &&
        entry.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  const rawContext = body.context;
  const context: PageContext | null =
    typeof rawContext === "object" &&
    rawContext !== null &&
    (typeof (rawContext as { serverSlug?: unknown }).serverSlug === "string" ||
      (rawContext as { serverSlug?: unknown }).serverSlug === null) &&
    typeof (rawContext as { serverName?: unknown }).serverName === "string"
      ? {
          serverSlug: (rawContext as { serverSlug: string | null }).serverSlug,
          serverName: (rawContext as { serverName: string }).serverName.slice(0, 100),
          channels: Array.isArray((rawContext as { channels?: unknown }).channels)
            ? ((rawContext as { channels: unknown[] }).channels
                .filter((c): c is string => typeof c === "string")
                .slice(0, 20))
            : [],
        }
      : null;
  const contextNote = buildContextNote(context);

  try {
    const gatewayResponse = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "system", content: getSystemPrompt() },
          ...(contextNote ? [{ role: "system" as const, content: contextNote }] : []),
          ...history,
          { role: "user", content: message },
        ],
      }),
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error("AI Gateway error:", gatewayResponse.status, errorText);
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = (await gatewayResponse.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't come up with a response to that.";
    const pointerTarget = resolvePointerTarget(reply, context);

    return NextResponse.json({ reply, pointerTarget });
  } catch (err) {
    console.error("Chat handler error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating a response." },
      { status: 500 }
    );
  }
}
