"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThemeStudio } from "@/components/theme/theme-studio";

/**
 * Cursor-following 3D hero.
 *
 * The model drifts, tilts and rotates toward the pointer with frame-rate
 * independent damping. On touch devices the pointer is replaced by device
 * tilt where available and a gentle idle orbit otherwise.
 */

const MODEL_URL = process.env.NEXT_PUBLIC_HERO_MODEL_URL || "/models/hero.glb";

interface SceneColors {
  primary: string;
  accent: string;
  core: string;
}

interface PointerState {
  x: number;
  y: number;
}

/** Static fallback used when WebGL is unavailable. Never animated. */
function StaticEmblem({ colors }: { colors: SceneColors }) {
  return (
    <div className="flex h-full w-full items-center justify-center" role="img" aria-label="Decorative geometric emblem">
      <svg viewBox="0 0 200 200" className="h-[78%] w-[78%] max-h-72 max-w-72" aria-hidden>
        <defs>
          <linearGradient id="emblem-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
        </defs>
        <polygon
          points="100,18 168,58 168,138 100,178 32,138 32,58"
          fill="none"
          stroke="url(#emblem-stroke)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <polygon
          points="100,44 145,70 145,126 100,152 55,126 55,70"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1"
          opacity="0.55"
        />
        <circle cx="100" cy="98" r="18" fill={colors.primary} opacity="0.16" />
        <circle cx="100" cy="98" r="6" fill={colors.primary} />
      </svg>
    </div>
  );
}

/** Swaps to the fallback when the model file is missing or invalid. */
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[hero-3d] model unavailable — rendering procedural emblem instead.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Clones materials and tints them with the active palette. */
function useTintedMaterials(root: THREE.Object3D | null, tint: string) {
  useEffect(() => {
    if (!root) return;

    const target = new THREE.Color(tint);
    const created: THREE.Material[] = [];

    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const tintMaterial = (material: THREE.Material): THREE.Material => {
        const clone = material.clone();
        const standard = clone as THREE.MeshStandardMaterial & THREE.MeshPhysicalMaterial;

        if (standard.color) {
          const base = standard.color.clone();
          const hsl = { h: 0, s: 0, l: 0 };
          base.getHSL(hsl);
          // Neutral meshes adopt the palette; authored colours are blended in.
          if (hsl.s < 0.2) {
            standard.color.copy(target);
          } else {
            standard.color.copy(base).lerp(target, 0.35);
          }
        }

        if (standard.emissive) {
          standard.emissive.copy(target).multiplyScalar(0.18);
        }
        if (typeof standard.roughness === "number" && standard.roughness > 0.85) {
          standard.roughness = 0.55;
        }
        if (typeof standard.metalness === "number" && standard.metalness < 0.1) {
          standard.metalness = 0.35;
        }

        clone.needsUpdate = true;
        created.push(clone);
        return clone;
      };

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(tintMaterial)
        : tintMaterial(mesh.material);
    });

    return () => {
      for (const material of created) material.dispose();
    };
  }, [root, tint]);
}

/** Loads the glTF, centres it and normalises its size. */
function GltfEmblem({ url, tint }: { url: string; tint: string }) {
  const gltf = useGLTF(url) as unknown as { scene: THREE.Group };

  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.7 / largest;

    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return clone;
  }, [gltf]);

  useTintedMaterials(model, tint);

  return <primitive object={model} />;
}

/** Shipped fallback: a faceted emblem built from primitives. */
function ProceduralEmblem({ colors }: { colors: SceneColors }) {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshPhysicalMaterial
          color={colors.core}
          emissive={colors.primary}
          emissiveIntensity={0.35}
          roughness={0.22}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0.15}
          flatShading
        />
      </mesh>
      <mesh scale={1.28}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={colors.primary} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.72, 0.008, 12, 96]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 2.6]}>
        <torusGeometry args={[1.95, 0.006, 12, 96]} />
        <meshBasicMaterial color={colors.primary} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/** Damped rig that leans toward the pointer (or device tilt). */
function CursorRig({
  pointer,
  tilt,
  reducedMotion,
  children,
}: {
  pointer: React.RefObject<PointerState>;
  tilt: React.RefObject<PointerState>;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    if (reducedMotion) {
      node.rotation.x = THREE.MathUtils.damp(node.rotation.x, 0, 4, delta);
      node.rotation.y = THREE.MathUtils.damp(node.rotation.y, 0, 4, delta);
      node.position.y = THREE.MathUtils.damp(node.position.y, 0, 4, delta);
      return;
    }

    const p = pointer.current ?? { x: 0, y: 0 };
    const t = tilt.current ?? { x: 0, y: 0 };
    const clock = state.clock.elapsedTime;

    const targetY = p.x * 0.6 + t.x * 0.35 + Math.sin(clock * 0.25) * 0.08;
    const targetX = -p.y * 0.42 + t.y * 0.22;
    const targetLift = Math.sin(clock * 1.1) * 0.07;

    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetY, 5, delta);
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, targetX, 5, delta);
    node.rotation.z = THREE.MathUtils.damp(node.rotation.z, -p.x * 0.06, 4, delta);
    node.position.y = THREE.MathUtils.damp(node.position.y, targetLift, 3, delta);
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroCanvas() {
  const { theme } = useThemeStudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const tilt = useRef<PointerState>({ x: 0, y: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  const colors: SceneColors = useMemo(
    () => ({
      primary: theme.scene.primary,
      accent: theme.scene.accent,
      core: theme.scene.core,
    }),
    [theme]
  );

  // Respect the OS motion preference, live.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Pointer position, normalised to -1…1 around the viewport centre.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointer.current.y = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Touch devices: use device tilt when the browser exposes it without a prompt.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    const onOrient = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      tilt.current.x = Math.max(-1, Math.min(1, gamma / 45));
      tilt.current.y = Math.max(-1, Math.min(1, (beta - 45) / 45));
    };

    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, []);

  // Stop rendering entirely while off-screen or in a background tab.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.02 }
    );
    observer.observe(node);

    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full select-none">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<StaticEmblem colors={colors} />}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 8, 6]} intensity={2.1} color={colors.primary} />
        <directionalLight position={[-7, -4, -6]} intensity={1.1} color={colors.accent} />
        <pointLight position={[0, 0, 3]} intensity={1.4} color={colors.accent} />

        <CursorRig pointer={pointer} tilt={tilt} reducedMotion={reducedMotion}>
          <ModelBoundary fallback={<ProceduralEmblem colors={colors} />}>
            <Suspense fallback={<ProceduralEmblem colors={colors} />}>
              <GltfEmblem url={MODEL_URL} tint={colors.primary} />
            </Suspense>
          </ModelBoundary>
        </CursorRig>
      </Canvas>
    </div>
  );
}
