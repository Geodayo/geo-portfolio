"use client";
import { useEffect, useState } from "react";
import { PageLayout, type PageLayoutProps } from "../../components/page-layout/page-layout.component";
import { PageFrame } from "../../components/page-frame/page-frame.component";

// export interface FrontPageProps {}

export function FrontPage() {
    
    const [data, setData] = useState<PageLayoutProps | null>(null);

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((json) => setData(json));
    }, []);

    return (
        <>
        <PageFrame headerTitle="Geo Portfolio">
        {data && <PageLayout {...data}></PageLayout>}
        </PageFrame>
        </>
    )

}