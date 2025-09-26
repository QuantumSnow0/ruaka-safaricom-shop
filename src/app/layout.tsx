import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
  description:
    "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services. Your one-stop shop for all Safaricom needs in Ruaka.",
  metadataBase: new URL("https://safaricomshopruaka.co.ke"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/favicon_public/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_public/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon_public/favicon.ico", rel: "icon" },
    ],
    apple: [
      {
        url: "/favicon_public/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/favicon_public/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome",
        url: "/favicon_public/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon_public/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
