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
  title: "GLM-Image",
  description: "High-end AI Image Generation Dashboard",
  icons: {
    icon: "/favico.ico",
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

