import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weddingful — Your Destination Wedding, Optimized",
  description:
    "Free savings audit for destination wedding couples. Concierge planning service and qualified lead program for venues and planners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900 antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
