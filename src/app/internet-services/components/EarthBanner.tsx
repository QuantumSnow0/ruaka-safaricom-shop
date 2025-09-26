"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Sphere,
  Line,
  Points,
  PointMaterial,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// Data packet component
function DataPacket({
  start,
  end,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      const pingTime = 4; // Time for one complete ping
      const cycle = (time % pingTime) / pingTime;

      setProgress(cycle);

      // Interpolate position
      const x = start[0] + (end[0] - start[0]) * cycle;
      const y =
        start[1] +
        (end[1] - start[1]) * cycle +
        Math.sin(cycle * Math.PI) * 0.5;
      const z = start[2] + (end[2] - start[2]) * cycle;

      meshRef.current.position.set(x, y, z);

      // Scale and opacity based on progress
      const scale = Math.sin(cycle * Math.PI) * 0.8 + 0.3;
      const opacity = Math.sin(cycle * Math.PI) * 0.9 + 0.3;

      meshRef.current.scale.setScalar(scale * 1.2);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.025, 12, 12]} />
      <meshBasicMaterial color="#00ff88" transparent />
    </mesh>
  );
}

// Network node component
function NetworkNode({
  position,
  delay = 0,
}: {
  position: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && ringRef.current && outerRingRef.current) {
      const time = state.clock.getElapsedTime() + delay;

      // Pulsing effect
      const scale = Math.sin(time * 2.5) * 0.3 + 1;
      const opacity = Math.sin(time * 2.5) * 0.4 + 0.8;

      meshRef.current.scale.setScalar(scale);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;

      // Ring animation
      ringRef.current.rotation.z = time * 3;
      ringRef.current.scale.setScalar(scale * 1.8);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.6;

      // Outer ring animation
      outerRingRef.current.rotation.z = -time * 1.5;
      outerRingRef.current.scale.setScalar(scale * 2.5);
      (outerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#00ff88" transparent />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.06, 0.008, 8, 16]} />
        <meshBasicMaterial color="#00ff88" transparent />
      </mesh>
      <mesh ref={outerRingRef}>
        <torusGeometry args={[0.08, 0.005, 8, 16]} />
        <meshBasicMaterial color="#00ff88" transparent />
      </mesh>
    </group>
  );
}

// Rotating Earth component with day/night cycle
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const nightLightsRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.2;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = time * 0.25;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.1;
    }
    if (nightLightsRef.current) {
      nightLightsRef.current.rotation.y = time * 0.2;
    }

    // Animate sun position for day/night cycle
    if (sunRef.current) {
      const sunAngle = time * 0.05; // Slow day/night cycle
      const sunX = Math.cos(sunAngle) * 10;
      const sunY = Math.sin(sunAngle) * 3;
      const sunZ = Math.sin(sunAngle) * 10;

      sunRef.current.position.set(sunX, sunY, sunZ);
      sunRef.current.target.position.set(0, 0, 0);
    }
  });

  // Load real NASA Earth textures with fallback
  const earthMaterials = useMemo(() => {
    // Create a more detailed fallback material
    const fallbackMaterial = new THREE.MeshPhongMaterial({
      color: "#4a90e2",
      shininess: 100,
      specular: "#ffffff",
    });

    // Try to load textures, with fallback if they fail
    let dayTexture, nightTexture, cloudTexture;
    
    try {
      dayTexture = new THREE.TextureLoader().load(
        "/textures/earth-day.jpg",
        (texture) => {
          console.log("Day texture loaded successfully");
        },
        undefined, // onProgress
        (error) => {
          console.warn("Failed to load day texture:", error);
        }
      );
      
      nightTexture = new THREE.TextureLoader().load(
        "/textures/earth-night.jpg",
        (texture) => {
          console.log("Night texture loaded successfully");
        },
        undefined,
        (error) => {
          console.warn("Failed to load night texture:", error);
        }
      );
      
      cloudTexture = new THREE.TextureLoader().load(
        "/textures/earth-clouds.jpg",
        (texture) => {
          console.log("Cloud texture loaded successfully");
        },
        undefined,
        (error) => {
          console.warn("Failed to load cloud texture:", error);
        }
      );

      // Configure texture properties
      if (dayTexture) {
        dayTexture.wrapS = dayTexture.wrapT = THREE.RepeatWrapping;
        dayTexture.flipY = false;
      }
      
      if (nightTexture) {
        nightTexture.wrapS = nightTexture.wrapT = THREE.RepeatWrapping;
        nightTexture.flipY = false;
      }
      
      if (cloudTexture) {
        cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
        cloudTexture.flipY = false;
      }
    } catch (error) {
      console.warn("Error loading textures:", error);
    }

    return {
      day: dayTexture ? new THREE.MeshPhongMaterial({
        map: dayTexture,
        shininess: 100,
        specular: "#ffffff",
      }) : fallbackMaterial,
      
      night: nightTexture ? new THREE.MeshBasicMaterial({
        map: nightTexture,
        transparent: true,
        opacity: 0.9,
      }) : new THREE.MeshBasicMaterial({
        color: "#000011",
        transparent: true,
        opacity: 0.8,
      }),
      
      clouds: cloudTexture ? new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.7,
      }) : new THREE.MeshPhongMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, []);

  // Network node positions (major cities) - properly positioned on sphere
  const networkNodes = useMemo(
    () => [
      [0.8, 0.2, 0.6], // London
      [-0.6, 0.3, 0.7], // New York
      [0.9, -0.1, 0.4], // Tokyo
      [-0.7, 0.1, 0.7], // Los Angeles
      [0.2, 0.6, 0.8], // Moscow
      [-0.3, -0.7, 0.6], // São Paulo
      [0.7, -0.6, -0.3], // Sydney
      [0.1, -0.2, -0.9], // Cape Town
      [0.8, 0.1, -0.5], // Mumbai
      [-0.8, 0.2, 0.6], // Chicago
    ],
    []
  );

  // Generate data packet routes
  const dataRoutes = useMemo(() => {
    const routes = [];
    for (let i = 0; i < 15; i++) {
      const start =
        networkNodes[Math.floor(Math.random() * networkNodes.length)];
      const end = networkNodes[Math.floor(Math.random() * networkNodes.length)];
      if (start !== end) {
        routes.push({ start, end, delay: Math.random() * 5 });
      }
    }
    return routes;
  }, [networkNodes]);

  return (
    <group>
      {/* Earth - Day side */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 32]} />
        <primitive object={earthMaterials.day} />
      </mesh>

      {/* Earth - Night side with city lights */}
      <mesh ref={nightLightsRef}>
        <sphereGeometry args={[1.001, 64, 32]} />
        <primitive object={earthMaterials.night} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.005, 32, 16]} />
        <primitive object={earthMaterials.clouds} />
      </mesh>

      {/* Debug: Simple colored sphere to ensure Earth is visible */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.99, 32, 16]} />
        <meshBasicMaterial color="#4a90e2" transparent opacity={0.3} />
      </mesh>

      {/* Atmosphere with day/night variation */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.02, 32, 16]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Network nodes */}
      {networkNodes.map((position, index) => (
        <NetworkNode
          key={index}
          position={position as [number, number, number]}
          delay={index * 0.3}
        />
      ))}

      {/* Data packets */}
      {dataRoutes.map((route, index) => (
        <DataPacket
          key={index}
          start={route.start as [number, number, number]}
          end={route.end as [number, number, number]}
          delay={route.delay}
        />
      ))}

      {/* Ambient light - varies with day/night */}
      <ambientLight intensity={0.2} />

      {/* Sun - animated for day/night cycle */}
      <directionalLight
        ref={sunRef}
        position={[10, 0, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffeb3b"
      />

      {/* Moon light for night side */}
      <directionalLight
        position={[-5, 2, -5]}
        intensity={0.1}
        color="#e3f2fd"
      />

      {/* Point lights for network glow effects */}
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#00ff88" />
      <pointLight position={[-2, -2, 2]} intensity={0.2} color="#0088ff" />

      {/* City lights glow */}
      <pointLight position={[0, 0, 0]} intensity={0.1} color="#ffff88" />
    </group>
  );
}

// Camera controller for smooth movement with day/night viewing
function CameraController() {
  const cameraRef = useRef<THREE.Camera>(null);

  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.getElapsedTime();
      const radius = 3.8;

      // Slower orbit to appreciate day/night cycle
      const orbitSpeed = 0.03;
      const x = Math.cos(time * orbitSpeed) * radius;
      const z = Math.sin(time * orbitSpeed) * radius;
      const y = Math.sin(time * 0.02) * 0.8; // Gentle vertical movement

      cameraRef.current.position.set(x, y, z);
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Main Earth Banner Component
export default function EarthBanner() {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <CameraController />
        <Earth />
      </Canvas>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl">
            Internet Services
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-200">
              Fast, Reliable, Secure
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Experience blazing-fast internet with our 5G and secure fiber
            packages. Choose the perfect plan for your home or business needs.
          </p>
        </div>
      </div>

      {/* Enhanced background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Floating network icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`icon-${i}`}
            className="absolute text-blue-300/30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
