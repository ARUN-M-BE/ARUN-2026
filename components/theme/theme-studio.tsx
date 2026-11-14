"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, Moon, Palette, Sparkles, Sun } from "lucide-react";
import {
  THEMES,
  THEME_COOKIE,
  THEME_MODE_COOKIE,
  normalizeColorMode,
  normalizeThemeId,
  resolveTheme,
  type ColorMode,
  type PortfolioTheme,
  type ResolvedTheme,
  type ThemeId,
} from "@/config/themes";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/** Mirrors the cookie so a returning visitor is restored without a round-trip. */
const STORAGE_THEME = "pf.theme";
const STORAGE_MODE = "pf.mode";

interface ThemeStudioValue {
  themeId: ThemeId;
  mode: ColorMode;
  theme: ResolvedTheme;
  pickerEnabled: boolean;
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ColorMode) => void;
}

const ThemeStudioContext = createContext<ThemeStudioValue | null>(null);

/** Writes the resolved surface onto <html>. Client-side only. */
export function applyThemeToDocument(theme: ResolvedTheme, animate = true) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animate && !reduceMotion) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 460);
  }

  root.dataset.theme = theme.id;
  root.dataset.mode = theme.mode;
  root.classList.toggle("dark", theme.mode === "dark");
  root.classList.toggle("light", theme.mode === "light");

  for (const [token, value] of Object.entries(theme.vars)) {
    root.style.setProperty(token, value);
  }

  root.dataset.scenePrimary = theme.scene.primary;
  root.dataset.sceneAccent = theme.scene.accent;

  document.cookie = `${THEME_COOKIE}=${theme.id}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `${THEME_MODE_COOKIE}=${theme.mode}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeStudio({
  initialThemeId,
  initialMode = "dark",
  pickerEnabled = true,
  children,
}: {
  initialThemeId: ThemeId;
  initialMode?: ColorMode;
  pickerEnabled?: boolean;
  children: ReactNode;
}) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => normalizeThemeId(initialThemeId));
  const [mode, setModeState] = useState<ColorMode>(() => normalizeColorMode(initialMode));
  const firstRun = useRef(true);

  const theme = useMemo(() => resolveTheme(themeId, mode), [themeId, mode]);

  const setThemeId = useCallback((id: ThemeId) => {
    const next = normalizeThemeId(id);
    setThemeIdState(next);
    try {
      window.localStorage.setItem(STORAGE_THEME, next);
    } catch {
      // Private mode / storage disabled — the cookie still carries the choice.
    }
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    const value = normalizeColorMode(next);
    setModeState(value);
    try {
      window.localStorage.setItem(STORAGE_MODE, value);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  // Restore a previously chosen palette once mounted (no hydration mismatch).
  useEffect(() => {
    if (!pickerEnabled) return;
    let storedTheme: string | null = null;
    let storedMode: string | null = null;
    try {
      storedTheme = window.localStorage.getItem(STORAGE_THEME);
      storedMode = window.localStorage.getItem(STORAGE_MODE);
    } catch {
      return;
    }
    if (!storedTheme && !storedMode) return;

    // Deferred one frame: restoring is a post-hydration correction, not a
    // synchronous cascade inside the effect body.
    const frame = window.requestAnimationFrame(() => {
      if (storedTheme) setThemeIdState(normalizeThemeId(storedTheme));
      if (storedMode) setModeState(normalizeColorMode(storedMode));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pickerEnabled]);

  // Keep the document in sync with the SSR snapshot and every change after it.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      const root = document.documentElement;
      if (root.dataset.theme === theme.id && root.dataset.mode === theme.mode) return;
    }
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo<ThemeStudioValue>(
    () => ({ themeId, mode, theme, pickerEnabled, setThemeId, setMode }),
    [themeId, mode, theme, pickerEnabled, setThemeId, setMode]
  );

  return <ThemeStudioContext.Provider value={value}>{children}</ThemeStudioContext.Provider>;
}

/** Safe accessor — components can render outside the provider (e.g. admin login). */
export function useThemeStudio(): ThemeStudioValue {
  const ctx = useContext(ThemeStudioContext);
  return (
    ctx ?? {
      themeId: THEMES[0].id,
      mode: "dark",
      theme: resolveTheme(THEMES[0].id, "dark"),
      pickerEnabled: true,
      setThemeId: () => {},
      setMode: () => {},
    }
  );
}

/** Compact swatch rail used in dropdowns and tiles. */
export function ThemeSwatches({
  theme,
  className,
}: {
  theme: Pick<PortfolioTheme, "swatches">;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1", className)} aria-hidden>
      {theme.swatches.map((color) => (
        <span
          key={color}
          className="size-2.5 rounded-full ring-1 ring-inset ring-white/15"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export function ModeToggle({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "icon";
}) {
  const { mode, setMode } = useThemeStudio();
  const next: ColorMode = mode === "dark" ? "light" : "dark";

  return (
    <Button
      variant="outline"
      size={size === "icon" ? "icon" : "sm"}
      onClick={() => setMode(next)}
      aria-label={`Switch to ${next} mode`}
      title={`${mode === "dark" ? "Dark" : "Light"} mode — switch to ${next}`}
      className={cn(
        "rounded-xl border-border bg-card/60 shadow-xs hover:border-primary/40 hover:bg-primary/5",
        size === "icon" ? "size-9 sm:size-10" : "h-9 sm:h-10 gap-2 px-3 text-xs",
        className
      )}
    >
      {mode === "dark" ? (
        <Moon className="size-4 text-primary" />
      ) : (
        <Sun className="size-4 text-primary" />
      )}
      {size !== "icon" && <span className="font-medium">{mode === "dark" ? "Dark" : "Light"}</span>}
    </Button>
  );
}

export function UniverseSwitcher({
  className,
  compact = false,
  label = "Palette",
}: {
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  const { themeId, theme, setThemeId, mode, setMode, pickerEnabled } = useThemeStudio();

  if (!pickerEnabled) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "icon" : "sm"}
          aria-label={`Switch palette. Active: ${theme.name}, ${mode} mode`}
          title={`Palette: ${theme.name} (${mode})`}
          className={cn(
            "rounded-xl border-border bg-card/60 shadow-xs hover:border-primary/40 hover:bg-primary/5",
            compact ? "size-9 sm:size-10" : "h-9 sm:h-10 gap-2 px-3 text-xs",
            className
          )}
        >
          <Palette className="size-4 text-primary" />
          {!compact && (
            <span className="hidden md:inline font-medium text-foreground">{theme.name}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Sparkles className="size-3.5 text-accent" />
            {label}
          </span>
          <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
            Nine palettes, light and dark. Your choice is remembered.
          </span>
        </DropdownMenuLabel>
        <div className="mb-1 grid grid-cols-2 gap-1.5 px-1">
          {(["dark", "light"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium capitalize transition-colors",
                mode === option
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {option === "dark" ? <Moon className="size-3" /> : <Sun className="size-3" />}
              {option}
            </button>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto">
          {THEMES.map((item) => {
            const active = item.id === themeId;
            const surface = mode === "light" ? item.light : item.dark;
            return (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => setThemeId(item.id)}
                className="cursor-pointer items-start gap-2.5 px-2.5 py-2.5"
              >
                <ThemeSwatches theme={surface} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-foreground">{item.name}</span>
                    {active && <Check className="size-3.5 shrink-0 text-primary" />}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {item.tagline}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Selectable preview tiles — shared by the admin appearance screen. */
export function UniverseTiles({
  value,
  onChange,
  mode = "dark",
  className,
}: {
  value: ThemeId | string;
  onChange: (id: ThemeId) => void;
  mode?: ColorMode;
  className?: string;
}) {
  const active = normalizeThemeId(value);

  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {THEMES.map((item) => {
        const selected = item.id === active;
        const surface = mode === "light" ? item.light : item.dark;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={selected}
            className={cn(
              "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all",
              selected
                ? "border-primary/60 shadow-[0_0_0_1px_var(--primary)]"
                : "border-border hover:border-primary/35"
            )}
            style={{ backgroundColor: surface.vars["--background"] }}
          >
            {/* Miniature surface preview */}
            <div
              className="relative mb-3 h-20 w-full overflow-hidden rounded-xl border"
              style={{
                borderColor: surface.vars["--border"],
                backgroundColor: surface.vars["--card"],
              }}
            >
              <div
                className="absolute -left-6 -top-8 size-24 rounded-full blur-2xl"
                style={{ backgroundColor: surface.vars["--mesh-1"] }}
              />
              <div
                className="absolute inset-x-3 top-4 h-1.5 rounded-full"
                style={{ backgroundColor: surface.vars["--primary"], opacity: 0.9 }}
              />
              <div
                className="absolute inset-x-3 top-8 h-1 w-2/3 rounded-full"
                style={{ backgroundColor: surface.vars["--foreground"], opacity: 0.28 }}
              />
              <div
                className="absolute bottom-3 left-3 h-5 w-14 rounded-md"
                style={{ backgroundImage: surface.vars["--gradient-brand"] }}
              />
              <div
                className="absolute bottom-3 right-3 h-5 w-8 rounded-md"
                style={{ backgroundColor: surface.vars["--accent"], opacity: 0.7 }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold" style={{ color: surface.vars["--foreground"] }}>
                {item.name}
              </span>
              {selected && (
                <Check className="size-3.5" style={{ color: surface.vars["--primary"] }} />
              )}
            </div>
            <span
              className="mt-0.5 block text-[10px] font-mono uppercase tracking-wider"
              style={{ color: surface.vars["--muted-foreground"] }}
            >
              {item.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
