import { useState, useEffect } from "react";
import styles from "./gallery.module.scss";

export interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.gallery}>
          {images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className={styles.image}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </div>
      {selectedIndex !== null && (
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
            src={images[selectedIndex]} 
            alt={`Gallery image ${selectedIndex + 1}`}
            className={styles.fullSizeImage}
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
