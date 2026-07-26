import { useState } from "react";
import cx from "clsx";
import styles from "./video.module.scss";
import { Skeleton } from "../skeleton/skeleton.component";
import { VIDEO_ASSET } from "../../lib/assets";

export interface VideoProps {
  url: string;
}

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
  const { platform, videoId } = getVideoInfo(url);
  const [loaded, setLoaded] = useState(false);

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
          hold the player's box open — and shimmer inside it — before the
          iframe has anything to show. */}
      <div
        className={styles.videoWrapper}
        style={{ aspectRatio: VIDEO_ASSET.aspectRatio }}
      >
        {!loaded && <Skeleton className={styles.skeleton} />}
        <iframe
          className={cx(styles.video, { [styles.videoLoaded]: loaded })}
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
};
