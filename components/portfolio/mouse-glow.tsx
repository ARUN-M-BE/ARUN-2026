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
    setMounted(true);
    // Check if the device has a mouse pointer (not touch-only)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsPointerDevice(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
        className="h-[480px] w-[480px] rounded-full bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl"
      />
    </div>
  );
}

