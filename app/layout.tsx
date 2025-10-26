"use client";

import Head from "next/head";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { useCartStore } from "./stores/cartstore";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadFromLocalStorage = useCartStore(
    (state) => state.loadFromLocalStorage
  );

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <html lang="en">
      <Head>
        <title>Your Site Title</title>
        <meta name="description" content="Your site description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Your Site Title" />
        <meta property="og:description" content="Your site description" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/seo-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${playfair.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
