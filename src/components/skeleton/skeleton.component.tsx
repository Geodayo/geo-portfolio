import cx from "clsx";
import styles from "./skeleton.module.scss";

export interface SkeletonProps {
  /**
   * width / height of the media this is standing in for (see
   * src/lib/assets.ts). Only needed when the skeleton has to size itself —
   * where it's stretched over an already-sized box (`position: absolute`),
   * leave it off and let the parent decide the shape.
   */
  aspectRatio?: number;
  /** Radius override, to match whatever it's covering. Defaults to 8px. */
  radius?: number;
  className?: string;
}

/**
 * Shimmering placeholder shown in place of an image or video embed until it
 * finishes loading.
 */
export const Skeleton = ({ aspectRatio, radius, className }: SkeletonProps) => (
  <div
    className={cx(styles.skeleton, className)}
    style={{
      ...(aspectRatio ? { aspectRatio } : null),
      ...(radius !== undefined ? { borderRadius: `${radius}px` } : null),
    }}
    aria-hidden="true"
  />
);
