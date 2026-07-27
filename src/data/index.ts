// Single entry point for the site's static content. These JSON files used to
// live under public/data and were fetched at runtime (client-side by the
// front page, bundled by the chat route); now they're plain imports, so
// webpack bundles them and nothing has to wait on a network round-trip.
//
// Trade-off: each project's detail file needs an explicit import + entry in
// serverDetails below — a dynamic `/data/servers/${slug}.json` fetch could
// resolve the path at runtime, an import can't. Adding a new project means
// dropping the JSON in ./servers and adding a line here.
//
// ./assets.json sits alongside these but isn't content — it's generated media
// metadata (`npm run assets`), and src/lib/assets.ts is what reads it.
import about from "./about.json";
import frontPage from "./frontpage.json";
import servers from "./servers.json";
import users from "./users.json";
import cyndaMediaLab from "./servers/cynda-media-lab.json";
import fabricVentures from "./servers/fabric-ventures.json";
import myLanguageApp from "./servers/my-language-app.json";
import smallerProjects from "./servers/smaller-projects.json";

export { about, frontPage, servers, users };

// Typed as `unknown` values on purpose: TypeScript infers each JSON file's
// literal shape (e.g. `type: string` where the components want
// `"text" | "gallery" | ...`), and those inferred shapes differ per file, so
// consumers cast the whole thing to their own view of the data — same as
// knowledge.ts already did with these imports.
export const serverDetails: Record<string, unknown> = {
  "cynda-media-lab": cyndaMediaLab,
  "fabric-ventures": fabricVentures,
  "my-language-app": myLanguageApp,
  "smaller-projects": smallerProjects,
};
