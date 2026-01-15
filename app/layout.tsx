import type { Metadata } from "next";
import localFont from "next/font/local";
import { Sora, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const ariom = localFont({
  src: "../public/logo-font/Ariom Bold.ttf",
  variable: "--font-ariom",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLM-Image | AI-Powered Image Generation Studio by BetterGLM",
  description: "Create stunning AI-generated images with GLM-Image. Featuring intelligent prompt optimization, multiple aspect ratios, and a beautiful discovery feed. Powered by BetterGLM technology.",
  icons: {
    icon: "/favico.ico",
  },
  openGraph: {
    title: "GLM-Image | AI-Powered Image Generation Studio",
    description: "Create stunning AI-generated images with intelligent prompt optimization. Transform your ideas into beautiful visuals instantly.",
    type: "website",
    siteName: "GLM-Image",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLM-Image | AI-Powered Image Generation Studio",
    description: "Create stunning AI-generated images with intelligent prompt optimization. Transform your ideas into beautiful visuals instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${ariom.variable} ${sora.variable} ${outfit.variable} antialiased bg-background text-foreground`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

