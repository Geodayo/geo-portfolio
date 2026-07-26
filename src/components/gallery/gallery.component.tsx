import { useState, useEffect } from "react";
import cx from "clsx";
import styles from "./gallery.module.scss";
import { getImageMeta } from "../../lib/assets";
import { useImageLoaded } from "../../hooks/use-image-loaded";

export interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isLoaded, markLoaded, registerImage } = useImageLoaded();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) =>
            prev !== null ? (prev - 1 + images.length) % images.length : null
          );
        } else if (e.key === "ArrowRight") {
          setSelectedIndex((prev) =>
            prev !== null ? (prev + 1) % images.length : null
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (images.length === 0) {
    return <div className={styles.container}>No images to display</div>;
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;
  const selectedMeta = selectedImage ? getImageMeta(selectedImage) : undefined;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.gallery}>
          {images.map((image, index) => {
            // width/height come from assets.json: they give the browser the
            // image's aspect ratio up front, so each masonry column reaches
            // its final height before anything downloads and the skeleton
            // shimmers in exactly the space the picture will fill.
            const meta = getImageMeta(image);
            return (
              <img
                key={index}
                src={image}
                width={meta?.width}
                height={meta?.height}
                alt={`Gallery image ${index + 1}`}
                className={cx(styles.image, { [styles.loading]: !isLoaded(image) })}
                ref={registerImage(image)}
                onLoad={() => markLoaded(image)}
                onError={() => markLoaded(image)}
                onClick={() => setSelectedIndex(index)}
              />
            );
          })}
        </div>
      </div>
      {selectedIndex !== null && selectedImage && (
        <div
          className={styles.modal}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
            aria-label="Close"
          >
            ×
          </button>
          <button
            className={styles.navButtonLeft}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img
            src={selectedImage}
            width={selectedMeta?.width}
            height={selectedMeta?.height}
            alt={`Gallery image ${selectedIndex + 1}`}
            className={cx(styles.fullSizeImage, {
              [styles.loading]: !isLoaded(selectedImage),
            })}
            ref={registerImage(selectedImage)}
            onLoad={() => markLoaded(selectedImage)}
            onError={() => markLoaded(selectedImage)}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.navButtonRight}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex + 1) % images.length);
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};
