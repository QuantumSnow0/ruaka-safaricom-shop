"use client";
import { useState, useRef, startTransition, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageCarouselGlassProps {
  images: string[];
  autoSwipeInterval?: number;
}

interface ImageCardProps {
  imageSrc: string;
  index: number;
  position: "front" | "middle" | "back";
  handleShuffle: () => void;
  isMobile: boolean;
}

function ImageCard({
  imageSrc,
  index,
  position,
  handleShuffle,
  isMobile,
}: ImageCardProps) {
  const dragRef = useRef(0);
  const cardStyle = useMemo(
    () => ({
      position: "absolute" as const,
      left: 0,
      top: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "16px",
      border: "none",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "8px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      userSelect: "none" as const,
      cursor: "grab",
      width: isMobile ? "240px" : "350px",
      height: isMobile ? "200px" : "280px",
      maxWidth: "100%",
      maxHeight: "100%",
      zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
      overflow: "hidden" as const,
    }),
    [isMobile, position]
  );

  const animateProps = useMemo(
    () => ({
      rotate:
        position === "front"
          ? "-4deg"
          : position === "middle"
          ? "0deg"
          : "4deg",
      x: position === "front" ? "0%" : position === "middle" ? "30%" : "60%",
      scale: position === "front" ? 1 : position === "middle" ? 0.9 : 0.8,
      opacity: position === "front" ? 1 : position === "middle" ? 0.7 : 0.5,
    }),
    [position]
  );

  return (
    <motion.div
      style={cardStyle}
      animate={animateProps}
      drag={true}
      dragElastic={0.35}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(event, info) => {
        dragRef.current = info.point.x;
      }}
      onDragEnd={(event, info) => {
        if (dragRef.current - info.point.x > 100) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileTap={{ cursor: "grabbing" }}
      onClick={() => {
        if (position === "front") {
          window.open(imageSrc, "_blank");
        }
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={`Gallery image ${index + 1}`}
          fill
          className="object-cover rounded-lg"
          sizes="280px"
        />
      </div>
    </motion.div>
  );
}

export default function ImageCarouselGlass({
  images,
  autoSwipeInterval = 2500,
}: ImageCarouselGlassProps) {
  const [currentImages, setCurrentImages] = useState<string[]>(images);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoSwiping, setIsAutoSwiping] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        startTransition(() => {
          setIsMobile(window.innerWidth < 768);
        });
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    setCurrentImages(images);
  }, [images]);

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoSwiping) return;

    const interval = setInterval(() => {
      const [first, ...rest] = currentImages;
      startTransition(() => {
        setCurrentImages([...rest, first]);
      });
    }, autoSwipeInterval);

    return () => clearInterval(interval);
  }, [currentImages, isAutoSwiping, autoSwipeInterval]);

  const handleShuffle = () => {
    setIsAutoSwiping(false);
    const [first, ...rest] = currentImages;
    startTransition(() => {
      setCurrentImages([...rest, first]);
    });
    // Resume auto-swipe after 2 seconds
    setTimeout(() => setIsAutoSwiping(true), 2000);
  };

  const visibleImages = useMemo(
    () => currentImages.slice(0, 3).reverse(),
    [currentImages]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        height: isMobile ? "240px" : "320px",
        overflow: "hidden",
      }}
    >
      {visibleImages.map((imageSrc, index) => {
        const position =
          index === 2 ? "front" : index === 1 ? "middle" : "back";
        return (
          <ImageCard
            key={`${imageSrc}-${index}-${currentImages.length}`}
            imageSrc={imageSrc}
            index={currentImages.indexOf(imageSrc)}
            position={position}
            handleShuffle={handleShuffle}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}
