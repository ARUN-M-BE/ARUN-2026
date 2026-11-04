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
      {/* Outer Cyan Gyroscope Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.5, 0.02, 16, 120]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Secondary Violet Orbital Ring */}
      <mesh ref={secondaryRingRef}>
        <torusGeometry args={[2.8, 0.015, 16, 120]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Orbiting Tech Satellites */}
      <group ref={satelliteGroupRef}>
        <mesh position={[2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[-2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color="#8b5cf6" />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
        {/* Core Glowing Metallic Sculpture */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.35, 1]} />
          <MeshDistortMaterial
            color="#080a18"
            emissive="#06b6d4"
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
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.6} />
        </mesh>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.45} />
        </mesh>
      </Float>
    </group>
  );
}

// ─── Dual Cosmic Particles Field ───────────────────────────
function CosmicParticles({ count = 220 }: { count?: number }) {
  const [cyanPoints, violetPoints] = useMemo(() => {
    const cCoords = new Float32Array((count / 2) * 3);
    const vCoords = new Float32Array((count / 2) * 3);
    for (let i = 0; i < count / 2; i++) {
      cCoords[i * 3] = (Math.random() - 0.5) * 18;
      cCoords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      cCoords[i * 3 + 2] = (Math.random() - 0.5) * 18;

      vCoords[i * 3] = (Math.random() - 0.5) * 18;
      vCoords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      vCoords[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return [cCoords, vCoords];
  }, [count]);

  const cyanRef = useRef<THREE.Points>(null!);
  const violetRef = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    if (cyanRef.current) {
      cyanRef.current.rotation.y += delta * 0.025;
      cyanRef.current.rotation.x -= delta * 0.01;
    }
    if (violetRef.current) {
      violetRef.current.rotation.y += delta * 0.02;
      violetRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <>
      <points ref={cyanRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cyanPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.038} color="#06b6d4" transparent opacity={0.65} sizeAttenuation />
      </points>

      <points ref={violetRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[violetPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#8b5cf6" transparent opacity={0.55} sizeAttenuation />
      </points>
    </>
  );
}

// ─── Fallback Sculpture ───────────────────────────────────
function FallbackSculpture() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-transparent blur-2xl animate-pulse" />
      <div className="absolute w-52 h-52 rounded-2xl border-2 border-cyan-400/40 bg-card/40 backdrop-blur-xl rotate-12 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
        <div className="w-36 h-36 rounded-xl border border-violet-400/50 -rotate-6 flex items-center justify-center bg-cyan-950/30">
          <div className="w-20 h-20 rounded-lg bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-xs">
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

    window.addEventListener("mousemove", handleMouseMove);
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
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#06b6d4" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#8b5cf6" />
        <pointLight position={[0, 0, 2.5]} intensity={2.2} color="#06b6d4" />
        <pointLight position={[0, -2, -1]} intensity={1.0} color="#f59e0b" />

        <InteractiveSculpture mouse={mouse} isPulsing={isPulsing} onClick={handleClick} />
        <CosmicParticles count={200} />
      </Canvas>
    </div>
  );
}
