import { readFileSync } from "fs";
import { join } from "path";

interface ServerSummary {
  slug: string;
  name: string;
  thumbnail?: string;
}

interface MessageEntry {
  messageText?: string[];
}

interface ChannelEntry {
  text: string;
  messages?: MessageEntry[];
}

interface ServerDetail {
  channels: ChannelEntry[];
}

interface AboutData {
  bio?: string[];
  skills?: string[];
  contact?: Record<string, string>;
}

interface UserProfileData {
  bio?: string[];
  links?: string[];
}

const DATA_DIR = join(process.cwd(), "public", "data");

// Cached for the lifetime of the serverless instance so we don't re-read
// disk on every request. Resets naturally on cold start / redeploy.
let cachedPrompt: string | null = null;

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

function buildAboutSection(): string {
  const about = readJson<AboutData>(join(DATA_DIR, "about.json"));
  if (!about) return "No bio provided yet.";

  const parts: string[] = [];
  if (about.bio?.length) parts.push(about.bio.join(" "));
  if (about.skills?.length) parts.push(`Skills: ${about.skills.join(", ")}.`);
  if (about.contact) {
    const contactLines = Object.entries(about.contact).map(
      ([key, value]) => `${key}: ${value}`
    );
    if (contactLines.length) parts.push(`Contact: ${contactLines.join(", ")}.`);
  }

  const users = readJson<Record<string, UserProfileData>>(
    join(DATA_DIR, "users.json")
  );
  const geoLinks = users?.geo?.links?.filter(
    (link) => !link.includes("REPLACE_WITH_YOUR_HANDLE")
  );
  if (geoLinks?.length) parts.push(`Links: ${geoLinks.join(", ")}.`);

  return parts.join("\n") || "No bio provided yet.";
}

function buildProjectsSection(): string {
  const servers = readJson<ServerSummary[]>(join(DATA_DIR, "servers.json")) ?? [];
  const sections: string[] = [];

  for (const server of servers) {
    const detail = readJson<ServerDetail>(
      join(DATA_DIR, "servers", `${server.slug}.json`)
    );
    if (!detail) continue;

    const lines: string[] = [`### ${server.name}`];
    for (const channel of detail.channels ?? []) {
      const text = (channel.messages ?? [])
        .flatMap((message) => message.messageText ?? [])
        .filter(Boolean)
        .join(" ");
      if (text) lines.push(`- ${channel.text}: ${text}`);
    }
    if (lines.length > 1) sections.push(lines.join("\n"));
  }

  return sections.join("\n\n") || "No project info available.";
}

export function getSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt;

  cachedPrompt = [
    "You are the AI assistant embedded in Geo's portfolio site, which is styled like a Discord server.",
    "Visitors are browsing Geo's projects as if they were Discord channels, and can chat with you about Geo's background, skills, and work.",
    "Answer using ONLY the information in the sections below. Speak about Geo in the third person.",
    "Keep answers short and conversational (2-4 sentences) unless the visitor asks for more detail.",
    "If you don't have the information to answer, say so honestly and suggest the visitor reach out to Geo directly. Never invent employers, dates, or skills that aren't listed below.",
    "",
    "## About Geo",
    buildAboutSection(),
    "",
    "## Projects",
    buildProjectsSection(),
  ].join("\n");

  return cachedPrompt;
}
