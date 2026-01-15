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
  title: "GLM-Image | Unofficial Wrapper for Zhipu AI's Open Source Image Model",
  description: "An unofficial web interface for Z.ai's open-source GLM-Image model. Features intelligent prompt optimization via GLM-4.7, multiple aspect ratios, and a community discovery feed. Free to use.",
  openGraph: {
    title: "GLM-Image | Zhipu AI's Open Source Image Generation",
    description: "Unofficial wrapper for Z.ai's GLM-Image model. Create stunning AI images with smart prompt optimization. Open source and free.",
    type: "website",
    siteName: "GLM-Image",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLM-Image | Zhipu AI's Open Source Image Generation",
    description: "Unofficial wrapper for Z.ai's GLM-Image model. Create stunning AI images with smart prompt optimization. Open source and free.",
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

