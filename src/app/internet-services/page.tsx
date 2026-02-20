"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Wifi,
  Router,
  Zap,
  Shield,
  Truck,
  CheckCircle,
  Star,
  ArrowRight,
  ExternalLink,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Users,
  Home,
  Building,
  Smartphone,
  Globe,
  Signal,
  Battery,
  WifiIcon,
} from "lucide-react";
import Link from "next/link";

export default function InternetServicesPage() {
  const [activeTab, setActiveTab] = useState("5g");

  // FAQ structured data for Google (FAQPage)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does installation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most 5G setups are same-day. Secure Fiber installations typically take 24–72 hours after order confirmation, depending on address and building approvals.",
        },
      },
      {
        "@type": "Question",
        name: "Do you cover my area?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We serve Ruaka and the wider Nairobi area. 5G coverage depends on nearby cell sites; Secure Fiber depends on last‑mile availability. Contact us to check your exact address.",
        },
      },
      {
        "@type": "Question",
        name: "Is a router included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. 5G plans include a portable router. Secure Fiber plans include a Wi‑Fi router and professional installation.",
        },
      },
      {
        "@type": "Question",
        name: "What speeds can I expect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "5G plans range from 10–250 Mbps depending on the plan and signal quality. Secure Fiber plans range from 15–1000 Mbps with consistent performance.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a contract?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No long‑term lock‑in. Plans are billed monthly. You can upgrade, downgrade, or cancel with notice at the end of your billing cycle.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Call 0711 271 206, chat with us on the website, or visit the Customer Care page. We provide 24/7 technical support for active connections.",
        },
      },
    ],
  } as const;

  // Function to open WhatsApp with plan details
  const openWhatsApp = (plan: any, planType: string) => {
    const message = `Hello! I'm interested in ordering the ${plan.name} plan.

Plan Details:
• Plan: ${plan.name}
• Speed: ${plan.speed}
• Price: KES ${plan.price}/month
• Type: ${planType}

Features:
${plan.features.map((feature: string) => `• ${feature}`).join("\n")}

Please let me know how to proceed with the order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254711271206?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  // 5G Internet Plans
  const fiveGPlans = [
    {
      id: "10mbps",
      name: "5G Starter",
      speed: "10 MBPS",
      price: "2,999",
      features: [
        "Up to 10 Mbps",
        "Unlimited Data",
        "5G & 4G Support",
        "Free Setup",
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      popular: false,
    },
    {
      id: "50mbps",
      name: "5G Standard",
      speed: "50 MBPS",
      price: "4,000",
      features: [
        "Up to 50 Mbps",
        "Unlimited Data",
        "5G & 4G Support",
        "Free Setup",
      ],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      popular: true,
    },
    {
      id: "100mbps",
      name: "5G Premium",
      speed: "100 MBPS",
      price: "5,000",
      features: [
        "Up to 100 Mbps",
        "Unlimited Data",
        "5G & 4G Support",
        "Free Setup",
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      popular: false,
    },
    {
      id: "250mbps",
      name: "5G Ultimate",
      speed: "250 MBPS",
      price: "10,000",
      features: [
        "Up to 250 Mbps",
        "Unlimited Data",
        "5G & 4G Support",
        "Free Setup",
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      popular: false,
    },
  ];

  // Secure Fiber Plans
  const fiberPlans = [
    {
      id: "bronze",
      name: "Bronze",
      speed: "15 Mbps",
      originalPrice: "2,999",
      price: "2,250",
      features: [
        "Fast web browsing",
        "SD Movie & music streaming",
        "Internet surfing, social media & email",
        "Multiple device streaming",
        "Superfast video downloads",
        "CCTV devices Capability",
      ],
      includedFeatures: [0, 1, 2], // First 3 features are included
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      popular: false,
      headerBg: "bg-amber-600",
    },
    {
      id: "silver",
      name: "Silver",
      speed: "30 Mbps",
      originalPrice: "4,100",
      price: "3,075",
      features: [
        "Fast web browsing & Video calls",
        "HD TV shows and movies upto 3 connected devices",
        "Internet surfing, social media & email",
        "Moderate streaming",
        "Superfast video downloads",
        "CCTV devices Capability",
      ],
      includedFeatures: [0, 1, 2, 3, 4, 5], // All features included
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      popular: true,
      headerBg: "bg-gray-600",
    },
    {
      id: "gold",
      name: "Gold",
      speed: "80 Mbps",
      originalPrice: "6,299",
      price: "4,725",
      features: [
        "Fast web browsing",
        "4K Movies & TV Shows",
        "Online gaming and downloading",
        "Multiple device music streaming",
        "Superfast video downloads",
        "CCTV devices Capability",
      ],
      includedFeatures: [0, 1, 2, 3, 4, 5], // All features included
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      popular: false,
      headerBg: "bg-yellow-500",
    },
    {
      id: "diamond",
      name: "Diamond",
      speed: "500 Mbps",
      originalPrice: "12,499",
      price: "9,375",
      features: [
        "Fast web browsing",
        "4K Movie & TV Shows",
        "Heavy online gaming and downloading",
        "Multiple device streaming",
        "Superfast video downloads & music streaming",
        "CCTV devices Capability",
      ],
      includedFeatures: [0, 1, 2, 3, 4, 5], // All features included
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      popular: false,
      headerBg: "bg-pink-600",
    },
    {
      id: "platinum",
      name: "Platinum",
      speed: "1000 Mbps",
      originalPrice: null,
      price: "20,000",
      features: [
        "High-definition Movie and TV shows streaming 4K/8K",
        "Heavy online gaming and downloading",
        "Home Automation",
        "Multiple device streaming",
        "Superfast video downloads & music streaming",
      ],
      includedFeatures: [0, 1, 2, 3, 4], // All features included
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      popular: false,
      headerBg: "bg-purple-600",
    },
  ];

  // 5G Features
  const fiveGFeatures = [
    {
      title: "Blazing Fast 5G Speeds",
      description:
        "Experience ultra-fast internet with our cutting-edge 5G technology",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Supports 5G and 4G",
      description: "Seamless connectivity across both 5G and 4G networks",
      icon: Signal,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Flexible Internet Plans",
      description: "Choose from various plans that suit your needs and budget",
      icon: Globe,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Free Countrywide Delivery",
      description: "We deliver your router anywhere in Kenya at no extra cost",
      icon: Truck,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Portable and Wireless",
      description: "Take your internet anywhere with our portable 5G routers",
      icon: Smartphone,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Reliable Connectivity",
      description: "Enjoy stable and consistent internet connection",
      icon: Shield,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Unlimited Monthly Data",
      description: "No data caps, browse and stream without limits",
      icon: Wifi,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Free Setup",
      description: "Professional installation and setup at no additional cost",
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* FAQ JSON-LD for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/web.png"
            alt="Internet Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-emerald-700/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <Wifi className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Internet Services
                <span className="block text-2xl md:text-3xl font-normal mt-2">
                  Fast, Reliable, Secure
                </span>
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Experience blazing-fast internet with our 5G and secure fiber
                packages. Choose the perfect plan for your home or business
                needs.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "5g", label: "5G Internet", icon: Wifi },
              { id: "fiber", label: "Secure Fiber", icon: Shield },
              { id: "features", label: "Features", icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 5G Internet Plans Tab */}
        {activeTab === "5g" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                5G Internet Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of internet with our cutting-edge 5G
                technology. Fast, reliable, and portable.
              </p>
            </div>

            {/* 5G Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fiveGPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${plan.bgColor} border-2 ${
                    plan.borderColor
                  } rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-green-500 ring-opacity-50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Wifi className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>

                    <div className="mb-4">
                      <div className="text-3xl font-black text-gray-900 mb-1">
                        {plan.speed}
                      </div>
                      <div className="text-2xl font-bold text-gray-700">
                        KES {plan.price}
                        <span className="text-sm font-normal text-gray-500">
                          /month
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => openWhatsApp(plan, "5G Internet")}
                      className={`w-full px-6 py-3 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300`}
                    >
                      Choose Plan
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 5G Router Showcase */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Premium 5G Routers
                </h3>
                <p className="text-gray-600">
                  Get the latest 5G technology with our state-of-the-art routers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Router className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Safaricom 5G Router
                      </h4>
                      <p className="text-sm text-gray-600">
                        Latest 5G technology
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Dual Band WiFi
                      </h4>
                      <p className="text-sm text-gray-600">
                        2.4GHz & 5GHz support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Secure Connection
                      </h4>
                      <p className="text-sm text-gray-600">
                        Advanced security features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Router className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">5G Router Image</p>
                    <p className="text-sm text-gray-400">
                      Premium Safaricom 5G Router
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secure Fiber Plans Tab */}
        {activeTab === "fiber" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Secure Fiber Packages
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Reliable, secure, and dedicated fiber internet for your home or
                business. Perfect for heavy usage and critical applications.
              </p>
            </div>

            {/* Fiber Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              {fiberPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${plan.bgColor} border-2 ${
                    plan.borderColor
                  } rounded-2xl p-5 hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-green-500 ring-opacity-50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                    >
                      <Shield className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>

                    <div className="mb-4">
                      <div className="text-2xl font-black text-gray-900 mb-1">
                        {plan.speed}
                      </div>
                      <div className="text-lg font-bold text-gray-700">
                        {plan.originalPrice && (
                          <div className="text-xs text-gray-500 line-through mb-1">
                            KES {plan.originalPrice}
                          </div>
                        )}
                        KES {plan.price}
                        <span className="text-xs font-normal text-gray-500">
                          /month
                        </span>
                      </div>
                    </div>

                    {/* Features in single column for better fit */}
                    <ul className="space-y-1.5 mb-5 text-left">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-xs text-gray-600"
                        >
                          {plan.includedFeatures.includes(idx) ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5 flex items-center justify-center">
                              <div className="w-2.5 h-0.5 bg-red-400 rounded"></div>
                            </div>
                          )}
                          <span
                            className={
                              plan.includedFeatures.includes(idx)
                                ? "text-gray-700"
                                : "text-gray-400"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => openWhatsApp(plan, "Secure Fiber")}
                      disabled={
                        plan.features.length !== plan.includedFeatures.length
                      }
                      className={`w-full px-4 py-2.5 font-bold rounded-lg transition-all duration-300 text-sm ${
                        plan.features.length === plan.includedFeatures.length
                          ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg cursor-pointer`
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {plan.features.length === plan.includedFeatures.length
                        ? "Get Connected"
                        : "Upgrade Required"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Fiber Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose Secure Fiber?
                </h3>
                <p className="text-gray-600">
                  Experience the benefits of dedicated fiber internet
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Dedicated Line",
                    desc: "Your own dedicated connection",
                    icon: Shield,
                  },
                  {
                    title: "Free Router",
                    desc: "High-quality router included",
                    icon: Router,
                  },
                  {
                    title: "Free Installation",
                    desc: "Professional setup at no cost",
                    icon: CheckCircle,
                  },
                  {
                    title: "24/7 Support",
                    desc: "Round-the-clock technical support",
                    icon: Phone,
                  },
                ].map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <benefit.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Internet Services?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the features that make our internet services the best
                choice for your connectivity needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fiveGFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600">
              Contact us today to choose the perfect internet plan for your
              needs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0711271206"
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/254711271206?text=Hello! I'm interested in your internet services. Can you help me choose the right plan?"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/customer-care"
              className="px-8 py-3 bg-white border-2 border-green-200 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
