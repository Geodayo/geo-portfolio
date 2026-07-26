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
