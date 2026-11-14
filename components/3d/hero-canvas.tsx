"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useThemeStudio } from "@/components/theme/theme-studio";

interface SceneColors {
  primary: string;
  accent: string;
  core: string;
}

// ─── 3D Identity Sculpture Core ────────────────────────────
function InteractiveSculpture({
  colors,
  isPulsing,
  reducedMotion,
  onClick,
}: {
  colors: SceneColors;
  isPulsing: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const secondaryRingRef = useRef<THREE.Mesh>(null!);
  const satelliteGroupRef = useRef<THREE.Group>(null!);
  const floatGroupRef = useRef<THREE.Group>(null!);
  const sceneGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const pulseFactor = isPulsing ? 1.4 : 1.0;
    const motion = reducedMotion ? 0 : 1;

    // Scroll-based depth: the sculpture drifts and tilts as the page moves.
    if (sceneGroupRef.current) {
      const progress =
        typeof window !== "undefined"
          ? Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6)
          : 0;
      sceneGroupRef.current.position.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.position.y,
        -progress * 0.65,
        0.06
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        progress * 0.22,
        0.06
      );
    }

    if (floatGroupRef.current) {
      floatGroupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.8) * 0.12 * motion;
      floatGroupRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 0.9) * 0.05 * motion;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25 * pulseFactor * motion;
      meshRef.current.rotation.y += delta * 0.35 * pulseFactor * motion;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.15 * motion;
      wireframeRef.current.rotation.y -= delta * 0.2 * motion;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.z += delta * 0.5 * motion;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.12 * motion;
      outerRingRef.current.rotation.x += delta * 0.06 * motion;
    }
    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.y += delta * 0.18 * motion;
      secondaryRingRef.current.rotation.x -= delta * 0.1 * motion;
    }
    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.rotation.y += delta * 0.4 * motion;
    }
  });

  return (
    <group ref={sceneGroupRef} onClick={onClick}>
      {/* Outer gyroscope ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.5, 0.02, 16, 96]} />
        <meshBasicMaterial color={colors.primary} wireframe transparent opacity={0.35} />
      </mesh>

      {/* Secondary orbital ring */}
      <mesh ref={secondaryRingRef}>
        <torusGeometry args={[2.8, 0.015, 16, 96]} />
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.3} />
      </mesh>

      {/* Orbiting tech satellites */}
      <group ref={satelliteGroupRef}>
        <mesh position={[2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color={colors.primary} />
        </mesh>
        <mesh position={[-2.6, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial color={colors.accent} />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color={colors.primary} />
        </mesh>
      </group>

      <group ref={floatGroupRef}>
        {/* Core metallic sculpture */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshPhysicalMaterial
            color={colors.core}
            emissive={colors.primary}
            emissiveIntensity={isPulsing ? 1.4 : 0.45}
            roughness={0.12}
            metalness={0.92}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Inner crystal */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.6} />
        </mesh>

        {/* Outer wireframe cage */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial color={colors.primary} wireframe transparent opacity={0.45} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Dual cosmic particle field ────────────────────────────
function CosmicParticles({ count = 120, colors }: { count?: number; colors: SceneColors }) {
  const [skyPoints, iCoords] = useMemo(() => {
    const half = Math.max(Math.floor(count / 2), 10);
    const sCoords = new Float32Array(half * 3);
    const iCoords = new Float32Array(half * 3);
    for (let i = 0; i < half; i++) {
      // Deterministic spread — no impure random during render.
      const angle = (i / half) * Math.PI * 2;
      const radius = 2.5 + (i % 5) * 1.2;
      sCoords[i * 3] = Math.cos(angle) * radius;
      sCoords[i * 3 + 1] = Math.sin(angle * 2) * 3.5;
      sCoords[i * 3 + 2] = Math.sin(angle) * radius;

      iCoords[i * 3] = Math.sin(angle) * (radius + 0.5);
      iCoords[i * 3 + 1] = Math.cos(angle * 1.5) * 3.2;
      iCoords[i * 3 + 2] = Math.cos(angle) * (radius + 0.5);
    }
    return [sCoords, iCoords];
  }, [count]);

  const skyRef = useRef<THREE.Points>(null!);
  const accentRef = useRef<THREE.Points>(null!);

  useFrame((_state, delta) => {
    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.025;
      skyRef.current.rotation.x -= delta * 0.01;
    }
    if (accentRef.current) {
      accentRef.current.rotation.y += delta * 0.02;
      accentRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <>
      <points ref={skyRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[skyPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.038} color={colors.primary} transparent opacity={0.65} sizeAttenuation />
      </points>

      <points ref={accentRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[iCoords, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color={colors.accent} transparent opacity={0.55} sizeAttenuation />
      </points>
    </>
  );
}

// ─── Main Hero Canvas ─────────────────────────────────────
export default function HeroCanvas() {
  const { theme } = useThemeStudio();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  const colors: SceneColors = useMemo(
    () => ({
      primary: theme.scene.primary,
      accent: theme.scene.accent,
      core: theme.scene.core,
    }),
    [theme]
  );

  const handleClick = () => {
    setIsPulsing(true);
    window.setTimeout(() => setIsPulsing(false), 600);
  };

  return (
    <div className="h-full w-full relative select-none [touch-action:pan-y]">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.6]}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              WebGL unavailable — explore the written case studies instead.
            </p>
          </div>
        }
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color={colors.primary} />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color={colors.accent} />
        <pointLight position={[0, 0, 2.5]} intensity={2.2} color={colors.primary} />
        <pointLight position={[0, -2, -1]} intensity={1.0} color={colors.accent} />

        <InteractiveSculpture
          colors={colors}
          isPulsing={isPulsing}
          reducedMotion={reducedMotion}
          onClick={handleClick}
        />
        <CosmicParticles count={120} colors={colors} />

        {/* 360° drag orbit — visitors can rotate the entire environment */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.85}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.45}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.78}
        />
      </Canvas>
    </div>
  );
}
