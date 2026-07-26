"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout, type ServerDetailData, type ServerSummary } from "../../components/page-layout/page-layout.component";
import { PageFrame } from "../../components/page-frame/page-frame.component";

export interface FrontPageProps {
  serverSlug: string | null;
}

export function FrontPage({ serverSlug }: FrontPageProps) {
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
            onSelectServer={(slug) => router.push(slug ? `/${slug}` : "/")}
        ></PageLayout>
    )}
    </PageFrame>
    </>
  )

}
