"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Identity Sculpture Core ────────────────────────────
function InteractiveSculpture({
  mouse,
  isPulsing,
  onClick,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isPulsing: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const secondaryRingRef = useRef<THREE.Mesh>(null!);
  const satelliteGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const pulseFactor = isPulsing ? 1.4 : 1.0;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25 * pulseFactor;
      meshRef.current.rotation.y += delta * 0.35 * pulseFactor;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * 0.7, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current.y * 0.7, 0.05);
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.15;
      wireframeRef.current.rotation.y -= delta * 0.2;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.z += delta * 0.5;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.12;
      outerRingRef.current.rotation.x += delta * 0.06;
    }
    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.y += delta * 0.18;
      secondaryRingRef.current.rotation.x -= delta * 0.1;
    }
    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group onClick={onClick}>
      {/* Outer Sky Gyroscope Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.5, 0.02, 16, 120]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Secondary Indigo Orbital Ring */}
      <mesh ref={secondaryRingRef}>
        <torusGeometry args={[2.8, 0.015, 16, 120]} />
        <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Orbiting Tech Satellites */}
      <group ref={satelliteGroupRef}>
        <mesh position={[2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color="#818cf8" />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
        {/* Core Glowing Metallic Sculpture */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.35, 1]} />
          <MeshDistortMaterial
            color="#0c101c"
            emissive="#38bdf8"
            emissiveIntensity={isPulsing ? 1.2 : 0.4}
            roughness={0.08}
            metalness={0.92}
            distort={0.28}
            speed={2.2}
          />
        </mesh>

        {/* Inner Pulsing Crystal */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.6} />
        </mesh>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.45} />
        </mesh>
      </Float>
    </group>
  );
}

// ─── Dual Cosmic Particles Field ───────────────────────────
function CosmicParticles({ count = 200 }: { count?: number }) {
  const [skyPoints, indigoPoints] = useMemo(() => {
    const sCoords = new Float32Array((count / 2) * 3);
    const iCoords = new Float32Array((count / 2) * 3);
    for (let i = 0; i < count / 2; i++) {
      sCoords[i * 3] = (Math.random() - 0.5) * 18;
      sCoords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      sCoords[i * 3 + 2] = (Math.random() - 0.5) * 18;

      iCoords[i * 3] = (Math.random() - 0.5) * 18;
      iCoords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      iCoords[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return [sCoords, iCoords];
  }, [count]);

  const skyRef = useRef<THREE.Points>(null!);
  const indigoRef = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.025;
      skyRef.current.rotation.x -= delta * 0.01;
    }
    if (indigoRef.current) {
      indigoRef.current.rotation.y += delta * 0.02;
      indigoRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <>
      <points ref={skyRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[skyPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.038} color="#38bdf8" transparent opacity={0.65} sizeAttenuation />
      </points>

      <points ref={indigoRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[indigoPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#818cf8" transparent opacity={0.55} sizeAttenuation />
      </points>
    </>
  );
}

// ─── Fallback Sculpture ───────────────────────────────────
function FallbackSculpture() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-sky-500/15 via-indigo-500/15 to-transparent blur-2xl animate-pulse" />
      <div className="absolute w-48 h-48 rounded-2xl border border-sky-400/30 bg-card/60 backdrop-blur-xl rotate-12 flex items-center justify-center shadow-xl">
        <div className="w-32 h-32 rounded-xl border border-indigo-400/40 -rotate-6 flex items-center justify-center bg-sky-950/20">
          <div className="w-18 h-18 rounded-lg bg-sky-400/20 border border-sky-400 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
            3D ENGINE
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Hero Canvas Component ───────────────────────────
export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
  };

  if (!mounted || prefersReducedMotion) {
    return <FallbackSculpture />;
  }

  return (
    <div className="w-full h-full relative cursor-pointer select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#38bdf8" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#818cf8" />
        <pointLight position={[0, 0, 2.5]} intensity={2.2} color="#38bdf8" />
        <pointLight position={[0, -2, -1]} intensity={1.0} color="#6366f1" />

        <InteractiveSculpture mouse={mouse} isPulsing={isPulsing} onClick={handleClick} />
        <CosmicParticles count={180} />
      </Canvas>
    </div>
  );
}
