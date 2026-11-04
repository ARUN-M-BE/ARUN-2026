"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button className="relative w-12 h-12" title="Toggle theme">
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex"
      title="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </Button>
  );
}