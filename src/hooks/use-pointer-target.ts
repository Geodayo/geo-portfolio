import { useEffect, useState, type RefObject } from "react";

export interface PointerTargetPoint {
  /** Center of the target element, relative to the container element. */
  x: number;
  y: number;
}

/**
 * Finds the element with `id === targetId` (via plain
 * `document.getElementById`, so any element anywhere can be targeted just
 * by giving it that id) and returns its center point relative to
 * `containerRef`'s element, re-measuring on mount and on window resize.
 *
 * Pass `null` for targetId to skip measuring (e.g. while the pointer
 * shouldn't be shown yet).
 */
export function usePointerTarget(
  containerRef: RefObject<HTMLElement | null>,
  targetId: string | null
): PointerTargetPoint | null {
  const [point, setPoint] = useState<PointerTargetPoint | null>(null);

  useEffect(() => {
    if (!targetId) {
      setPoint(null);
      return;
    }

    const measure = () => {
      const containerEl = containerRef.current;
      const targetEl = document.getElementById(targetId);
      if (!containerEl || !targetEl) {
        setPoint(null);
        return;
      }

      const containerBox = containerEl.getBoundingClientRect();
      const targetBox = targetEl.getBoundingClientRect();
      setPoint({
        x: targetBox.left - containerBox.left + targetBox.width / 2,
        y: targetBox.top - containerBox.top + targetBox.height / 2,
      });
    };

    measure();
    // Layout can still settle after the initial paint (fonts, images), so
    // take one more measurement on the next frame.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, targetId]);

  return point;
}
