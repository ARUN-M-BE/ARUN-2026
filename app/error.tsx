"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootError] Caught unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">
            {error?.message && !error.message.includes("Minified React error")
              ? error.message
              : "A runtime error occurred in the application layer. Telemetry has logged the incident."}
          </p>
          {error?.digest && (
            <p className="text-[11px] font-mono text-zinc-500 bg-zinc-900/60 py-1 px-2 rounded inline-block mt-2">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-5"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Try again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-xs border-border hover:bg-accent"
            >
              <Home className="w-3.5 h-3.5 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

