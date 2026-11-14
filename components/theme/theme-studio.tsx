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
import { Check, Palette, Sparkles } from "lucide-react";
import {
  THEMES,
  THEME_COOKIE,
  normalizeThemeId,
  type PortfolioTheme,
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

interface ThemeStudioValue {
  themeId: ThemeId;
  theme: PortfolioTheme;
  setThemeId: (id: ThemeId) => void;
}

const ThemeStudioContext = createContext<ThemeStudioValue | null>(null);

/** Writes the theme tokens onto <html>. Runs client-side only. */
export function applyThemeToDocument(theme: PortfolioTheme, animate = true) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animate && !reduceMotion) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 460);
  }

  root.dataset.theme = theme.id;
  for (const [token, value] of Object.entries(theme.vars)) {
    root.style.setProperty(token, value);
  }

  document.cookie = `${THEME_COOKIE}=${theme.id}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeStudio({
  initialThemeId,
  children,
}: {
  initialThemeId: ThemeId;
  children: ReactNode;
}) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => normalizeThemeId(initialThemeId));
  const firstRun = useRef(true);

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(normalizeThemeId(id));
  }, []);

  const theme = useMemo(
    () => THEMES.find((item) => item.id === themeId) ?? THEMES[0],
    [themeId]
  );

  // Re-apply after hydration so tokens stay in sync with the SSR snapshot.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (document.documentElement.dataset.theme === theme.id) return;
    }
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo<ThemeStudioValue>(
    () => ({ themeId, theme, setThemeId }),
    [themeId, theme, setThemeId]
  );

  return <ThemeStudioContext.Provider value={value}>{children}</ThemeStudioContext.Provider>;
}

/** Safe accessor — components can render outside the provider (e.g. admin login). */
export function useThemeStudio(): ThemeStudioValue {
  const ctx = useContext(ThemeStudioContext);
  return (
    ctx ?? {
      themeId: THEMES[0].id,
      theme: THEMES[0],
      setThemeId: () => {},
    }
  );
}

/** Compact swatch rail used in dropdowns and tiles. */
export function ThemeSwatches({ theme, className }: { theme: PortfolioTheme; className?: string }) {
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

export function UniverseSwitcher({
  className,
  compact = false,
  label = "Universe",
}: {
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  const { themeId, theme, setThemeId } = useThemeStudio();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "icon" : "sm"}
          aria-label={`Switch visual universe. Active: ${theme.name}`}
          title={`Universe: ${theme.name}`}
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
            Dark-only visual systems. Your choice is remembered.
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((item) => {
          const active = item.id === themeId;
          return (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => setThemeId(item.id)}
              className="cursor-pointer items-start gap-2.5 px-2.5 py-2.5"
            >
              <ThemeSwatches theme={item} className="mt-0.5" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Selectable preview tiles — shared by the admin theme studio. */
export function UniverseTiles({
  value,
  onChange,
  className,
}: {
  value: ThemeId | string;
  onChange: (id: ThemeId) => void;
  className?: string;
}) {
  const active = normalizeThemeId(value);

  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-3", className)}>
      {THEMES.map((item) => {
        const selected = item.id === active;
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
            style={{ backgroundColor: item.vars["--background"] }}
          >
            {/* Miniature surface preview */}
            <div
              className="relative mb-3 h-20 w-full overflow-hidden rounded-xl border"
              style={{ borderColor: item.vars["--border"], backgroundColor: item.vars["--card"] }}
            >
              <div
                className="absolute -left-6 -top-8 size-24 rounded-full blur-2xl"
                style={{ backgroundColor: item.vars["--mesh-1"] }}
              />
              <div
                className="absolute inset-x-3 top-4 h-1.5 rounded-full"
                style={{ backgroundColor: item.vars["--primary"], opacity: 0.9 }}
              />
              <div
                className="absolute inset-x-3 top-8 h-1 w-2/3 rounded-full"
                style={{ backgroundColor: item.vars["--foreground"], opacity: 0.28 }}
              />
              <div
                className="absolute bottom-3 left-3 h-5 w-14 rounded-md"
                style={{ backgroundImage: item.vars["--gradient-brand"] }}
              />
              <div
                className="absolute bottom-3 right-3 h-5 w-8 rounded-md"
                style={{ backgroundColor: item.vars["--accent"], opacity: 0.7 }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span
                className="text-xs font-semibold"
                style={{ color: item.vars["--foreground"] }}
              >
                {item.name}
              </span>
              {selected && <Check className="size-3.5" style={{ color: item.vars["--primary"] }} />}
            </div>
            <span
              className="mt-0.5 block text-[10px] font-mono uppercase tracking-wider"
              style={{ color: item.vars["--muted-foreground"] }}
            >
              {item.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
