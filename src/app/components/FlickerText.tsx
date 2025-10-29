"use client";
import { useState, useEffect, useRef, useMemo, startTransition } from "react";
import { motion, useInView } from "framer-motion";

interface Font {
  fontSize?: string;
  variant?: string;
  letterSpacing?: string;
  lineHeight?: string;
}

interface FlickerTextProps {
  text?: string;
  textColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  font?: Font;
  animationSpeed?: number;
  animationPattern?: "sequential" | "random" | "sync";
  repeatBehavior?: "once" | "loop" | "trigger";
  animationStyle?: "neon" | "led" | "retro" | "electric";
  strokeWidth?: number;
  glowIntensity?: number;
  showBackground?: boolean;
  autoPlay?: boolean;
  style?: React.CSSProperties;
}

interface Character {
  char: string;
  index: number;
  id: string;
}

export default function FlickerText(props: FlickerTextProps) {
  const {
    text = "FLICKER TEXT",
    textColor = "#FFFFFF",
    glowColor = "#00FFFF",
    backgroundColor = "#000000",
    font,
    animationSpeed = 1,
    animationPattern = "sequential",
    repeatBehavior = "loop",
    animationStyle = "neon",
    strokeWidth = 2,
    glowIntensity = 10,
    showBackground = true,
    autoPlay = true,
  } = props;

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  // Split text into characters for individual animation
  const characters = useMemo<Character[]>(() => {
    return text.split("").map((char: string, index: number) => ({
      char: char === " " ? "\xa0" : char,
      index,
      id: `${char}-${index}`,
    }));
  }, [text]);

  // Animation timing calculations
  const baseDelay = 0.1 / animationSpeed;
  const flickerDuration = 0.3 / animationSpeed;
  const totalDuration = characters.length * baseDelay + flickerDuration;

  // Generate animation delays based on pattern
  const getAnimationDelay = (index: number): number => {
    switch (animationPattern) {
      case "sequential":
        return index * baseDelay;
      case "random":
        return Math.random() * (totalDuration * 0.7);
      case "sync":
        return 0;
      default:
        return index * baseDelay;
    }
  };

  // Style variations based on animation style
  const getStyleVariation = () => {
    switch (animationStyle) {
      case "neon":
        return {
          filter: `drop-shadow(0 0 ${glowIntensity}px ${glowColor})`,
          textShadow: `0 0 ${glowIntensity * 2}px ${glowColor}`,
        };
      case "led":
        return {
          filter: `drop-shadow(0 0 ${glowIntensity * 0.5}px ${glowColor})`,
          textShadow: `0 0 ${glowIntensity}px ${glowColor}`,
        };
      case "retro":
        return {
          filter: `drop-shadow(0 0 ${
            glowIntensity * 1.5
          }px ${glowColor}) contrast(1.2)`,
          textShadow: `0 0 ${glowIntensity * 3}px ${glowColor}`,
        };
      case "electric":
        return {
          filter: `drop-shadow(0 0 ${
            glowIntensity * 2
          }px ${glowColor}) brightness(1.1)`,
          textShadow: `0 0 ${glowIntensity * 4}px ${glowColor}`,
        };
      default:
        return {};
    }
  };

  const styleVariation = getStyleVariation();

  // Auto-play logic
  useEffect(() => {
    if (autoPlay && isInView) {
      startTransition(() => setIsPlaying(true));
    }
  }, [autoPlay, isInView]);

  // Character animation variants
  const characterVariants = {
    initial: {
      opacity: 1,
      color: textColor,
      WebkitTextStroke: `${strokeWidth}px transparent`,
      textShadow: "none",
      filter: "none",
    },
    flicker: (index: number) => ({
      opacity: [1, 0.3, 1, 0.1, 1, 0.7, 1],
      color: [textColor, "transparent", textColor, "transparent", textColor],
      WebkitTextStroke: [
        `${strokeWidth}px transparent`,
        `${strokeWidth}px ${textColor}`,
        `${strokeWidth}px transparent`,
        `${strokeWidth}px ${textColor}`,
        `${strokeWidth}px transparent`,
      ],
      transition: {
        duration: flickerDuration,
        delay: getAnimationDelay(index),
        ease: "easeInOut" as const,
        repeat: repeatBehavior === "loop" ? Infinity : 0,
        repeatDelay: repeatBehavior === "loop" ? totalDuration : 0,
      },
    }),
  };

  const isFixedWidth = props?.style && props.style.width === "100%";
  const isFixedHeight = props?.style && props.style.height === "100%";

  return (
    <div
      ref={containerRef}
      style={{
        ...props.style,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: showBackground ? backgroundColor : "transparent",
        overflow: "hidden",
        ...(isFixedWidth ? {} : { minWidth: "max-content" }),
        ...(isFixedHeight ? {} : { minHeight: "max-content" }),
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0",
          ...font,
          ...styleVariation,
        }}
      >
        {characters.map((character: Character, index: number) => (
          <motion.span
            key={`${character.id}-${animationKey}`}
            custom={index}
            variants={characterVariants}
            initial="initial"
            animate={isPlaying ? "flicker" : "initial"}
            style={{
              display: "inline-block",
              fontSize: "inherit",
              fontWeight: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit",
              letterSpacing: "inherit",
              whiteSpace: "pre",
            }}
          >
            {character.char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
