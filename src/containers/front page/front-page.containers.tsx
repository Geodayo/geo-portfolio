"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, type ServerDetailData, type ServerSummary } from "../../components/page-layout/page-layout.component";
import { PageFrame } from "../../components/page-frame/page-frame.component";

export function FrontPage() {

    const { serverSlug } = useParams<{ serverSlug?: string }>();
    const navigate = useNavigate();

    const [servers, setServers] = useState<ServerSummary[] | null>(null);
    const [activeServerData, setActiveServerData] = useState<ServerDetailData | null>(null);

    useEffect(() => {
        fetch("/data/servers.json")
            .then((res) => res.json())
            .then((json) => setServers(json));
    }, []);

    const activeSlug = serverSlug && servers?.some((server) => server.slug === serverSlug)
        ? serverSlug
        : null;

    useEffect(() => {
        if (!servers) return;
        if (serverSlug && !activeSlug) {
            navigate("/", { replace: true });
        }
    }, [servers, serverSlug, activeSlug, navigate]);

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
                onSelectServer={(slug) => navigate(slug ? `/${slug}` : "/")}
            ></PageLayout>
        )}
        </PageFrame>
        </>
    )

}
