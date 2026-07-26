// Shared by both the client (page-layout.component.tsx, to generate channel
// ids) and the server (knowledge.ts, to match a channel name mentioned in a
// reply back to that same id) — kept in one place so the two never drift
// out of sync with each other.
export function slugifyChannelText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
