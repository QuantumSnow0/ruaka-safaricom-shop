"use client";
import { useState, useRef, startTransition, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TestimonialItem {
  id: number;
  author: string;
  testimonial: string;
  avatar?: {
    src: string;
  };
}

interface TestimonialCardProps {
  item: TestimonialItem;
  position: "front" | "middle" | "back";
  handleShuffle: () => void;
  cardColor: string;
  borderColor: string;
  authorColor: string;
  textColor: string;
  isMobile: boolean;
}

function TestimonialCard({
  item,
  position,
  handleShuffle,
  cardColor,
  borderColor,
  authorColor,
  textColor,
  isMobile,
}: TestimonialCardProps) {
  const dragRef = useRef(0);
  const cardStyle = useMemo(
    () => ({
      position: "absolute" as const,
      left: 0,
      top: 0,
      display: "grid",
      placeContent: "center",
      gap: isMobile ? "1rem" : "1.5rem",
      borderRadius: "16px",
      border: `2px solid ${borderColor}`,
      backgroundColor: cardColor,
      padding: isMobile ? "16px" : "24px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      userSelect: "none" as const,
      cursor: "grab",
      width: isMobile ? "280px" : "350px",
      height: isMobile ? "380px" : "450px",
      maxWidth: "100%",
      maxHeight: "100%",
      zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
    }),
    [isMobile, borderColor, cardColor, position]
  );

  const avatarSrc = useMemo(() => {
    if (item.avatar?.src) {
      return item.avatar.src;
    }
    return `https://i.pravatar.cc/128?img=${item.id}`;
  }, [item.avatar?.src, item.id]);

  const animateProps = useMemo(
    () => ({
      rotate:
        position === "front"
          ? "-6deg"
          : position === "middle"
          ? "0deg"
          : "6deg",
      x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
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
        if (dragRef.current - info.point.x > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      whileTap={{ cursor: "grabbing" }}
    >
      <Image
        src={avatarSrc}
        alt={`Avatar of ${item.author}`}
        width={isMobile ? 96 : 128}
        height={isMobile ? 96 : 128}
        style={{
          margin: "0 auto",
          borderRadius: "9999px",
          borderWidth: "2px",
          borderColor: borderColor,
          backgroundColor: "rgb(226, 232, 240)",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          textAlign: "center",
          fontSize: isMobile ? "1rem" : "1.125rem",
          lineHeight: isMobile ? "1.5rem" : "1.75rem",
          fontStyle: "italic",
          color: textColor,
        }}
      >
        "{item.testimonial}"
      </span>
      <span
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          fontWeight: 500,
          color: authorColor,
        }}
      >
        {item.author}
      </span>
    </motion.div>
  );
}

interface DraggableTestimonialsProps {
  items: TestimonialItem[];
  cardColor?: string;
  borderColor?: string;
  authorColor?: string;
  textColor?: string;
  style?: React.CSSProperties;
}

export default function DraggableTestimonials(
  props: DraggableTestimonialsProps
) {
  const {
    items,
    cardColor = "rgba(30, 41, 59, 0.2)",
    borderColor = "rgb(156, 163, 175)",
    authorColor = "rgb(209, 213, 219)",
    textColor = "#FFFFFF",
    style,
  } = props;

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(items);
  const [isMobile, setIsMobile] = useState(false);

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
    setTestimonials(items);
  }, [items]);

  const handleShuffle = () => {
    const [first, ...rest] = testimonials;
    startTransition(() => {
      setTestimonials([...rest, first]);
    });
  };

  const visibleTestimonials = useMemo(
    () => testimonials.slice(0, 3).reverse(),
    [testimonials]
  );

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {visibleTestimonials.map((item, index) => {
        const position =
          index === 2 ? "front" : index === 1 ? "middle" : "back";
        return (
          <TestimonialCard
            key={item.id}
            item={item}
            position={position}
            handleShuffle={handleShuffle}
            cardColor={cardColor}
            borderColor={borderColor}
            authorColor={authorColor}
            textColor={textColor}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}
