import { FrontPage } from "../../../containers/front-page/front-page.container";

export default async function ServerChannelPage({
  params,
}: {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}) {
  const { serverSlug, channelSlug } = await params;
  return <FrontPage serverSlug={serverSlug} channelSlug={channelSlug} />;
}
