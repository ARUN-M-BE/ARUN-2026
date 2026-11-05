"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError] Uncaught admin route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card/80 backdrop-blur-xl border border-destructive/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Admin Workspace Render Error
          </h2>
          <p className="text-sm text-muted-foreground">
            {error?.message && !error.message.includes("Minified React error")
              ? error.message
              : "A server component render failed. If your session expired, please log in again."}
          </p>
          {error?.digest && (
            <p className="text-[11px] font-mono text-zinc-500 bg-zinc-900/60 py-1 px-2 rounded inline-block mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-5"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Retry
          </Button>
          <Link href="/admin">
            <Button
              variant="outline"
              className="text-xs border-border hover:bg-accent"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button
              variant="secondary"
              className="text-xs"
            >
              <LogIn className="w-3.5 h-3.5 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

