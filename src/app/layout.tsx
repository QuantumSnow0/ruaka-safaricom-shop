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
