import { useCallback, useState } from "react";

/**
 * Tracks which images have finished loading, keyed by src, so a skeleton can
 * be swapped out per image (a gallery has many in flight at once).
 *
 * Wire all three up on the <img>:
 *
 *   <img
 *     ref={registerImage(src)}
 *     onLoad={() => markLoaded(src)}
 *     onError={() => markLoaded(src)}
 *   />
 *
 * `registerImage` covers the case React's onLoad can't: an image already in
 * the browser cache can finish before the handler is even attached, which
 * would otherwise leave its skeleton shimmering forever. Errors count as
 * loaded too — a broken image should show as broken, not as a placeholder
 * that never resolves.
 */
export const useImageLoaded = () => {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);

  const isLoaded = useCallback((src: string) => Boolean(loaded[src]), [loaded]);

  const registerImage = useCallback(
    (src: string) => (element: HTMLImageElement | null) => {
      if (element?.complete) markLoaded(src);
    },
    [markLoaded]
  );

  return { isLoaded, markLoaded, registerImage };
};
