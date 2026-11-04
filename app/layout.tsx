import "./globals.css";
import { ThemeProvider } from "@/context/themeProvider";
import { LanguageProvider } from "@/context/languageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Developer Portfolio | Immersive 3D Universe",
    template: "%s | Developer Portfolio",
  },
  description: "Senior Full-Stack Architect & Creative Technologist portfolio featuring interactive 3D universe, project case studies, and modern engineering crafts.",
  keywords: ["Full-Stack Developer", "Next.js", "Three.js", "TypeScript", "React Three Fiber", "Software Architect", "Web3", "Creative Developer"],
  authors: [{ name: "Developer Portfolio" }],
  creator: "Developer Portfolio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Developer Portfolio | Immersive 3D Universe",
    description: "Senior Full-Stack Architect & Creative Technologist portfolio.",
    siteName: "Developer Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio | Immersive 3D Universe",
    description: "Senior Full-Stack Architect & Creative Technologist portfolio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased font-sans">
      <head />
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
