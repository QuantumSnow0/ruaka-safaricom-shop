import { Metadata } from "next";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog - Safaricom Shop Ruaka | Tech Tips, Deals & Local Insights",
  description:
    "Your ultimate source for Safaricom deals, tech tips, smartphone reviews, and local insights in Ruaka. Stay updated with the latest promotions and money-saving tips.",
  keywords: [
    "safaricom blog",
    "ruaka tech blog",
    "safaricom deals",
    "data bundles kenya",
    "smartphone reviews",
    "tech tips kenya",
    "mobile phone deals",
    "internet services ruaka",
  ],
  openGraph: {
    title: "Blog - Safaricom Shop Ruaka",
    description:
      "Your ultimate source for Safaricom deals, tech tips, and local insights in Ruaka",
    type: "website",
    locale: "en_KE",
    siteName: "Safaricom Shop Ruaka",
    images: [
      {
        url: "/assets/blog/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "Safaricom Shop Ruaka Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Safaricom Shop Ruaka",
    description:
      "Your ultimate source for Safaricom deals, tech tips, and local insights in Ruaka",
    images: ["/assets/blog/blog-og.jpg"],
  },
  alternates: {
    canonical: "https://www.safaricomshopruaka.co.ke/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Safaricom Shop Ruaka Blog",
            description:
              "Your ultimate source for Safaricom deals, tech tips, and local insights in Ruaka",
            url: "https://www.safaricomshopruaka.co.ke/blog",
            publisher: {
              "@type": "Organization",
              name: "Safaricom Shop Ruaka",
              logo: {
                "@type": "ImageObject",
                url: "https://www.safaricomshopruaka.co.ke/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://www.safaricomshopruaka.co.ke/blog",
            },
            inLanguage: "en-KE",
            about: {
              "@type": "Thing",
              name: "Safaricom services, mobile technology, deals and promotions",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
