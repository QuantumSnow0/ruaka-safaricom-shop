"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import Popup from "./components/Popup";
import ImageCarouselGlass from "./components/ImageCarouselGlass";
import GalleryGrid from "./components/GalleryGrid";
import FlickerText from "./components/FlickerText";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Function to open maps with directions to the shop
  const openMaps = () => {
    // Shop location coordinates (you can update these with the actual shop location)
    const shopLatitude = -1.2066519; // Safaricom Shop Ruaka - Sandton Plaza
    const shopLongitude = 36.7847042;
    const shopName = "Safaricom Shop Ruaka";

    // Detect if user is on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // For mobile devices, try Apple Maps first (iOS) or Google Maps (Android)
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIOS) {
        // Open Apple Maps
        window.open(
          `https://maps.apple.com/?q=${shopLatitude},${shopLongitude}&z=15&t=m`
        );
      } else {
        // Open Google Maps for Android
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${shopLatitude},${shopLongitude}&travelmode=driving`
        );
      }
    } else {
      // For desktop, open Google Maps in new tab
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${shopLatitude},${shopLongitude}&travelmode=driving`,
        "_blank"
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[0.95rem] md:text-base">
      {/* FAQ JSON-LD covering Lipa Mdogo Mdogo, Internet, and Customer Care */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Lipa Mdogo Mdogo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Lipa Mdogo Mdogo is our flexible payment plan that lets you own a premium smartphone and pay in small, manageable installments.",
                },
              },
              {
                "@type": "Question",
                name: "How do I qualify for Lipa Mdogo Mdogo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Visit our Ruaka shop with your ID or contact Customer Care. We’ll check eligibility, help you pick a device, and set up a simple repayment plan.",
                },
              },
              {
                "@type": "Question",
                name: "Do you offer internet services?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We provide 5G portable internet and Secure Fiber (15–1000 Mbps). Installation times vary from same‑day (5G) to 24–72 hours (Fiber).",
                },
              },
              {
                "@type": "Question",
                name: "How can I reach Customer Care?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Call 0700 776 994, chat with us on the website, or visit the Customer Care page for 24/7 assistance.",
                },
              },
              {
                "@type": "Question",
                name: "Where are you located?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Safaricom Shop Ruaka, Sandton Plaza (opposite Cleanshelf supermarket), Ruaka, Kiambu County.",
                },
              },
            ],
          }),
        }}
      />
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/90 sm:border-b sm:border-green-200 sticky top-0 z-50 sm:shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="relative">
                <img
                  src="/android-chrome-512x512.png"
                  alt="Safaricom Logo"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-base md:text-xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 bg-clip-text text-transparent">
                    Safaricom Shop
                  </span>
                </h1>
                <p className="text-xs text-emerald-600 font-semibold">
                  Ruaka • Official Dealer
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  About
                </a>
                <Link
                  href="/customer-care"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  Support
                </Link>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="relative w-7 h-7 flex flex-col justify-center gap-1.5">
                <motion.span
                  className="block w-full h-0.5 bg-gray-800 rounded-full origin-center"
                  animate={{
                    y: mobileMenuOpen ? 7 : 0,
                    rotate: mobileMenuOpen ? 45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-gray-800 rounded-full"
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    width: mobileMenuOpen ? "0%" : "100%",
                  }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-gray-800 rounded-full origin-center"
                  animate={{
                    y: mobileMenuOpen ? -7 : 0,
                    rotate: mobileMenuOpen ? -45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-b border-gray-200 z-40"
            >
              <nav className="flex flex-col gap-0 pt-4 pb-3">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors py-2.5 px-3 border-b border-gray-200"
                >
                  Home
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors py-2.5 px-3 border-b border-gray-200"
                >
                  Services
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors py-2.5 px-3 border-b border-gray-200"
                >
                  About
                </a>
                <Link
                  href="/customer-care"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors py-2.5 px-3 border-b border-gray-200"
                >
                  Support
                </Link>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors py-2.5 px-3 border-b border-gray-200"
                >
                  Contact
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openMaps();
                  }}
                  className="mt-4 mx-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Visit Our Shop
                  <ExternalLink className="w-3 h-3" />
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-2 md:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-start lg:text-left order-1 lg:order-1">
              {/* Mobile: FlickerText */}
              <div className="md:hidden mb-3">
                <FlickerText
                  text="Ruaka Safaricom Shop"
                  textColor="#22c55e"
                  glowColor="#22c55e"
                  backgroundColor="transparent"
                  animationSpeed={1.5}
                  animationPattern="sequential"
                  repeatBehavior="loop"
                  animationStyle="neon"
                  strokeWidth={1}
                  glowIntensity={8}
                  showBackground={false}
                  autoPlay={true}
                  font={{
                    fontSize: "1.75rem",
                    letterSpacing: "0.05em",
                    lineHeight: "1.2em",
                  }}
                  style={{ padding: "0" }}
                />
              </div>
              {/* Desktop: Original Title */}
              <h1 className="hidden md:block text-xl sm:text-3xl md:text-5xl lg:text-6xl font-montserrat font-bold text-gray-900 mb-1 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Ruaka Safaricom Shop
                </span>
              </h1>

              <p className="text-start text-base sm:text-lg text-gray-700 mb-1 md:mb-6 leading-relaxed font-open-sans">
                Experience cutting-edge mobile technology with our premium
                services and revolutionary{" "}
                <span className="text-green-600 font-bold">
                  Lipa Mdogo Mdogo
                </span>{" "}
                payment solutions
              </p>

              <div className="hidden md:flex justify-center lg:justify-start">
                <button
                  onClick={openMaps}
                  className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-montserrat font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 text-base flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="relative z-10">Visit Our Shop</span>
                  <ExternalLink className="w-3 h-3" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Right Image Gallery - Desktop Only */}
            <div className="hidden lg:block order-2 lg:order-2">
              <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-xl">
                <GalleryGrid
                  items={[
                    {
                      src: "/gallery/ruakashop2.webp",
                      alt: "Safaricom Shop",
                      span: 2,
                    },
                    {
                      src: "/gallery/lipamdogomdogo.png",
                      alt: "Premium Phones",
                      span: 1,
                    },
                    {
                      src: "/gallery/ruakashop1.webp",
                      alt: "Latest Smartphones",
                      span: 1,
                    },
                    {
                      src: "/gallery/anniversary.jpg",
                      alt: "Mobile Devices",
                      span: 1,
                    },
                    {
                      src: "/gallery/safaricom.jpg",
                      alt: "Phone Collection",
                      span: 1,
                    },
                    { src: "/hero-image.png", alt: "Great Deals", span: 1 },
                  ]}
                  columns={3}
                  gap={8}
                  borderRadius={12}
                  enableHover={true}
                  enableAnimation={true}
                  enableShadow={false}
                  noOverflow={true}
                  backgroundColor="transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel - Mobile Only */}
      <section className="md:hidden bg-gradient-to-b from-white to-green-50 py-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <ImageCarouselGlass
            images={[
              "/safaricom-5g.jpg",
              "/phone.jpg",
              "/gallery/anniversary.jpg",
              "/gallery/safaricom.jpg",
              "/hero-image.png",
            ]}
            autoSwipeInterval={2500}
          />
        </div>
      </section>

      {/* Services Section - Zigzag Layout */}
      <section
        id="services"
        className="py-6 md:py-16 bg-white md:bg-gradient-to-b md:from-green-100 md:to-white relative overflow-hidden"
      >
        {/* Styled Separator */}
        <div className="md:hidden w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-6"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-start md:text-center mb-4 md:mb-16">
            <span className="hidden md:inline-block px-4 py-2 bg-green-500/20 text-green-600 text-sm font-semibold rounded-full mb-4">
              OUR SERVICES
            </span>
            <h2 className="text-xl md:text-5xl font-montserrat font-bold text-gray-900 mb-2 md:mb-4">
              What We{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Offer
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-open-sans mb-4 md:mb-0">
              Cutting-edge mobile solutions designed to elevate your digital
              experience
            </p>
          </div>

          {/* Mobile-First Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Service 1 - Lipa Mdogo Mdogo */}
            <a
              href="https://lipapolepole.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="md:absolute md:inset-0 md:bg-gradient-to-r md:from-yellow-500/20 md:to-orange-500/20 md:rounded-2xl md:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white md:border-yellow-500/30 rounded-xl md:rounded-2xl hover:bg-gray-50 md:hover:bg-yellow-50 transition-all duration-500 md:ring-2 md:ring-yellow-500/20 shadow-md md:shadow-lg overflow-hidden ring-2 ring-yellow-500/30 shadow-yellow-500/20">
                {/* Mobile: Compact Design with Image Background */}
                <div className="md:hidden relative h-40 overflow-hidden rounded-t-xl">
                  <Image
                    src="/smartphones.webp"
                    alt="Premium Phones"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 0vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src="/assets/icons/logo.png"
                        alt="App Icon"
                        className="w-6 h-6 object-contain"
                      />
                      <h3 className="text-white font-montserrat font-bold text-sm">
                        Lipa Mdogo Mdogo
                      </h3>
                      <div className="ml-auto bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {/* Desktop: Icon and Title */}
                  <div className="hidden md:flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/assets/icons/logo.png"
                        alt="App Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-1">
                        Lipa Mdogo Mdogo
                      </h3>
                      <div className="inline-block bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 md:text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-open-sans">
                    Our revolutionary flexible payment solution that makes
                    premium mobile devices accessible to everyone. Pay mdogo
                    mdogo and own your dream phone today!
                  </p>
                  <div className="flex items-center text-yellow-600 font-semibold text-xs md:text-sm">
                    Start Paying mdogo mdogo
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Service 2 - Mobile Accessories */}
            <div className="relative group">
              <div className="md:absolute md:inset-0 md:bg-gradient-to-r md:from-red-500/20 md:to-pink-500/20 md:rounded-2xl md:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white md:border-green-200 rounded-xl md:rounded-2xl hover:bg-gray-50 md:hover:bg-green-50 transition-all duration-500 md:shadow-lg shadow-md overflow-hidden ring-2 ring-red-500/30 shadow-red-500/20">
                {/* Mobile: Compact Design with Image Background */}
                <div className="md:hidden relative h-40 overflow-hidden rounded-t-xl">
                  <Image
                    src="/phone-mobile.jpg"
                    alt="Mobile Accessories"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 0vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/icons/battery.png"
                        alt="App Icon"
                        className="w-6 h-6 object-contain"
                      />
                      <h3 className="text-white font-montserrat font-bold text-sm">
                        Premium Accessories
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {/* Desktop: Icon and Title */}
                  <div className="hidden md:flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/assets/icons/battery.png"
                        alt="App Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-1">
                        Premium Accessories
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 md:text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-open-sans">
                    Discover our curated collection of premium mobile
                    accessories. From protective cases to high-quality
                    headphones, we have everything you need.
                  </p>
                  <div className="flex items-center text-red-600 font-semibold text-xs md:text-sm">
                    Explore Collection
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Service 3 - Mobile Phones */}
            <a
              href="https://www.phoneupkenya.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="md:absolute md:inset-0 md:bg-gradient-to-r md:from-blue-500/20 md:to-cyan-500/20 md:rounded-2xl md:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white md:border-green-200 rounded-xl md:rounded-2xl hover:bg-gray-50 md:hover:bg-green-50 transition-all duration-500 md:shadow-lg shadow-md overflow-hidden ring-2 ring-blue-500/30 shadow-blue-500/20">
                {/* Mobile: Compact Design with Image Background */}
                <div className="md:hidden relative h-40 overflow-hidden rounded-t-xl">
                  <Image
                    src="/latest-phones.webp"
                    alt="Latest Smartphones"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 0vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo.jpeg"
                        alt="PhoneUp Kenya Logo"
                        className="w-6 h-6 object-contain"
                      />
                      <h3 className="text-white font-montserrat font-bold text-sm">
                        Shop Latest Smartphones
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {/* Desktop: Icon and Title */}
                  <div className="hidden md:flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/logo.jpeg"
                        alt="PhoneUp Kenya Logo"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-1">
                        Shop Latest Smartphones
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 md:text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-open-sans">
                    Get your hands on the latest smartphones from top brands
                    with competitive prices, comprehensive warranty, and expert
                    setup assistance.
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold text-xs md:text-sm">
                    Shop at PhoneUp Kenya
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Service 4 - Customer Care */}
            <Link
              href="/customer-care"
              className="relative group hover:cursor-pointer"
            >
              <div className="md:absolute md:inset-0 md:bg-gradient-to-r md:from-green-500/20 md:to-emerald-500/20 md:rounded-2xl md:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white md:border-green-200 rounded-xl md:rounded-2xl hover:bg-gray-50 md:hover:bg-green-50 transition-all duration-500 md:shadow-lg shadow-md overflow-hidden ring-2 ring-green-500/30 shadow-green-500/20">
                {/* Mobile: Compact Design with Image Background */}
                <div className="md:hidden relative h-40 overflow-hidden rounded-t-xl">
                  <Image
                    src="/customer-care.jpg"
                    alt="Customer Care"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 0vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/icons/support.png"
                        alt="App Icon"
                        className="w-6 h-6 object-contain"
                      />
                      <h3 className="text-white font-montserrat font-bold text-sm">
                        Customer Care Excellence
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {/* Desktop: Icon and Title */}
                  <div className="hidden md:flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/assets/icons/support.png"
                        alt="App Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-1">
                        Customer Care Excellence
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 md:text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-open-sans">
                    Professional customer support with expert assistance for all
                    your Safaricom needs. Our dedicated team ensures you get the
                    best service experience.
                  </p>
                  <div className="flex items-center text-green-600 font-semibold text-xs md:text-sm">
                    Get Support
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 5 - Internet Services */}
            <Link
              href="/internet-services"
              className="relative group hover:cursor-pointer"
            >
              <div className="md:absolute md:inset-0 md:bg-gradient-to-r md:from-purple-500/20 md:to-indigo-500/20 md:rounded-2xl md:blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white md:border-green-200 rounded-xl md:rounded-2xl hover:bg-gray-50 md:hover:bg-green-50 transition-all duration-500 md:shadow-lg shadow-md overflow-hidden ring-2 ring-purple-500/30 shadow-purple-500/20">
                {/* Mobile: Compact Design with Image Background */}
                <div className="md:hidden relative h-40 overflow-hidden rounded-t-xl">
                  <Image
                    src="/fiber.jpg"
                    alt="Internet Services"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 0vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/icons/wifi.png"
                        alt="App Icon"
                        className="w-6 h-6 object-contain"
                      />
                      <h3 className="text-white font-montserrat font-bold text-sm">
                        Internet Services
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  {/* Desktop: Icon and Title */}
                  <div className="hidden md:flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/assets/icons/wifi.png"
                        alt="App Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-1">
                        Internet Services
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 md:text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-open-sans">
                    Experience blazing-fast internet with our 5G and secure
                    fiber packages. Choose from flexible plans perfect for your
                    home or business needs.
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold text-xs md:text-sm">
                    View Plans
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-8 md:py-20 bg-white md:bg-gradient-to-b md:from-white md:to-green-50 relative"
      >
        {/* Styled Separator */}
        <div className="md:hidden w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-6"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 text-sm font-semibold rounded-full mb-6">
                ABOUT US
              </span>
              <h2 className="text-xl md:text-5xl font-montserrat font-bold text-gray-900 mb-3 md:mb-6">
                Your Trusted{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Mobile Partner
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-6 leading-relaxed font-open-sans">
                Located in the heart of Ruaka, we are your trusted Safaricom
                partner providing comprehensive mobile solutions. Our
                experienced team is dedicated to delivering exceptional service
                and ensuring you get the best value for your money.
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-8 leading-relaxed font-open-sans">
                We specialize in customer care, mobile accessories, the latest
                smartphones, internet services, and our signature Lipa Mdogo
                Mdogo service that makes premium mobile devices accessible to
                everyone through flexible payment plans.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-800 font-semibold text-sm md:text-base">
                    Authorized Safaricom Dealer
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                  <span className="text-gray-800 font-semibold text-sm md:text-base">
                    Expert Customer Support
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl hidden md:block"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl md:rounded-3xl p-4 md:p-12 shadow-lg">
                <h3 className="text-base md:text-3xl font-montserrat font-bold text-gray-900 mb-1 md:mb-8 text-center">
                  Why Choose Us?
                </h3>
                {/* Mobile: Compact Grid Layout */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 font-montserrat font-semibold text-xs mb-1 leading-tight">
                      Genuine Products
                    </h4>
                    <p className="text-gray-600 font-open-sans text-xs leading-tight">
                      Official warranty
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 font-montserrat font-semibold text-xs mb-1 leading-tight">
                      Best Prices
                    </h4>
                    <p className="text-gray-600 font-open-sans text-xs leading-tight">
                      Regular promotions
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 font-montserrat font-semibold text-xs mb-1 leading-tight">
                      Flexible Payment
                    </h4>
                    <p className="text-gray-600 font-open-sans text-xs leading-tight">
                      Lipa Mdogo Mdogo
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 font-montserrat font-semibold text-xs mb-1 leading-tight">
                      After-Sales Support
                    </h4>
                    <p className="text-gray-600 font-open-sans text-xs leading-tight">
                      Comprehensive service
                    </p>
                  </div>
                </div>

                {/* Desktop: Original Layout */}
                <div className="hidden md:block space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-montserrat font-medium text-lg mb-2">
                        Genuine Products with Warranty
                      </h4>
                      <p className="text-gray-700 font-open-sans">
                        All our products come with official warranty and
                        authenticity guarantee
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-montserrat font-medium text-lg mb-2">
                        Competitive Pricing
                      </h4>
                      <p className="text-gray-700 font-open-sans">
                        Best prices in the market with regular promotions and
                        discounts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-montserrat font-medium text-lg mb-2">
                        Flexible Payment Options
                      </h4>
                      <p className="text-gray-700 font-open-sans">
                        Multiple payment methods including our signature Lipa
                        Mdogo Mdogo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-montserrat font-medium text-lg mb-2">
                        Professional After-Sales Support
                      </h4>
                      <p className="text-gray-700 font-open-sans">
                        Comprehensive support and maintenance services for all
                        products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Visit Our Shop Section */}
      <section className="hidden md:block py-10 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 md:p-8 border border-green-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Visit Us
                  </h3>
                  <p className="text-sm text-gray-600">
                    Safaricom Shop Ruaka, Sandton Plaza, Ruaka
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Open Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mon-Fri: 8AM-7PM, Sat: 9AM-6PM
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Contact
                  </h3>
                  <p className="text-sm text-gray-600">+254 700 776 994</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-6 md:py-20 bg-white md:bg-gradient-to-b md:from-green-50 md:to-white relative overflow-hidden"
      >
        {/* Styled Separator */}
        <div className="md:hidden w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-6"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-montserrat font-bold text-gray-900 mb-2 md:mb-4">
              Visit Us{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-lg text-gray-700 font-open-sans">
              We&apos;re here to serve you better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-3xl p-8 text-center hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-montserrat font-medium text-gray-900 mb-4">
                  Location
                </h3>
                <p className="text-gray-700 text-lg font-open-sans">
                  Ruaka, Kiambu County
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-3xl p-8 text-center hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-montserrat font-medium text-gray-900 mb-4">
                  Phone
                </h3>
                <p className="text-gray-700 text-lg font-open-sans">
                  +254 700 776 994
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-3xl p-8 text-center hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-montserrat font-medium text-gray-900 mb-4">
                  Hours
                </h3>
                <p className="text-gray-700 text-lg font-open-sans">
                  Mon-Sat: 8AM-8PM
                </p>
                <p className="text-gray-700 text-lg font-open-sans">
                  Sun: 9AM-6PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-montserrat font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
              Safaricom Shop Ruaka
            </h3>
            <p className="text-gray-300 text-lg mb-8 font-open-sans">
              Your trusted mobile partner in Ruaka
            </p>

            <div className="flex justify-center space-x-8 mb-12">
              <a
                href="#"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <img src={"/facebook.svg"} className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
            </div>

            <p className="text-gray-500 font-open-sans">
              &copy; 2024 Safaricom Shop Ruaka. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Internet Services Offer Popup */}
      <Popup />
    </div>
  );
}
