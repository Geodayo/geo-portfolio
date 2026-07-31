import styles from "./video.module.scss";
import { VIDEO_ASSET, getVideoMeta } from "../../lib/assets";

export interface VideoProps {
  /** A YouTube/Vimeo watch URL, or a path to a file in public/ ("/videos/foo.mp4"). */
  url: string;
}

/** Anything rooted at "/" is served out of public/ rather than embedded. */
const isSelfHosted = (url: string): boolean => url.startsWith("/");

type VideoPlatform = "youtube" | "vimeo" | null;

const extractYouTubeId = (url: string): string | null => {
  // Handle various YouTube URL formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://youtube.com/watch?v=VIDEO_ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const extractVimeoId = (url: string): string | null => {
  // Handle various Vimeo URL formats:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const patterns = [
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const getVideoInfo = (url: string): { platform: VideoPlatform; videoId: string | null } => {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return { platform: "youtube", videoId: youtubeId };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return { platform: "vimeo", videoId: vimeoId };
  }

  return { platform: null, videoId: null };
};

export const Video = ({ url }: VideoProps) => {
  // Self-hosted clips play in a native <video> — no embed to build, and the
  // real dimensions come out of assets.json so the box is the file's own
  // shape instead of a letterboxed 16:9.
  if (isSelfHosted(url)) {
    const meta = getVideoMeta(url) ?? VIDEO_ASSET;

    return (
      <div className={styles.container}>
        <div
          className={styles.videoWrapper}
          style={{ aspectRatio: meta.aspectRatio }}
        >
          <video
            className={styles.video}
            src={url}
            width={meta.width}
            height={meta.height}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    );
  }

  const { platform, videoId } = getVideoInfo(url);

  if (!platform || !videoId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Invalid video URL. Please provide a valid YouTube or Vimeo link.
        </div>
      </div>
    );
  }

  const embedUrl =
    platform === "youtube"
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://player.vimeo.com/video/${videoId}`;

  return (
    <div className={styles.container}>
      {/* Every embed is 16:9 (VIDEO_ASSET in assets.json), so the wrapper can
          hold the player's box open before the iframe has anything to show. */}
      <div
        className={styles.videoWrapper}
        style={{ aspectRatio: VIDEO_ASSET.aspectRatio }}
      >
        <iframe
          className={styles.video}
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};
