"use client";
import { useEffect, useState, useRef } from "react";
import { Testimonial } from "../../data/testimonials";

interface Carousel3DProps {
  testimonials?: Testimonial[];
}

export default function Carousel3D({ testimonials = [] }: Carousel3DProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const autoRotateRef = useRef(true);

  const totalItems = Math.max(testimonials.length, 6);
  const spreadAngle = 360 / totalItems;
  const rotateSpeed = 20;
  const translateZ = 320;
  const borderRadius = 12;
  const cardWidth = 240;
  const cardHeight = 180;

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "carousel-3d-styles";
    style.textContent = `
      @keyframes carouselRotation {
        from {
          transform: translate(-50%, -50%) rotateY(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotateY(360deg);
        }
      }

      .carousel-3d-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform-style: preserve-3d;
      }

      .carousel-3d-wrapper figure {
        position: absolute;
        margin: 0;
        backface-visibility: hidden;
      }

      .carousel-3d-wrapper figure {
        overflow: visible;
        transition: transform 0.05s ease-out;
      }

      .testimonial-card {
        width: 100%;
        height: 100%;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        padding: 1rem;
        transition: transform 0.3s ease;
      }

      .carousel-3d-wrapper figure:hover .testimonial-card {
        transform: scale(1.05);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      }
    `;

    // Only add if not already exists
    if (!document.getElementById("carousel-3d-styles")) {
      document.head.appendChild(style);
    }

    // Resume animation when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const wrapper = document.querySelector(
          ".carousel-3d-wrapper"
        ) as HTMLElement;
        if (wrapper) {
          wrapper.style.animationPlayState = "running";
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (document.getElementById("carousel-3d-styles")) {
        document.head.removeChild(style);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [rotateSpeed]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    autoRotateRef.current = false;
    startX.current = e.touches[0].clientX;
    currentRotation.current = rotation;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const newRotation = currentRotation.current + deltaX;
    setRotation(newRotation);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    autoRotateRef.current = false;
    startX.current = e.clientX;
    currentRotation.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    const newRotation = currentRotation.current + deltaX;
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 1000);
  };

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRotateRef.current && !isDragging) {
        setRotation((prev) => prev - 0.3);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div
      style={{
        width: "100%",
        height: "280px",
        position: "relative",
        perspective: "1200px",
        overflow: "hidden",
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="carousel-3d-wrapper"
        style={{ transform: `translate(-50%, -50%) rotateY(${rotation}deg)` }}
      >
        {testimonials.map((testimonial, index) => {
          const angle = index * spreadAngle;
          const transform = `translateX(-50%) translateY(-50%) rotateY(${angle}deg) translateZ(${translateZ}px)`;
          return (
            <figure
              key={index}
              style={{
                width: cardWidth,
                height: cardHeight,
                transform,
                borderRadius,
                cursor: "pointer",
              }}
            >
              <div className="testimonial-card">
                {/* Profile Photo & Name */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                  "{testimonial.text}"
                </p>
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
