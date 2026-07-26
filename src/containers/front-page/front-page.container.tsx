"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout, type ServerDetailData, type ServerSummary } from "../../components/page-layout/page-layout.component";
import { PageFrame } from "../../components/page-frame/page-frame.component";
import { frontPage, servers as serversData, serverDetails } from "../../data";

const servers = serversData as ServerSummary[];
const frontPageData = frontPage as unknown as ServerDetailData;

export interface FrontPageProps {
  serverSlug: string | null;
  /** Slug of the channel to open directly, from the optional
   * /[serverSlug]/[channelSlug] route segment — null when no channel was
   * specified in the URL (falls back to that server's default channel). */
  channelSlug: string | null;
}

export function FrontPage({ serverSlug, channelSlug }: FrontPageProps) {
  const router = useRouter();

  const activeSlug = serverSlug && servers.some((server) => server.slug === serverSlug)
    ? serverSlug
    : null;

  useEffect(() => {
    if (serverSlug && !activeSlug) {
      router.replace("/");
    }
  }, [serverSlug, activeSlug, router]);

  const activeServerData = activeSlug
    ? (serverDetails[activeSlug] as ServerDetailData) ?? null
    : null;

  return (
    <>
    <PageFrame headerTitle="Geo Portfolio">
        <PageLayout
            servers={servers}
            activeServerSlug={activeSlug}
            activeServerData={activeServerData}
            frontPageData={frontPageData}
            initialChannelSlug={activeSlug ? channelSlug : null}
            onSelectServer={(slug) => router.push(slug ? `/${slug}` : "/")}
            onSelectChannel={(newChannelSlug) => {
              // Channel deep-linking only exists for server pages today —
              // /[serverSlug]/[channelSlug] — the Front Page has no
              // matching route (it'd collide with /[serverSlug] itself), so
              // channel switches there just stay client-side state.
              if (activeSlug) router.push(`/${activeSlug}/${newChannelSlug}`);
            }}
        ></PageLayout>
    </PageFrame>
    </>
  )

}
