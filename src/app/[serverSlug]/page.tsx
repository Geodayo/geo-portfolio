import { FrontPage } from "../../containers/front-page/front-page.container";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ serverSlug: string }>;
}) {
  const { serverSlug } = await params;
  return <FrontPage serverSlug={serverSlug} />;
}
