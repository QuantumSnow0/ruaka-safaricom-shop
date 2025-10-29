"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getIndex = (offset: number) => {
    const length = images.length;
    return (currentIndex + offset + length) % length;
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
        <div className="relative w-full h-full overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={`Gallery image ${index + 1}`}
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden py-4">
      <div
        className="flex items-center justify-center relative mx-auto"
        style={{
          height: "240px",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
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
  );
}
