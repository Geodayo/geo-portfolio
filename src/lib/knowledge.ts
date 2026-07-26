// Ported from wip/api/_lib/knowledge.ts. The original read these JSON files
// off disk at request time (fs.readFileSync against `public/data`), which
// works for a plain Vercel Node function but isn't guaranteed to survive
// Next.js's build-time file tracing into the deployed function bundle.
// Importing the JSON directly makes webpack bundle it with the route, so
// it's always present at runtime — and the files still live under
// `public/data` so the frontend can also fetch them client-side.
//
// Trade-off: each project's detail file needs an explicit import + entry in
// SERVER_DETAILS below. Adding a new project means adding both the JSON file
// under public/data/servers/ and a line here.
import aboutData from "../../public/data/about.json";
import usersData from "../../public/data/users.json";
import serversData from "../../public/data/servers.json";
import cyndaMediaLab from "../../public/data/servers/cynda-media-lab.json";
import fabricVentures from "../../public/data/servers/fabric-ventures.json";
import myLanguageApp from "../../public/data/servers/my-language-app.json";
import { slugifyChannelText } from "./slugify";

interface ServerSummary {
  slug: string;
  name: string;
  thumbnail?: string;
  /** Nicknames/abbreviations visitors (or Jorge himself) might use instead
   * of the full name — e.g. "MLA" for My Language App. Surfaced to the
   * model in the system prompt, and also checked by
   * findMentionedServerSlug so the pointer-arrow trigger recognizes them
   * too, not just the exact registered name. */
  aliases?: string[];
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

// What page the visitor is currently on, sent up by the client (see
// ChatPageContext in src/services/chat-api.ts) so the model can resolve
// "this project"/"this channel" instead of asking which one they mean.
export interface PageContext {
  serverSlug: string | null;
  serverName: string;
  channels: string[];
}

const SERVER_DETAILS: Record<string, ServerDetail> = {
  "cynda-media-lab": cyndaMediaLab as ServerDetail,
  "fabric-ventures": fabricVentures as ServerDetail,
  "my-language-app": myLanguageApp as ServerDetail,
};

// Cached for the lifetime of the serverless instance so we don't rebuild the
// prompt on every request. Resets naturally on cold start / redeploy.
let cachedPrompt: string | null = null;

function buildAboutSection(): string {
  const about = aboutData as AboutData;
  const parts: string[] = [];
  if (about.bio?.length) parts.push(about.bio.join(" "));
  if (about.skills?.length) parts.push(`Skills: ${about.skills.join(", ")}.`);
  if (about.contact) {
    const contactLines = Object.entries(about.contact).map(
      ([key, value]) => `${key}: ${value}`
    );
    if (contactLines.length) parts.push(`Contact: ${contactLines.join(", ")}.`);
  }

  const users = usersData as Record<string, UserProfileData>;
  const geoLinks = users?.geo?.links?.filter(
    (link) => !link.includes("REPLACE_WITH_YOUR_HANDLE")
  );
  if (geoLinks?.length) parts.push(`Links: ${geoLinks.join(", ")}.`);

  return parts.join("\n") || "No bio provided yet.";
}

function buildProjectsSection(): string {
  const servers = serversData as ServerSummary[];
  const sections: string[] = [];

  for (const server of servers) {
    const detail = SERVER_DETAILS[server.slug];
    if (!detail) continue;

    const aliasNote = server.aliases?.length ? ` (also called: ${server.aliases.join(", ")})` : "";
    const lines: string[] = [`### ${server.name}${aliasNote}`];
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

// Used to trigger the pointer-arrow UI (see page-layout.component.tsx) when
// the assistant's reply is about a specific project: a simple, deterministic
// case-insensitive check for whether any known server's name (or one of its
// aliases) shows up in the reply text, rather than trusting the model to
// emit some structured tag. Since buildProjectsSection() headers each
// project as "### {name} (also called: ...)", the model is told about both
// and will naturally use whichever fits the conversation.
export function findMentionedServerSlug(text: string): string | null {
  const servers = serversData as ServerSummary[];
  const lowerText = text.toLowerCase();
  const match = servers.find((server) =>
    [server.name, ...(server.aliases ?? [])].some((name) =>
      lowerText.includes(name.toLowerCase())
    )
  );
  return match?.slug ?? null;
}

// A short, per-request addendum (not part of the cached base prompt below,
// since this changes on every message) telling the model which page the
// visitor is currently looking at, so "this project" or "this channel"
// resolves correctly instead of the model listing every project and asking
// which one they meant.
export function buildContextNote(context?: PageContext | null): string | null {
  if (!context) return null;

  const channelsNote = context.channels.length
    ? ` Its channels are: ${context.channels.join(", ")}.`
    : "";

  return (
    `The visitor is currently looking at the "${context.serverName}" page.${channelsNote} ` +
    `If they say things like "this project", "this one", or "this channel", they mean this page ` +
    `unless the conversation clearly points somewhere else.`
  );
}

// Like findMentionedServerSlug, but also checks the CURRENT page's own
// channels first (matched against context.channels, then turned into the
// same "channel-{slug}-{slugified text}" id PageLayout gives each channel
// element — see slugifyChannelText). A channel on the current page takes
// priority over a different project's name, since "the Components channel"
// while already on that project's page should point at the channel, not
// re-point at the project itself.
export function resolvePointerTarget(text: string, context?: PageContext | null): string | null {
  const lowerText = text.toLowerCase();

  if (context) {
    const channelMatch = context.channels.find((channelName) =>
      lowerText.includes(channelName.toLowerCase())
    );
    if (channelMatch) {
      // Matches PageLayout's `channel-${activeServerSlug ?? "home"}-...`
      // id scheme exactly — see slugifyChannelText's usage there.
      return `channel-${context.serverSlug ?? "home"}-${slugifyChannelText(channelMatch)}`;
    }
  }

  return findMentionedServerSlug(text);
}

export function getSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt;

  cachedPrompt = [
    "You are the AI assistant embedded in Jorge's portfolio site, which is styled like a Discord server.",
    "Visitors are browsing Jorge's projects as if they were Discord channels, and can chat with you about Jorge's background, skills, and work.",
    "Answer using ONLY the information in the sections below. Speak about Jorge in the third person.",
    "Keep answers short and conversational (2-4 sentences) unless the visitor asks for more detail.",
    "If you don't have the information to answer, say so honestly and suggest the visitor reach out to Jorge directly. Never invent employers, dates, or skills that aren't listed below.",
    "",
    "## About Jorge",
    buildAboutSection(),
    "",
    "## Projects",
    buildProjectsSection(),
  ].join("\n");

  return cachedPrompt;
}
