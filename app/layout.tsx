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
