"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Smartphone,
  Shield,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import Button from "@lipam/components/ui/Button";
import ProductCard from "@lipam/components/ui/ProductCard";
import { useCart } from "@lipam/contexts/CartContext";

// Sample featured products data
const featuredProducts = [
  {
    id: "1",
    name: "Tecno Pop 9 Black",
    description: "Affordable smartphone with great features",
    price: 2200,
    priceRange: "KES 2,200 - 2,500",
    brand: "Tecno",
    model: "Pop 9",
    storage: "64GB",
    ram: "4GB",
    color: "Black",
    image_urls: ["/Tecno-Pop-9-Black-1.jpg"],
    features: ['6.6" Display', "Dual Camera", "5000mAh Battery", "Android 13"],
    specifications: {
      Display: '6.6" HD+',
      Camera: "13MP + 2MP Dual Camera",
      Battery: "5000mAh",
      Storage: "64GB",
    },
    in_stock: true,
    stock_quantity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Oppo A3x Ocean Blue",
    description: "Mid-range smartphone with premium features",
    price: 25000,
    priceRange: "KES 2,900 - 3,600",
    brand: "Oppo",
    model: "Galaxy A15",
    storage: "128GB",
    ram: "6GB",
    color: "Blue",
    image_urls: ["/Oppo-A3x-Ocean-Blue.jpg"],
    features: ['6.5" AMOLED', "50MP Camera", "5000mAh Battery", "5G Ready"],
    specifications: {
      Display: '6.5" AMOLED',
      Camera: "50MP Main + 5MP Ultra Wide",
      Battery: "5000mAh",
      Storage: "128GB",
    },
    in_stock: true,
    stock_quantity: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Oppo A5 Mist White",
    description: "Premium iPhone with A15 Bionic chip",
    price: 85000,
    priceRange: "KES 4,800 - 5,600",
    brand: "Oppo",
    model: "iPhone 13",
    storage: "128GB",
    ram: "4GB",
    color: "Midnight",
    image_urls: ["/Oppo-A5-Mist-White.jpg"],
    features: [
      "A15 Bionic Chip",
      "12MP Dual Camera",
      "Face ID",
      "Wireless Charging",
    ],
    specifications: {
      Display: '6.1" Super Retina XDR',
      Camera: "12MP Main + 12MP Ultra Wide",
      Battery: "Up to 19 hours video playback",
      Storage: "128GB",
    },
    in_stock: true,
    stock_quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Mwangi",
    location: "Nairobi",
    rating: 5,
    text: "Got my iPhone 14 Pro through Lipamdogomdogo. The weekly payments made it so affordable!",
    image: "/placeholder-avatar.jpg",
  },
  {
    id: 2,
    name: "John Kimani",
    location: "Mombasa",
    rating: 5,
    text: "Excellent service and genuine products. The installment plan helped me get my dream phone.",
    image: "/placeholder-avatar.jpg",
  },
  {
    id: 3,
    name: "Grace Wanjiku",
    location: "Kisumu",
    rating: 5,
    text: "Fast delivery and great customer support. Highly recommended for anyone looking for quality phones.",
    image: "/placeholder-avatar.jpg",
  },
];

export default function HomePage() {
  const { addItem } = useCart();

  // Calculator state
  const [phonePrice, setPhonePrice] = useState("");
  const [paymentPeriod, setPaymentPeriod] = useState("monthly");
  const [duration, setDuration] = useState(12);

  // Calculate installment
  const calculateInstallment = () => {
    const price = Number(phonePrice) || 0;
    if (price === 0) return 0;

    const interestRate = 0.15; // 15% annual interest rate
    const totalAmount = price * (1 + interestRate);

    if (paymentPeriod === "daily") {
      const days = duration * 30; // Approximate days per month
      return Math.round(totalAmount / days);
    } else if (paymentPeriod === "weekly") {
      const weeks = duration * 4.33; // Approximate weeks per month
      return Math.round(totalAmount / weeks);
    } else {
      return Math.round(totalAmount / duration);
    }
  };

  const installmentAmount = calculateInstallment();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-phone.jpg"
            alt="Premium smartphones"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Own the latest phone today, lipa{" "}
              <span className="text-orange-500">mdogo mdogo</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100">
              Premium smartphones with flexible installment payments. No credit
              checks, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
                >
                  Shop Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black font-bold"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 bg-black scroll-container"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg"
              style={{ color: "#ffffff" }}
            >
              Why Choose Lipamdogomdogo?
            </h2>
            <p
              className="text-xl text-orange-400 max-w-3xl mx-auto drop-shadow-md"
              style={{ color: "#fb923c" }}
            >
              We make premium smartphones accessible to everyone through
              flexible payment plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center p-6 rounded-xl shadow-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 animate-slide-in-left"
              style={{ backgroundColor: "#1e293b" }}
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-orange-500" size={32} />
              </div>
              <h3
                className="text-xl font-semibold mb-2 drop-shadow-md"
                style={{ color: "#ffffff" }}
              >
                Latest Models
              </h3>
              <p style={{ color: "#e2e8f0" }}>
                Get the newest smartphones from top brands like Apple, Samsung,
                and Huawei
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl shadow-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 animate-fade-in-up"
              style={{ backgroundColor: "#1e293b" }}
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-orange-500" size={32} />
              </div>
              <h3
                className="text-xl font-semibold mb-2 drop-shadow-md"
                style={{ color: "#ffffff" }}
              >
                Flexible Payments
              </h3>
              <p style={{ color: "#e2e8f0" }}>
                Choose daily, weekly or monthly installments that fit your
                budget
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl shadow-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 animate-slide-in-right"
              style={{ backgroundColor: "#1e293b" }}
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-orange-500" size={32} />
              </div>
              <h3
                className="text-xl font-semibold mb-2 drop-shadow-md"
                style={{ color: "#ffffff" }}
              >
                Genuine Products
              </h3>
              <p style={{ color: "#e2e8f0" }}>
                100% authentic phones with full warranty and after-sales support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="py-20 bg-black-900 scroll-container"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ color: "#ffffff" }}
            >
              Featured Products
            </h2>
            <p className="text-xl text-orange-500" style={{ color: "#fb923c" }}>
              Discover our most popular smartphones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
                style={{ backgroundColor: "#f97316", color: "#000000" }}
              >
                View All Products
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Installment Calculator Section */}
      <section className="py-20 bg-gray-800 text-white scroll-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Calculate Your Installments
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                See how affordable your dream phone can be with our flexible
                payment plans
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="text-orange-500 mr-3" size={20} />
                  <span>Weekly payments as low as KES 2,000</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-orange-500 mr-3" size={20} />
                  <span>Monthly payments starting from KES 8,000</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-orange-500 mr-3" size={20} />
                  <span>No credit checks required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-orange-500 mr-3" size={20} />
                  <span>Quick approval process</span>
                </div>
              </div>
            </div>
            <div className="bg-black-900 rounded-xl p-8 text-white border border-orange-500/20 animate-slide-in-right">
              <h3 className="text-2xl font-bold mb-6">
                Installment Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Price (KES)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter phone price"
                    value={phonePrice}
                    onChange={(e) => setPhonePrice(e.target.value)}
                    className="w-full px-4 py-3 bg-black-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Period
                  </label>
                  <div className="relative">
                    <select
                      value={paymentPeriod}
                      onChange={(e) => setPaymentPeriod(e.target.value)}
                      className="w-full px-4 py-3 bg-black-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none cursor-pointer hover:border-orange-500/50 transition-colors duration-200"
                      style={{ backgroundColor: "#1e293b", color: "white" }}
                    >
                      <option
                        value="daily"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        Daily
                      </option>
                      <option
                        value="weekly"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        Weekly
                      </option>
                      <option
                        value="monthly"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        Monthly
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (months)
                  </label>
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-black-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none cursor-pointer hover:border-orange-500/50 transition-colors duration-200"
                      style={{ backgroundColor: "#1e293b", color: "white" }}
                    >
                      <option
                        value="6"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        6 months
                      </option>
                      <option
                        value="12"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        12 months
                      </option>
                      <option
                        value="18"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        18 months
                      </option>
                      <option
                        value="24"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        24 months
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/30">
                  <div className="text-center">
                    <p className="text-sm text-gray-300">
                      Your estimated payment
                    </p>
                    <p className="text-3xl font-bold text-orange-500">
                      {installmentAmount > 0
                        ? `KES ${installmentAmount.toLocaleString()}`
                        : "Enter price"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {installmentAmount > 0
                        ? `per ${
                            paymentPeriod === "daily"
                              ? "day"
                              : paymentPeriod === "weekly"
                              ? "week"
                              : "month"
                          }`
                        : "to calculate"}
                    </p>
                    {installmentAmount > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        Total: KES{" "}
                        {(Number(phonePrice) * 1.15).toLocaleString()} (15%
                        interest)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-20 bg-black-900"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ color: "#ffffff" }}
            >
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300" style={{ color: "#fb923c" }}>
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-xl p-6 shadow-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
                style={{ backgroundColor: "#1e293b" }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-orange-500 fill-current"
                      size={20}
                    />
                  ))}
                </div>
                <p className="mb-4 italic" style={{ color: "#e2e8f0" }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#ffffff" }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: "#94a3b8" }}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Your Dream Phone?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Browse our collection and start your installment journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-black-800 text-orange-500 font-bold"
              >
                Browse Products
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-black text-white hover:bg-black hover:text-orange-500 font-bold"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
