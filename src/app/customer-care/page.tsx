"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Star,
  Users,
  Award,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  HelpCircle,
  Settings,
  CreditCard,
  Smartphone,
  Wifi,
  Battery,
} from "lucide-react";
import Link from "next/link";

export default function CustomerCarePage() {
  const [activeTab, setActiveTab] = useState("support");
  const [selectedService, setSelectedService] = useState("");

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    // Scroll to the support card after a short delay to allow for animation
    setTimeout(() => {
      const supportCard = document.getElementById("support-card");
      if (supportCard) {
        supportCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Function to open maps with directions to the shop
  const openMaps = () => {
    // Shop location coordinates
    const shopLatitude = -1.2066519; // Safaricom Shop Ruaka - Sandton Plaza
    const shopLongitude = 36.7847042;

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

  const supportOptions = [
    {
      id: "technical",
      title: "Technical Support",
      description: "Device setup, troubleshooting, and technical issues",
      icon: Settings,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "billing",
      title: "Billing & Payments",
      description: "Account inquiries, payment issues, and billing questions",
      icon: CreditCard,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "device",
      title: "Device Support",
      description: "Phone repairs, accessories, and device-related queries",
      icon: Smartphone,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "network",
      title: "Network & Data",
      description: "Internet connectivity, data plans, and network issues",
      icon: Wifi,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "lipa",
      title: "Lipa Mdogo Mdogo",
      description: "Payment plans, account management, and service queries",
      icon: Battery,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "general",
      title: "General Inquiries",
      description: "General questions, feedback, and other support needs",
      icon: HelpCircle,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  ];

  const contactMethods = [
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: Phone,
      contact: "0711271206",
      availability: "24/7 Available",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "WhatsApp Support",
      description: "Quick assistance via WhatsApp",
      icon: MessageCircle,
      contact: "0711271206",
      availability: "24/7 Available",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Email Support",
      description: "Detailed inquiries via email",
      icon: Mail,
      contact: "support@ruaka.safaricom.co.ke",
      availability: "Response within 2 hours",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Live Chat",
      description: "Instant chat support on our website",
      icon: MessageSquare,
      contact: "Available on website",
      availability: "9 AM - 7 PM",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const faqs = [
    {
      question: "How can I track my Lipa Mdogo Mdogo payments?",
      answer:
        "You can track your payments through the Safaricom app, by dialing *234#, or by visiting our shop for assistance.",
    },
    {
      question: "What should I do if my phone is not working?",
      answer:
        "Visit our technical support team at the shop. We offer free diagnostics and repair services for most issues.",
    },
    {
      question: "How do I activate my data bundle?",
      answer:
        "Dial *544# and follow the prompts, or visit our shop for assistance with data bundle activation.",
    },
    {
      question: "Can I change my Lipa Mdogo Mdogo payment plan?",
      answer:
        "Yes, you can modify your payment plan by visiting our shop or calling our support team.",
    },
    {
      question: "What are your shop opening hours?",
      answer:
        "We're open Monday-Friday 8AM-7PM, Saturday 9AM-6PM, and Sunday 10AM-5PM.",
    },
    {
      question: "Do you offer phone repair services?",
      answer:
        "Yes, we provide comprehensive phone repair services for all major brands at competitive prices.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/customer-care.jpg"
            alt="Customer Care"
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
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Customer Care
                <span className="block text-2xl md:text-3xl font-normal mt-2">
                  Excellence
                </span>
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Your satisfaction is our priority. Our dedicated support team is
                here to help you with all your Safaricom needs, 24/7.
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
              { id: "support", label: "Support Options", icon: HelpCircle },
              { id: "contact", label: "Contact Us", icon: Phone },
              { id: "faq", label: "FAQ", icon: MessageSquare },
              { id: "visit", label: "Visit Shop", icon: MapPin },
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
        {/* Support Options Tab */}
        {activeTab === "support" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select the type of support you need and we'll connect you with
                the right specialist.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative group cursor-pointer ${option.bgColor} border-2 ${option.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                    onClick={() => handleServiceSelect(option.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      Get Support
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedService && (
                <motion.div
                  id="support-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-xl border-2 border-green-200 p-6"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {
                        supportOptions.find((s) => s.id === selectedService)
                          ?.title
                      }{" "}
                      Support
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {
                        supportOptions.find((s) => s.id === selectedService)
                          ?.description
                      }
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="tel:0711271206"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/254711271206?text=Hello! I need help with ${supportOptions
                        .find((s) => s.id === selectedService)
                        ?.title.toLowerCase()}. ${
                        supportOptions.find((s) => s.id === selectedService)
                          ?.description
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contact Us Tab */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your preferred way to contact us. We're here to help!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`${method.bgColor} border-2 ${method.borderColor} rounded-2xl p-8 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{method.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {method.contact}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {method.availability}
                        </p>
                      </div>
                    </div>
                  </div>
                  {method.title === "Phone Support" ? (
                    <a
                      href="tel:0711271206"
                      className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${method.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                    >
                      <span>Call Now</span>
                      <Phone className="w-4 h-4" />
                    </a>
                  ) : method.title === "WhatsApp Support" ? (
                    <a
                      href="https://wa.me/254711271206"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${method.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                    >
                      <span>WhatsApp Now</span>
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  ) : method.title === "Email Support" ? (
                    <a
                      href="mailto:support@ruaka.safaricom.co.ke"
                      className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${method.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                    >
                      <span>Send Email</span>
                      <Mail className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${method.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                    >
                      <span>Contact Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Visit Our Shop */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Visit Our Physical Shop
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get hands-on assistance at our conveniently located shop in
                  Ruaka. Our experts are ready to help you with all your mobile
                  needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={openMaps}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Get Directions</span>
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-green-200 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about our services.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <button className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                Still have questions? We're here to help!
              </p>
              <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto">
                <MessageCircle className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Visit Shop Tab */}
        {activeTab === "visit" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visit Our Shop
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience our products in person and get expert assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Shop Information */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Location
                      </h3>
                      <p className="text-gray-700 mb-2">
                        Safaricom Shop Ruaka
                        <br />
                        Sandton Plaza
                        <br />
                        Ruaka, Kiambu County, Kenya
                      </p>
                      <p className="text-sm text-gray-500">
                        Opposite Cleanshelf supermarket, easily accessible by
                        public transport
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
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

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Contact
                      </h3>
                      <p className="text-gray-700 mb-1">Phone: 0711271206</p>
                      <p className="text-gray-700">
                        Email: shop@ruaka.safaricom.co.ke
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map and Services */}
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

                {/* Services Available */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Services Available
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Phone Sales",
                      "Repairs",
                      "Accessories",
                      "Data Plans",
                      "Lipa Mdogo Mdogo",
                      "Technical Support",
                    ].map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={openMaps}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Get Directions</span>
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="tel:0711271206"
                      className="px-4 py-3 bg-white border-2 border-green-200 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Us</span>
                    </a>
                    <a
                      href="https://wa.me/254711271206"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-white border-2 border-green-200 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Back to Home */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
