import { useMemo } from "react";
import styles from "./pointer-line.module.scss";

export interface PointerLinePoint {
  x: number;
  y: number;
}

export interface PointerLineProps {
  className?: string;
  /** Where the line starts — the GeoBot avatar of the message that called
   * this pointer out. Same container-relative coordinate space as `to`
   * (see usePointerTarget). */
  from: PointerLinePoint;
  /** Where the line ends — the target element's landing point. */
  to: PointerLinePoint;
  color?: string;
}

const ARROWHEAD_LENGTH = 16;
const ARROWHEAD_SPREAD = (26 * Math.PI) / 180;
// The line always leaves the avatar heading straight up, and always
// arrives at the target heading straight left (so the arrowhead reads as
// "pointing left into it") — fixed departure/arrival directions, rather
// than ones derived from the straight line between the two points, are
// what make this bend into a proper S instead of a single lopsided bow.
const START_TANGENT = { x: 0, y: -1 };
const END_TANGENT = { x: -1, y: 0 };
// How far each control point sits from its endpoint along that tangent, as
// a fraction of the distance between the two points — clamped so short
// hops don't overshoot and long ones don't stretch out absurdly far. This
// is the main knob for "how curvy" the S reads.
const MIN_PULL = 40;
const MAX_PULL = 240;
const PULL_RATIO = 0.55;

// A full hand-drawn-style dashed line from a GeoBot reply's avatar all the
// way to whatever it's pointing at (see resolvePointerTarget in
// src/lib/knowledge.ts), rather than a small decorative arrow floating near
// just the target. Both endpoints are plain {x, y} points already resolved
// to the shared container's coordinate space (see usePointerTarget), so
// this component only has to worry about the curve/arrowhead math — not
// where things actually live on the page.
export const PointerLine = ({ className, from, to, color = "#fff" }: PointerLineProps) => {
  const { pathD, headD } = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Control points are placed by walking a fixed distance out from each
    // endpoint along that endpoint's fixed tangent direction (a standard
    // Hermite-to-Bezier conversion) — since the two tangents point in
    // different directions (up, then left), the curve necessarily bends
    // one way near the start and the other way near the end, i.e. an S.
    const pull = Math.min(MAX_PULL, Math.max(MIN_PULL, dist * PULL_RATIO));
    const control1 = {
      x: from.x + START_TANGENT.x * pull,
      y: from.y + START_TANGENT.y * pull,
    };
    const control2 = {
      x: to.x - END_TANGENT.x * pull,
      y: to.y - END_TANGENT.y * pull,
    };

    const pathD = `M ${from.x} ${from.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${to.x} ${to.y}`;

    // The arrowhead always points along END_TANGENT, since that's the
    // direction the curve is guaranteed to be arriving from regardless of
    // where the two endpoints actually sit.
    const tangentAngle = Math.atan2(END_TANGENT.y, END_TANGENT.x);
    const backAngle = tangentAngle + Math.PI;
    const wing1 = {
      x: to.x + ARROWHEAD_LENGTH * Math.cos(backAngle - ARROWHEAD_SPREAD),
      y: to.y + ARROWHEAD_LENGTH * Math.sin(backAngle - ARROWHEAD_SPREAD),
    };
    const wing2 = {
      x: to.x + ARROWHEAD_LENGTH * Math.cos(backAngle + ARROWHEAD_SPREAD),
      y: to.y + ARROWHEAD_LENGTH * Math.sin(backAngle + ARROWHEAD_SPREAD),
    };
    const headD = `M ${wing1.x} ${wing1.y} L ${to.x} ${to.y} L ${wing2.x} ${wing2.y}`;

    return { pathD, headD };
  }, [from.x, from.y, to.x, to.y]);

  return (
    <svg
      className={[styles.pointerLine, className].filter(Boolean).join(" ")}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <path
        className={styles.line}
        d={pathD}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={headD}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
