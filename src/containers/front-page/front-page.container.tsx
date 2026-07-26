"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout, type ServerDetailData, type ServerSummary } from "../../components/page-layout/page-layout.component";
import { PageFrame } from "../../components/page-frame/page-frame.component";

export interface FrontPageProps {
  serverSlug: string | null;
  /** Slug of the channel to open directly, from the optional
   * /[serverSlug]/[channelSlug] route segment — null when no channel was
   * specified in the URL (falls back to that server's default channel). */
  channelSlug: string | null;
}

export function FrontPage({ serverSlug, channelSlug }: FrontPageProps) {
  const router = useRouter();

  const [servers, setServers] = useState<ServerSummary[] | null>(null);
  const [activeServerData, setActiveServerData] = useState<ServerDetailData | null>(null);
  const [frontPageData, setFrontPageData] = useState<ServerDetailData | null>(null);

  useEffect(() => {
    fetch("/data/servers.json")
      .then((res) => res.json())
      .then((json) => setServers(json));
  }, []);

  useEffect(() => {
    fetch("/data/frontpage.json")
      .then((res) => res.json())
      .then((json) => setFrontPageData(json));
  }, []);

  const activeSlug = serverSlug && servers?.some((server) => server.slug === serverSlug)
    ? serverSlug
    : null;

  useEffect(() => {
    if (!servers) return;
    if (serverSlug && !activeSlug) {
      router.replace("/");
    }
  }, [servers, serverSlug, activeSlug, router]);

  useEffect(() => {
    if (!activeSlug) {
      setActiveServerData(null);
      return;
    }
    setActiveServerData(null);
    fetch(`/data/servers/${activeSlug}.json`)
      .then((res) => res.json())
      .then((json) => setActiveServerData(json));
  }, [activeSlug]);

  return (
    <>
    <PageFrame headerTitle="Geo Portfolio">
    {servers && (
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
    )}
    </PageFrame>
    </>
  )

}
