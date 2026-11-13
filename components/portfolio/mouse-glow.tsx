"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseGlow() {
  const [mounted, setMounted] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 25 });

  useEffect(() => {
    // Check if the device has a mouse pointer (not touch-only)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
      if (hasPointer) {
        setIsPointerDevice(true);
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted || !isPointerDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden transition-opacity duration-500">
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="h-[480px] w-[480px] rounded-full bg-gradient-to-r from-sky-500/8 via-indigo-500/8 to-transparent blur-3xl pointer-events-none"
      />
    </div>
  );
}

