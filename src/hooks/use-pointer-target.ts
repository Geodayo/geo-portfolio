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
 *
 * `remeasureKey` is for the case where the SAME id gets reassigned to a
 * DIFFERENT DOM node between calls (e.g. PageLayout's pointer-source avatar
 * id, which moves to whichever message most recently triggered a pointer
 * cue) — since the effect below only re-runs when its dependencies change,
 * and `targetId` alone wouldn't change in that case, pass something that
 * changes every time the underlying element might have (e.g. an
 * incrementing counter) to force a fresh measurement.
 */
export function usePointerTarget(
  containerRef: RefObject<HTMLElement | null>,
  targetId: string | null,
  remeasureKey?: string | number
): PointerTargetPoint | null {
  // The measurement is stored with the target it was taken against, not on
  // its own. Measuring can only happen in an effect — after a paint — so a
  // bare point would still describe the *previous* target for one frame
  // whenever targetId changes, and the arrow would visibly jump from the old
  // position to the new one. Tagging it lets the return below simply ignore a
  // measurement that no longer matches what's being asked for.
  const [measurement, setMeasurement] = useState<{
    targetId: string;
    key: string | number | undefined;
    point: PointerTargetPoint;
  } | null>(null);

  useEffect(() => {
    if (!targetId) return;

    const measure = () => {
      const containerEl = containerRef.current;
      const targetEl = document.getElementById(targetId);
      if (!containerEl || !targetEl) return;

      const containerBox = containerEl.getBoundingClientRect();
      const targetBox = targetEl.getBoundingClientRect();
      setMeasurement({
        targetId,
        key: remeasureKey,
        point: {
          x: targetBox.left - containerBox.left + targetBox.width / 2,
          y: targetBox.top - containerBox.top + targetBox.height / 2,
        },
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
  }, [containerRef, targetId, remeasureKey]);

  return measurement?.targetId === targetId && measurement?.key === remeasureKey
    ? measurement.point
    : null;
}
