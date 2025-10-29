"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt?: string;
  span?: number;
}

interface GalleryGridProps {
  items: GalleryImage[];
  columns?: number;
  gap?: number;
  backgroundColor?: string;
  borderRadius?: number;
  enableAnimation?: boolean;
  animationDuration?: number;
  animationStagger?: number;
  enableHover?: boolean;
  hoverZoom?: number;
  hoverZoomDuration?: number;
  enableShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowX?: number;
  shadowY?: number;
  className?: string;
  noOverflow?: boolean;
}

export default function GalleryGrid({
  items = [],
  columns = 4,
  gap = 16,
  backgroundColor = "#FFFFFF",
  borderRadius = 8,
  enableAnimation = true,
  animationDuration = 0.5,
  animationStagger = 0.1,
  enableHover = true,
  hoverZoom = 1.1,
  hoverZoomDuration = 0.6,
  enableShadow = false,
  shadowColor = "#000000",
  shadowBlur = 20,
  shadowX = 0,
  shadowY = 4,
  className = "",
  noOverflow = false,
}: GalleryGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageAspectRatios, setImageAspectRatios] = useState<
    Record<number, number>
  >({});
  const [focusedImageIndex, setFocusedImageIndex] = useState<number | null>(
    null
  );

  const getRgbaColor = (color: string, opacity: number): string => {
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
      }
    }
    return color;
  };

  return (
    <>
      <div
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: noOverflow ? "repeat(2, 1fr)" : undefined,
          gridAutoRows: noOverflow ? undefined : "200px",
          gap: `${gap}px`,
          padding: `${gap}px`,
          backgroundColor,
          overflow: noOverflow ? "hidden" : "auto",
        }}
      >
        <style jsx>{`
          .gallery-grid-container::-webkit-scrollbar {
            display: none;
          }
          .gallery-grid-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const aspectRatio = imageAspectRatios[index] || 1;
          const columnSpan = Math.min(item.span || 1, columns);
          const rowSpan = Math.max(1, Math.round(columnSpan / aspectRatio));

          return (
            <motion.div
              key={index}
              initial={enableAnimation ? { opacity: 0, scale: 0.8 } : false}
              animate={enableAnimation ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: animationDuration,
                delay: index * animationStagger,
                ease: "easeOut",
              }}
              onMouseEnter={() => enableHover && setHoveredIndex(index)}
              onMouseLeave={() => enableHover && setHoveredIndex(null)}
              onClick={() => setFocusedImageIndex(index)}
              style={{
                gridColumn: `span ${columnSpan}`,
                gridRow: `span ${rowSpan}`,
                position: "relative",
                overflow: "hidden",
                borderRadius: `${borderRadius}px`,
                backgroundColor: "#F5F5F5",
                cursor: "pointer",
                boxShadow: enableShadow
                  ? `${shadowX}px ${shadowY}px ${shadowBlur}px 0px ${getRgbaColor(
                      shadowColor,
                      0.15
                    )}`
                  : "none",
              }}
            >
              <motion.img
                src={item.src}
                alt={item.alt || ""}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  const ratio = img.naturalWidth / img.naturalHeight;
                  setImageAspectRatios((prev) => ({
                    ...prev,
                    [index]: ratio,
                  }));
                }}
                animate={
                  enableHover ? { scale: isHovered ? hoverZoom : 1 } : {}
                }
                transition={{
                  duration: hoverZoomDuration,
                  ease: "easeOut",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {enableHover && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={isHovered ? { x: "100%" } : { x: "-100%" }}
                  transition={
                    isHovered
                      ? { duration: 0.6, ease: "easeInOut" }
                      : { duration: 0 }
                  }
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(110deg, 
                                        transparent 20%, 
                                        ${getRgbaColor("#FFFFFF", 0.4)} 50%, 
                                        transparent 80%)`,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {focusedImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFocusedImageIndex(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
            padding: "40px",
          }}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={items[focusedImageIndex]?.src || ""}
            alt={items[focusedImageIndex]?.alt || ""}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: `${borderRadius}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={() => setFocusedImageIndex(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </>
  );
}
