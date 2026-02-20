import type { Metadata } from "next";
import { Inter, Saira, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "./lipamdogomdogo/contexts/ChatContext";
import ConditionalChatWidget from "./components/ConditionalChatWidget";
import Script from "next/script";

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
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Safaricom Shop Ruaka",
    title: "Safaricom Shop Ruaka - Your Trusted Mobile Partner",
    description:
      "Visit Safaricom Shop Ruaka for customer care, mobile accessories, phones, and Lipa Mdogo Mdogo services.",
    url: "https://www.safaricomshopruaka.co.ke",
    type: "website",
    images: [
      {
        url: "https://www.safaricomshopruaka.co.ke/hero.png",
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
    images: ["https://www.safaricomshopruaka.co.ke/hero.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", rel: "icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
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
                      telephone: "+254-711-271-206",
                      contactType: "Customer Service",
                      areaServed: "KE",
                      availableLanguage: ["English", "Swahili"],
                    },
                    {
                      "@type": "ContactPoint",
                      telephone: "+254-711-271-206",
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
                  image: "https://www.safaricomshopruaka.co.ke/hero.png",
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
                  telephone: "+254-711-271-206",
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
                  review: [
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Winnie Connie",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody:
                        "Great customer service....I highly recommend.",
                      datePublished: "2024-01-15",
                    },
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Winfrey Kimani",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody:
                        "Thank you for being attentive to my issues,,, you solved what I long wished to be done. Asanteni🙏🏽",
                      datePublished: "2024-02-10",
                    },
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Silvester Waruih",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody: "Very excellent customer service",
                      datePublished: "2024-03-05",
                    },
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Linnet Mutuku",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody: "Top notch customer service",
                      datePublished: "2024-03-20",
                    },
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Bonface Muthuri",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody:
                        "Great customer service, sales high quality phones, I would recommend anyone",
                      datePublished: "2024-04-12",
                    },
                    {
                      "@type": "Review",
                      author: {
                        "@type": "Person",
                        name: "Victor Wandeto",
                      },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                      },
                      reviewBody:
                        "Bought a 5g router in a different store and not even Safaricom customer care was of help.Called these guys and was sorted in 10 minutes",
                      datePublished: "2024-05-08",
                    },
                  ],
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
                    url: "https://www.safaricomshopruaka.co.ke/hero.png",
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
        {/* Google Analytics Scripts */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CXCB4S3KMC"
        />

        <Script id="ga-setup">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CXCB4S3KMC');
          `}
        </Script>

        <ChatProvider>
          {children}
          <ConditionalChatWidget />
        </ChatProvider>
      </body>
    </html>
  );
}
