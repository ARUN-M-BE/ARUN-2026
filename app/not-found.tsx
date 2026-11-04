import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Radio, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090e] text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-black font-bold mx-auto shadow-2xl shadow-cyan-500/30">
          <Radio className="w-8 h-8 text-black" />
        </div>

        <div className="space-y-2">
          <div className="text-6xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
            404
          </div>
          <h1 className="text-xl font-bold text-white">Coordinate Not Found in Universe</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The orbit or section you are seeking does not exist or has been shifted in spatial dimensions.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button className="h-10 px-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Core Orbit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
