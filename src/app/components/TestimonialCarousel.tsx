"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, isAutoRotating, isDragging]);

  const getIndex = (offset: number) => {
    const length = images.length;
    return (currentIndex + offset + length) % length;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // Only swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;

    // Check if it's a horizontal swipe (need significant horizontal movement)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }

    setIsDragging(false);
    setTimeout(() => setIsAutoRotating(true), 2000);
  };

  const getImageCard = (
    index: number,
    position: "left" | "center" | "right"
  ) => {
    const imageSrc = images[index];
    const isCenter = position === "center";

    return (
      <div
        key={`${index}-${position}`}
        className={`transition-all duration-500 ease-out ${
          isCenter ? "scale-100 opacity-100 z-10" : "scale-75 opacity-60 -z-10"
        }`}
        style={{
          width: isCenter ? "240px" : "180px",
          height: isCenter ? "200px" : "150px",
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden shadow-lg cursor-pointer"
          onClick={() => isCenter && setSelectedImage(imageSrc)}
        >
          <Image
            src={imageSrc}
            alt={`Gallery image ${index + 1}`}
            fill
            className="object-contain scale-110"
            sizes="280px"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="w-full overflow-hidden py-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex items-center justify-center relative mx-auto"
          style={{
            height: "240px",
            width: "100%",
            maxWidth: "100vw",
            overflow: "hidden",
            touchAction: "pan-x pinch-zoom",
          }}
        >
          {/* Left Image - Behind */}
          <div
            className="absolute transition-all duration-500 ease-out"
            style={{
              left: "10%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            {getImageCard(getIndex(-1), "left")}
          </div>

          {/* Center Image - Focused */}
          <div className="relative z-10 mx-auto transition-all duration-500 ease-out">
            {getImageCard(currentIndex, "center")}
          </div>

          {/* Right Image - Behind */}
          <div
            className="absolute transition-all duration-500 ease-out"
            style={{
              right: "10%",
              transform: "translateX(50%)",
              zIndex: 1,
            }}
          >
            {getImageCard(getIndex(1), "right")}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
          >
            ×
          </button>
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Full size image"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
