"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalRootError] Uncaught root layout error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Application Error
            </h2>
            <p className="text-sm text-zinc-400">
              An unexpected system error occurred. Please refresh or try again.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono text-zinc-500 bg-zinc-900 py-1 px-2 rounded inline-block mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              onClick={() => reset()}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-5"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
