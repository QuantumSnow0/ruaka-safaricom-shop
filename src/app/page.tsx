"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";

export default function Home() {
  // Function to open maps with directions to the shop
  const openMaps = () => {
    // Shop location coordinates (you can update these with the actual shop location)
    const shopLatitude = -1.205584; // Example coordinates for Ruaka area
    const shopLongitude = 36.779357;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/90 sm:border-b sm:border-green-200 sticky top-0 z-50 sm:shadow-lg">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative flex-shrink-0">
                <img
                  src="/mobile-logo.svg"
                  alt="Safaricom Logo"
                  className="absolute left-[30px] top-[-18px] lg:top-[-20px] lg:left-[27px] z-[-100]  w-17 h-17 sm:w-20 sm:h-20 lg:w-18 lg:h-18 object-contain"
                />
                <h1 className="ml-16 text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Safaricom Shop
                </h1>
                <p className="ml-16 text-sm text-gray-600 font-medium">Ruaka</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-green-50"
                >
                  Home
                </a>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-green-50"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-green-50"
                >
                  About
                </a>
                <Link
                  href="/customer-care"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-green-50"
                >
                  Support
                </Link>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-green-50"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-5 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-1 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Welcome to{" "}
                <div>
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Ruaka Safaricom Shop
                  </span>
                </div>
              </h1>

              <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                Experience cutting-edge mobile technology with our premium
                services and revolutionary{" "}
                <span className="text-green-600 font-bold">
                  Lipa Mdogo Mdogo
                </span>{" "}
                payment solutions
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={openMaps}
                  className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="relative z-10">Visit Our Shop</span>
                  <ExternalLink className="w-3 h-3" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <Link
                  href="#services"
                  className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md bg-white/80 border border-green-300 text-gray-700 font-bold rounded-xl transition-all duration-300 hover:bg-green-50 hover:border-green-400 text-sm sm:text-base"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right Visual - Circular Layout */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto order-2 lg:order-2">
              {/* Center Card - Lipa Mdogo Mdogo (The Sun) */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <a
                  href="https://lipapolepole.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500/40 to-orange-500/40 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  ></motion.div>
                  <motion.div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-green-500/40"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src="/assets/icons/logo.png"
                      alt="Safaricom Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-18 lg:h-18 object-cover"
                    />
                  </motion.div>
                </a>
              </motion.div>

              {/* Revolving Container */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
              >
                {/* Top Card - Phones */}
                <motion.div
                  className="absolute top-[-15] left-1/2 transform -translate-x-1/2 group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center  m-2 sm:m-4 group-hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      },
                      scale: {
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  >
                    <div className="flex items-center flex-col gap-1 p-10">
                      <img
                        src="/assets/icons/app.png"
                        alt="App Icon"
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                      />
                      <h6 className="text-sm text-green-600 font-semibold">
                        Smartphones
                      </h6>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Card - Accessories */}
                <motion.div
                  className="absolute top-1/2 right-[-15] transform -translate-y-1/2 group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center  m-2 sm:m-4 group-hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      },
                      scale: {
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  >
                    <div className="flex items-center flex-col gap-1 p-10">
                      <img
                        src="/assets/icons/battery.png"
                        alt="battery Icon"
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                      />
                      <h6 className="text-sm text-green-600 font-semibold">
                        accessories
                      </h6>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Bottom Card - Support */}
                <motion.div
                  className="absolute bottom-[-15] left-1/2 transform -translate-x-1/2 group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24  flex items-center justify-center  sm:m-4 group-hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      },
                      scale: {
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  >
                    <div className="flex items-center flex-col gap-1 p-10">
                      <img
                        src="/assets/icons/support.png"
                        alt="App Icon"
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                      />
                      <h6 className="text-sm text-green-600 font-semibold">
                        support
                      </h6>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Left Card - Internet */}
                <motion.div
                  className="absolute top-1/2 left-[-15] transform -translate-y-1/2 group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center sm:m-4 group-hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      },
                      scale: {
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  >
                    <div className="flex items-center flex-col gap-1 p-10">
                      <img
                        src="/assets/icons/wifi.png"
                        alt="App Icon"
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                      />
                      <h6 className="text-sm text-green-600 font-semibold">
                        internet
                      </h6>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Decorative Rings */}
              <motion.div
                className="absolute inset-0 border-2 border-green-200/30 rounded-full"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="absolute inset-8 border border-green-300/20 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              ></motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Zigzag Layout */}
      <section
        id="services"
        className="py-10 bg-gradient-to-b from-green-100 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 text-sm font-semibold rounded-full mb-4">
              OUR SERVICES
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What We{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Offer
              </span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Cutting-edge mobile solutions designed to elevate your digital
              experience
            </p>
          </div>

          {/* Mobile-First Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 - Lipa Mdogo Mdogo */}
            <a
              href="https://lipapolepole.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 hover:bg-yellow-50 transition-all duration-500 ring-2 ring-yellow-500/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-15 h-15 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/icons/logo.png"
                      alt="App Icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Lipa Mdogo Mdogo
                    </h3>
                    <div className="inline-block bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Our revolutionary flexible payment solution that makes premium
                  mobile devices accessible to everyone. Pay mdogo mdogo and own
                  your dream phone today!
                </p>
                <div className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Start Paying mdogo mdogo
                  <svg
                    className="w-4 h-4 ml-2"
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
            </a>

            {/* Service 2 - Mobile Accessories */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl p-6 hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/icons/battery.png"
                      alt="App Icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Premium Accessories
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Discover our curated collection of premium mobile accessories.
                  From protective cases to high-quality headphones, we have
                  everything you need.
                </p>
                <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Explore Collection
                  <svg
                    className="w-4 h-4 ml-2"
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

            {/* Service 3 - Mobile Phones */}
            <Link href="/lipamdogomdogo/products" className="relative group">
              <div className="absolute inset-0  blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl p-6 hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12  flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/icons/app.png"
                      alt="App Icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Latest Smartphones
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Get your hands on the latest smartphones from top brands with
                  competitive prices, comprehensive warranty, and expert setup
                  assistance.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  View Phones
                  <svg
                    className="w-4 h-4 ml-2"
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
            </Link>

            {/* Service 4 - Customer Care */}
            <Link
              href="/customer-care"
              className="relative group hover:cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl p-6 hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/icons/support.png"
                      alt="App Icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Customer Care Excellence
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Professional customer support with expert assistance for all
                  your Safaricom needs. Our dedicated team ensures you get the
                  best service experience.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Get Support
                  <svg
                    className="w-4 h-4 ml-2"
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
            </Link>

            {/* Service 5 - Internet Services */}
            <Link
              href="/internet-services"
              className="relative group hover:cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl p-6 hover:bg-green-50 transition-all duration-500 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/assets/icons/wifi.png"
                      alt="App Icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Internet Services
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Experience blazing-fast internet with our 5G and secure fiber
                  packages. Choose from flexible plans perfect for your home or
                  business needs.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  View Plans
                  <svg
                    className="w-4 h-4 ml-2"
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
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-white to-green-50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 text-sm font-semibold rounded-full mb-6">
                ABOUT US
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Your Trusted{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Mobile Partner
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Located in the heart of Ruaka, we are your trusted Safaricom
                partner providing comprehensive mobile solutions. Our
                experienced team is dedicated to delivering exceptional service
                and ensuring you get the best value for your money.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We specialize in customer care, mobile accessories, the latest
                smartphones, internet services, and our signature Lipa Mdogo
                Mdogo service that makes premium mobile devices accessible to
                everyone through flexible payment plans.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-800 font-semibold">
                    Authorized Safaricom Dealer
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-green-200 shadow-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                  <span className="text-gray-800 font-semibold">
                    Expert Customer Support
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-md border border-green-200 rounded-3xl p-12 shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Why Choose Us?
                </h3>
                <div className="space-y-6">
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
                      <h4 className="text-gray-900 font-semibold text-lg mb-2">
                        Genuine Products with Warranty
                      </h4>
                      <p className="text-gray-700">
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
                      <h4 className="text-gray-900 font-semibold text-lg mb-2">
                        Competitive Pricing
                      </h4>
                      <p className="text-gray-700">
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
                      <h4 className="text-gray-900 font-semibold text-lg mb-2">
                        Flexible Payment Options
                      </h4>
                      <p className="text-gray-700">
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
                      <h4 className="text-gray-900 font-semibold text-lg mb-2">
                        Professional After-Sales Support
                      </h4>
                      <p className="text-gray-700">
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

      {/* Visit Our Shop Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-600 text-sm font-semibold rounded-full mb-4">
              PHYSICAL LOCATION
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Visit Our{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Physical Shop
              </span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Experience our products in person at our conveniently located shop
              in Ruaka. Get hands-on with the latest devices and speak directly
              with our experts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Shop Info */}
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-md border border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Safaricom Shop Ruaka
                      <br />
                      Ruaka Town Center
                      <br />
                      Kiambu County, Kenya
                    </p>
                    <p className="text-sm text-gray-500">
                      Sandton plaza, opposite Cleanshelf supermarket
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Opening Hours
                    </h3>
                    <div className="space-y-1 text-gray-700">
                      <p>Monday - Friday: 8:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-orange-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Contact
                    </h3>
                    <p className="text-gray-700 mb-1">
                      Phone: +254 700 776 994
                    </p>
                    <p className="text-gray-700">
                      Email: safaricomshopruaka@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Map and CTA */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    Click "Get Directions" to view in maps
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <button
                  onClick={openMaps}
                  className="w-full group relative px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 flex items-center justify-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-4 h-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-3 bg-white border-2 border-orange-200 text-orange-600 font-semibold rounded-xl transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    Call Us
                  </button>
                  <button className="px-4 py-3 bg-white border-2 border-orange-200 text-orange-600 font-semibold rounded-xl transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 text-sm font-semibold rounded-full mb-4">
              GET IN TOUCH
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Visit Us{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-lg text-gray-700">
              We&apos;re here to serve you better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Location
                </h3>
                <p className="text-gray-700 text-lg">Ruaka, Kiambu County</p>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone</h3>
                <p className="text-gray-700 text-lg">+254 700 776 994</p>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hours</h3>
                <p className="text-gray-700 text-lg">Mon-Sat: 8AM-8PM</p>
                <p className="text-gray-700 text-lg">Sun: 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
              Safaricom Shop Ruaka
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              Your trusted mobile partner in Ruaka
            </p>

            <div className="flex justify-center space-x-8 mb-12">
              <a
                href="#"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
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

            <p className="text-gray-500">
              &copy; 2024 Safaricom Shop Ruaka. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
