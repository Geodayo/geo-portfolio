import type { IncomingMessage, ServerResponse } from "http";
import { getSystemPrompt } from "./_lib/knowledge";
import { checkRateLimit } from "./_lib/rate-limit";

// Runs as a Node serverless function (not Edge) since it reads project
// files off disk to build the knowledge base.
export const config = { runtime: "nodejs" };

const MAX_MESSAGE_LENGTH = 500;
const MAX_TOKENS = 300;
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
// Override with the AI_GATEWAY_MODEL env var once you've picked a model in
// the Vercel dashboard (creator/model-name, e.g. "anthropic/claude-haiku-4.5").
const MODEL = process.env.AI_GATEWAY_MODEL || "anthropic/claude-haiku-4.5";

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      // Guard against oversized payloads before JSON.parse even runs.
      if (data.length > 10_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "Server is not configured with an AI Gateway API key.",
    });
    return;
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip).allowed) {
    sendJson(res, 429, {
      error: "Too many messages — please wait a few minutes and try again.",
    });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid request body." });
    return;
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    sendJson(res, 400, { error: "Message is required." });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, {
      error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
    });
    return;
  }

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
          { role: "user", content: message },
        ],
      }),
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error("AI Gateway error:", gatewayResponse.status, errorText);
      sendJson(res, 502, { error: "The assistant is temporarily unavailable." });
      return;
    }

    const data = (await gatewayResponse.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't come up with a response to that.";

    sendJson(res, 200, { reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    sendJson(res, 500, { error: "Something went wrong generating a response." });
  }
}
