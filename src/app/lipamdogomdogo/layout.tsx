import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@lipam/contexts/AuthContext";
import { CartProvider } from "@lipam/contexts/CartContext";
import { WishlistProvider } from "@lipam/contexts/WishlistContext";
import Header from "@lipam/components/layout/Header";
import Footer from "@lipam/components/layout/Footer";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lipamdogomdogo - Own the latest phone today, pay little by little",
  description:
    "Premium mobile phones with flexible installment payments. Get the latest smartphones and pay in convenient weekly or monthly installments.",
  keywords:
    "mobile phones, smartphones, installment payments, iPhone, Samsung, Huawei, Xiaomi, Kenya",
  authors: [{ name: "Lipamdogomdogo" }],
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: "Lipamdogomdogo - Premium Phones on Installments",
    description: "Own the latest phone today, pay little by little",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lipamdogomdogo - Premium Phones on Installments",
    description: "Own the latest phone today, pay little by little",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col">
                <Suspense
                  fallback={
                    <div className="bg-white shadow-lg sticky top-0 z-40 overflow-visible">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                          {/* Logo skeleton */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          </div>

                          {/* Desktop nav skeleton */}
                          <div className="hidden md:flex items-center space-x-8">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </div>

                          {/* Right side skeleton */}
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Header />
                </Suspense>
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
