import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import OneSignalInit from "@/components/OneSignalInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rocket.watch",
  description: "Spaceflight launches and events tracker",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-200`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <OneSignalInit />
      </body>
    </html>
  );
}
