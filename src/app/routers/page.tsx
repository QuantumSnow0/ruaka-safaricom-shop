"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Wifi,
  Zap,
  ShieldCheck,
  Truck,
  Phone,
  MessageCircle,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Signal,
} from "lucide-react";

const fiveGPlans = [
  {
    speed: "10 Mbps",
    price: "KES 2,999",
    ideal: "Video calls, smart homes, casual streaming",
  },
  {
    speed: "50 Mbps",
    price: "KES 4,000",
    ideal: "Remote work, HD streaming, small teams",
  },
  {
    speed: "100 Mbps",
    price: "KES 5,000",
    ideal: "4K streaming, gaming, multi-device homes",
  },
  {
    speed: "250 Mbps",
    price: "KES 10,000",
    ideal: "Studios, heavy uploads, shared spaces",
  },
];

const fourGBundles = [
  { price: "KES 499", volume: "7.5 GB", validity: "7 Days" },
  { price: "KES 999", volume: "25 GB", validity: "30 Days" },
  { price: "KES 1,999", volume: "60 GB", validity: "30 Days" },
  { price: "KES 2,999", volume: "140 GB", validity: "30 Days" },
  { price: "KES 4,100", volume: "180 GB", validity: "30 Days" },
  { price: "KES 6,299", volume: "250 GB", validity: "30 Days" },
  { price: "KES 12,499", volume: "500 GB", validity: "30 Days" },
];

const valueProps = [
  {
    title: "Unlimited Monthly Data",
    description:
      "All 5G plans are truly unlimited. Select a speed, not a cap, and surf without throttling.",
    icon: CheckCircle2,
  },
  {
    title: "Portable & Wireless",
    description:
      "Plug in anywhere within coverage. Perfect interim solution while waiting for fibre.",
    icon: Zap,
  },
  {
    title: "Secure Connectivity",
    description:
      "Enterprise-grade WPA3 security plus device management keeps every connection protected.",
    icon: ShieldCheck,
  },
  {
    title: "Free Delivery & Setup",
    description:
      "We handle device configuration, drop-off, and after-sales support at no extra cost.",
    icon: Truck,
  },
  {
    title: "5G & 4G Compatibility",
    description:
      "Seamless fallback to 4G ensures you stay online even beyond core 5G zones.",
    icon: Wifi,
  },
  {
    title: "Local Support",
    description:
      "Talk to our Ruaka team anytime for upgrades, relocations, or troubleshooting.",
    icon: Phone,
  },
];

const onboardingSteps = [
  {
    title: "Confirm Coverage",
    description:
      "Share your location with us to verify 5G or 4G signal strength around your home or business.",
    icon: MapPin,
  },
  {
    title: "Pick Your Plan",
    description:
      "Choose a 5G speed tier or 4G bundle that suits your household or team usage.",
    icon: Signal,
  },
  {
    title: "We Deliver & Set Up",
    description:
      "Our specialists configure the router, deliver it to you, and ensure every device connects.",
    icon: Truck,
  },
  {
    title: "Stay Supported",
    description:
      "Reach us anytime via call or WhatsApp for upgrades, add-ons, or quick troubleshooting.",
    icon: MessageCircle,
  },
];

export default function RoutersPage() {
  const contactNumber = "0700776994";
  const whatsappLink = "https://wa.me/254700776994";

  return (
    <div className="min-h-screen bg-white text-gray-900 text-[0.95rem] md:text-base">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0">
          <Image
            src="/router7.jpg"
            alt="Safaricom 5G Router"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-[#FDF2E6]/10 p-5 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg lg:bg-transparent lg:p-0 lg:border-0 lg:shadow-none">
              <span className="inline-flex items-center gap-2 bg-[#FFE7C2] text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 lg:bg-white/15 lg:text-white">
                <Zap className="w-4 h-4" />
                5G & 4G Internet
              </span>
              <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold font-montserrat mb-4 text-white lg:text-white">
                Routers for Every Home & Business in Ruaka
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-wgite lg:text-white/90 font-open-sans mb-6">
                Enjoy fibre-like speeds with our portable 5G router or choose
                flexible 4G Wi-Fi bundles. We deliver, install, and keep you
                online with the most reliable Safaricom connectivity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 bg-white/80 text-gray-900 rounded-xl px-4 py-3 text-sm lg:bg-white/10 lg:text-white">
                  <Wifi className="w-4 h-4" />
                  Unlimited monthly data on 5G speeds
                </div>
                <div className="flex items-center gap-3 bg-white/80 text-gray-900 rounded-xl px-4 py-3 text-sm lg:bg-white/10 lg:text-white">
                  <Truck className="w-4 h-4" />
                  Free delivery & same-day activation
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${contactNumber}`}
                  className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Call {contactNumber}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700/50 text-white font-semibold px-5 py-3 rounded-lg border border-white/40 hover:bg-emerald-700/70 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 lg:p-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                <span>What you get</span>
              </h2>
              <ul className="space-y-3 text-white/95 text-sm md:text-base font-open-sans">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                  Unlimited monthly data across all 5G speed tiers.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                  Dual-band coverage with automatic 5G/4G switching.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                  Dedicated Ruaka support line for upgrades and troubleshooting.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-montserrat text-emerald-900 mb-2">
                  Portable 5G Router Plans
                </h2>
                <p className="text-sm sm:text-base text-emerald-800 font-open-sans">
                  Unlimited monthly data. Pick a speed tier that fits your
                  streaming, gaming, or work needs.
                </p>
              </div>
              <Zap className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fiveGPlans.map((plan) => (
                <div
                  key={plan.speed}
                  className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                    {plan.speed}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {plan.price}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 mb-3">
                    Unlimited Monthly Data
                  </p>
                  <p className="text-sm text-gray-600 font-open-sans">
                    {plan.ideal}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white/80 border border-emerald-200 rounded-2xl px-5 py-4 text-sm text-emerald-900 font-semibold flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-500" />
              Free delivery, plug-and-play setup, and device optimisation
              included.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">
                  4G Wi-Fi Router Promo
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-open-sans">
                  Enjoy 25% off the router price plus free 30 GB starter data
                  for upgrades and new connections.
                </p>
              </div>
              <CalendarDays className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="bg-emerald-600 text-white rounded-2xl px-5 py-6 mb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  <Zap className="w-4 h-4" />
                  Ends 5 January 2025
                </span>
                <span className="text-sm font-semibold uppercase tracking-wide text-white/80">
                  Limited stock available
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-3xl font-bold">KES 2,250</p>
                <span className="text-lg text-white/70 line-through">
                  KES 2,999
                </span>
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  Free 30 GB Starter Data
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/90 font-open-sans">
                Reserve your router today and we will deliver, install, and get
                you online at no extra cost.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base font-open-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                  Same-day activation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                  Priority Ruaka support
                </div>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-100 rounded-xl">
              <div className="grid grid-cols-3 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <div className="py-3 text-center">Price</div>
                <div className="py-3 text-center">Bundle Volume</div>
                <div className="py-3 text-center">Validity</div>
              </div>
              {fourGBundles.map((bundle, index) => (
                <div
                  key={bundle.price}
                  className={`grid grid-cols-3 text-sm text-gray-700 ${
                    index !== fourGBundles.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="py-3 text-center font-semibold text-emerald-700">
                    {bundle.price}
                  </div>
                  <div className="py-3 text-center">{bundle.volume}</div>
                  <div className="py-3 text-center">{bundle.validity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold font-montserrat text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 font-open-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              <Truck className="w-4 h-4" />
              Simple onboarding
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold font-montserrat text-gray-900">
              How to Get Connected
            </h2>
            <p className="mt-2 text-gray-600 font-open-sans">
              We handle the full process end-to-end so you can focus on enjoying
              fast, reliable internet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onboardingSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold font-montserrat text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 font-open-sans">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 text-white pt-12 pb-28 md:pt-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-montserrat mb-4">
            Ready to get connected?
          </h2>
          <p className="text-white/90 font-open-sans mb-6">
            Visit Safaricom Shop Ruaka at Sandton Plaza or contact our team now.
            We will confirm coverage, schedule delivery, and activate your
            router the same day.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <a
              href={`tel:${contactNumber}`}
              className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call {contactNumber}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700/70 text-white font-semibold px-5 py-3 rounded-lg border border-white/40 hover:bg-emerald-700/90 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
