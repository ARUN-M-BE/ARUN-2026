import "./globals.css";
import { ThemeProvider } from "@/context/themeProvider";
import { LanguageProvider } from "@/context/languageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#04060b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Arun M | Senior Full-Stack Architect & 3D Creative Engineer",
    template: "%s | Arun M",
  },
  description: "Official architectural portfolio of Arun M. Featuring interactive 3D WebGL universes, distributed cloud platforms, sub-50ms latency microservices, and DPDP Act 2023 compliant engineering.",
  keywords: [
    "Arun M",
    "Full-Stack Architect",
    "Creative Engineer",
    "Next.js 16",
    "Three.js",
    "React Three Fiber",
    "TypeScript",
    "PostgreSQL",
    "Drizzle ORM",
    "Distributed Systems",
    "Cloud Architecture",
    "DPDP Act 2023",
  ],
  authors: [{ name: "Arun M", url: "https://arun-m.in" }],
  creator: "Arun M",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://arun-m.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Arun M | Senior Full-Stack Architect & 3D Creative Engineer",
    description: "Architecting resilient distributed cloud engines, type-safe architectures, and futuristic 3D web experiences.",
    siteName: "Arun M Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arun M - Senior Full-Stack Architect & 3D Creative Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arun M | Senior Full-Stack Architect & 3D Creative Engineer",
    description: "Architecting resilient distributed cloud engines, type-safe architectures, and futuristic 3D web experiences.",
    creator: "@arun_m",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://arun-m.in/#person",
      "name": "Arun M",
      "jobTitle": "Senior Full-Stack Architect & 3D Creative Engineer",
      "url": "https://arun-m.in",
      "email": "arun@arun-m.in",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bangalore",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://github.com/arun-m",
        "https://linkedin.com/in/arun-m"
      ],
      "knowsAbout": [
        "Full-Stack Architecture",
        "React 19",
        "Next.js 16",
        "Three.js",
        "React Three Fiber",
        "Distributed Systems",
        "PostgreSQL",
        "Drizzle ORM",
        "Docker & Kubernetes",
        "DPDP Act 2023 Compliance"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://arun-m.in/#website",
      "url": "https://arun-m.in",
      "name": "Arun M - 3D Architecture & Engineering Universe",
      "description": "Interactive 3D WebGL universe and full-stack portfolio of Arun M.",
      "publisher": { "@id": "https://arun-m.in/#person" }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased font-sans scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "if(typeof globalThis.__name==='undefined'){globalThis.__name=function(t,v){try{Object.defineProperty(t,'name',{value:v,configurable:true})}catch(e){}return t};}if(typeof window!=='undefined'&&typeof window.__name==='undefined'){window.__name=globalThis.__name;}(function(){if(typeof window==='undefined')return;function handleChunkErr(e){try{var t=e.target||e.srcElement;var isChunkErr=false;if(t&&(t.tagName==='SCRIPT'||t.tagName==='LINK')){var u=t.src||t.href||'';if(u.indexOf('/_next/static/chunks/')!==-1||u.indexOf('/_next/static/css/')!==-1){isChunkErr=true;}}var msg=(e.message||(e.reason&&(e.reason.message||String(e.reason)))||'');if(msg.indexOf('Loading chunk')!==-1||msg.indexOf('ChunkLoadError')!==-1||msg.indexOf('Failed to fetch dynamically imported module')!==-1||msg.indexOf('strict MIME checking is enabled')!==-1){isChunkErr=true;}if(isChunkErr){var k='__chunk_reload_lock';var last=parseInt(sessionStorage.getItem(k)||'0',10);var now=Date.now();if(now-last>10000){sessionStorage.setItem(k,String(now));window.location.reload();}}}catch(err){}}window.addEventListener('error',handleChunkErr,true);window.addEventListener('unhandledrejection',handleChunkErr);})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" closeButton />
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
