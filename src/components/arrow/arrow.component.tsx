import styles from "./arrow.module.scss";

// Local coordinates (within the viewBox below) of the arrowhead's tip.
// Exported so consumers can figure out where to position this component's
// box so the tip lands exactly on some target point — see
// page-layout.component.tsx for the actual math.
export const ARROW_WIDTH = 84;
export const ARROW_HEIGHT = 104;
export const ARROW_TIP = { x: 42, y: 96 };

export interface ArrowProps {
  className?: string;
  /** Mirror the arrow horizontally. */
  flip?: boolean;
  /** Extra rotation in degrees, applied on top of the base curve. */
  rotate?: number;
  color?: string;
  /** Positioning styles (top/left/etc.) from the consumer, merged with the
   * component's own CSS variables. */
  style?: React.CSSProperties;
}

// A small hand-drawn-style curved arrow, meant to be absolutely positioned
// as a decorative hint pointing at some other part of the UI (e.g. "hey,
// look over there"). Purely visual — no click handling.
//
// The orientation (flip/rotate) is passed down as CSS custom properties
// rather than an inline `transform`, because the wiggle keyframes in
// arrow.module.scss also animate `transform` — animations win over inline
// styles in the cascade, so an inline transform would just get clobbered.
// Reading --arrow-rotate/--arrow-scale-x from within the keyframes keeps
// both in sync.
//
// transformOrigin is pinned to ARROW_TIP (in px, so it isn't affected by
// flip/rotate itself) rather than left at CSS's default center — that way,
// rotating this component always pivots around the arrowhead's tip, so a
// consumer that positioned the tip at some target point (see
// page-layout.component.tsx) can freely change `rotate` to swing the tail
// around to approach from a different direction, without the tip drifting
// off the target.
export const Arrow = ({
  className,
  flip = false,
  rotate = 0,
  color = "#fff",
  style,
}: ArrowProps) => {
  return (
    <svg
      className={[styles.arrow, className].filter(Boolean).join(" ")}
      style={
        {
          ...style,
          "--arrow-rotate": `${rotate}deg`,
          "--arrow-scale-x": flip ? -1 : 1,
          transformOrigin: `${ARROW_TIP.x}px ${ARROW_TIP.y}px`,
        } as React.CSSProperties
      }
      width={ARROW_WIDTH}
      height={ARROW_HEIGHT}
      viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M74 10c-40 2-56 30-46 54 6 15 20 22 14 32"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 8"
      />
      <path
        d={`M${ARROW_TIP.x - 16} ${ARROW_TIP.y - 18}L${ARROW_TIP.x} ${ARROW_TIP.y}L${ARROW_TIP.x + 10} ${ARROW_TIP.y - 22}`}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
