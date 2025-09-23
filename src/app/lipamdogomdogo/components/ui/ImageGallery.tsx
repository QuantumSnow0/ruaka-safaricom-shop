"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  discountPercentage?: number;
  className?: string;
}

export default function ImageGallery({
  images,
  productName,
  discountPercentage,
  className = "",
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touchX = e.touches[0].clientX;
    setCurrentX(touchX);
    setDragOffset(touchX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 50; // Minimum swipe distance
    const diff = currentX - startX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedImage > 0) {
        // Swipe right - go to previous image
        setSelectedImage(selectedImage - 1);
      } else if (diff < 0 && selectedImage < images.length - 1) {
        // Swipe left - go to next image
        setSelectedImage(selectedImage + 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Handle mouse events for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setCurrentX(e.clientX);
    setDragOffset(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 50;
    const diff = currentX - startX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedImage > 0) {
        setSelectedImage(selectedImage - 1);
      } else if (diff < 0 && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && selectedImage > 0) {
        setSelectedImage(selectedImage - 1);
      } else if (e.key === "ArrowRight" && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length]);

  // Auto-reset drag offset when not dragging
  useEffect(() => {
    if (!isDragging) {
      setDragOffset(0);
    }
  }, [isDragging]);

  const goToPrevious = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`aspect-[4/5] relative overflow-hidden bg-gray-50 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image Container */}
      <div className="relative group">
        <div
          ref={galleryRef}
          className="aspect-[4/5] relative overflow-hidden bg-gray-50 rounded-lg cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: isDragging
              ? `translateX(${dragOffset * 0.3}px)`
              : "translateX(0)",
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
        >
          {/* Discount Badge */}
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </div>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          )}

          {/* Main Image */}
          <Image
            src={images[selectedImage]}
            alt={`${productName} view ${selectedImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 select-none"
            priority
            draggable={false}
          />

          {/* Desktop Arrow Navigation */}
          {images.length > 1 && (
            <>
              {/* Previous Arrow */}
              {selectedImage > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-100 group-hover:opacity-100 text-center md:block"
                  aria-label="Previous image"
                >
                  <div className="flex items-center justify-center">
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </div>
                </button>
              )}

              {/* Next Arrow */}
              {selectedImage < images.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2  -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-100 group-hover:opacity-100 md:block"
                  aria-label="Next image"
                >
                  <div className="flex items-center justify-center">
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 bg-gray-50 transition-all duration-200 ${
                selectedImage === index
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {/* Discount Badge on Thumbnail */}
              {discountPercentage && discountPercentage > 0 && (
                <div className="absolute top-1 left-1 z-10">
                  <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    -{discountPercentage}%
                  </div>
                </div>
              )}

              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 8.33vw"
                className="object-contain p-1"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
