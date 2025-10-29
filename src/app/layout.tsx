import type { Metadata } from "next";
import { Inter, Saira, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "./lipamdogomdogo/contexts/ChatContext";
import ConditionalChatWidget from "./components/ConditionalChatWidget";

const inter = Inter({ subsets: ["latin"] });
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-saira",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
});
const open_sans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
  description:
    "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services. Your one-stop shop for all Safaricom needs in Ruaka.",
  metadataBase: new URL("https://www.safaricomshopruaka.co.ke"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Safaricom Shop Ruaka",
    title: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
    description:
      "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services. Your one-stop shop for all Safaricom needs in Ruaka.",
    url: "https://www.safaricomshopruaka.co.ke",
    type: "website",
    images: [
      {
        url: "https://www.safaricomshopruaka.co.ke/hero-image.png",
        width: 1200,
        height: 630,
        alt: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
      },
    ],
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
    description:
      "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services.",
    images: ["https://www.safaricomshopruaka.co.ke/hero-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon.ico", rel: "icon" },
      { url: "/favicon.ico", rel: "shortcut icon" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        {/* Structured Data for Organization and Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.safaricomshopruaka.co.ke/#organization",
                  name: "Safaricom Shop Ruaka",
                  url: "https://www.safaricomshopruaka.co.ke",
                  logo: {
                    "@type": "ImageObject",
                    "@id": "https://www.safaricomshopruaka.co.ke/#logo",
                    url: "https://www.safaricomshopruaka.co.ke/logo.png",
                    contentUrl: "https://www.safaricomshopruaka.co.ke/logo.png",
                    caption: "Safaricom Shop Ruaka",
                  },
                  image: {
                    "@id": "https://www.safaricomshopruaka.co.ke/#logo",
                  },
                  sameAs: [],
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      telephone: "+254-700-776-994",
                      contactType: "Customer Service",
                      areaServed: "KE",
                      availableLanguage: ["English", "Swahili"],
                    },
                    {
                      "@type": "ContactPoint",
                      telephone: "+254-700-776-994",
                      contactType: "Sales",
                      areaServed: "KE",
                      availableLanguage: ["English", "Swahili"],
                    },
                  ],
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Sandton Plaza, Ruaka",
                    addressLocality: "Ruaka",
                    addressRegion: "Kiambu",
                    addressCountry: "KE",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.875",
                    reviewCount: "8",
                    bestRating: "5",
                    worstRating: "3",
                  },
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.safaricomshopruaka.co.ke/#localbusiness",
                  name: "Safaricom Shop Ruaka",
                  image: "https://www.safaricomshopruaka.co.ke/hero-image.png",
                  sameAs: "https://www.safaricomshopruaka.co.ke/#organization",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Sandton Plaza, Ruaka",
                    addressLocality: "Ruaka",
                    addressRegion: "Kiambu",
                    postalCode: "00200",
                    addressCountry: "KE",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: "-1.1667",
                    longitude: "36.7833",
                  },
                  url: "https://www.safaricomshopruaka.co.ke",
                  telephone: "+254-700-776-994",
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ],
                      opens: "08:00",
                      closes: "19:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: "Saturday",
                      opens: "09:00",
                      closes: "18:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: "Sunday",
                      opens: "09:00",
                      closes: "18:00",
                    },
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.875",
                    reviewCount: "8",
                    bestRating: "5",
                    worstRating: "3",
                  },
                  servesCuisine: null,
                  areaServed: {
                    "@type": "City",
                    name: "Ruaka",
                  },
                  knowsAbout: [
                    "Mobile Phones",
                    "Mobile Accessories",
                    "Internet Services",
                    "Customer Care",
                    "Lipa Mdogo Mdogo",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.safaricomshopruaka.co.ke/#website",
                  url: "https://www.safaricomshopruaka.co.ke",
                  name: "Safaricom Shop Ruaka",
                  description:
                    "Your trusted mobile partner in Ruaka. Visit for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services.",
                  publisher: {
                    "@id": "https://www.safaricomshopruaka.co.ke/#organization",
                  },
                  inLanguage: "en-KE",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://www.safaricomshopruaka.co.ke/search?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": "https://www.safaricomshopruaka.co.ke/#webpage",
                  url: "https://www.safaricomshopruaka.co.ke",
                  name: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
                  description:
                    "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services. Your one-stop shop for all Safaricom needs in Ruaka.",
                  isPartOf: {
                    "@id": "https://www.safaricomshopruaka.co.ke/#website",
                  },
                  about: {
                    "@id": "https://www.safaricomshopruaka.co.ke/#organization",
                  },
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: "https://www.safaricomshopruaka.co.ke/hero-image.png",
                  },
                  breadcrumb: {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://www.safaricomshopruaka.co.ke",
                      },
                    ],
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${saira.variable} ${montserrat.variable} ${open_sans.variable}`}
      >
        <ChatProvider>
          {children}
          <ConditionalChatWidget />
        </ChatProvider>
      </body>
    </html>
  );
}
