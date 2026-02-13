import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "MediTrack • Modern Medicine Discovery",
  description: "Experience the future of healthcare logistics with MediTrack's location-based discovery and inventory management system.",
  keywords: ["medicine search", "pharmacy locator", "medical inventory", "healthcare app"],
  authors: [{ name: "MediTrack Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} antialiased selection:bg-slate-900 selection:text-white`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
