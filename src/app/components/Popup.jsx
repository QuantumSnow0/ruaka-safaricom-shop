"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const popupClosed = localStorage.getItem("internetOffersPopupClosed");
    const lastShown = localStorage.getItem("internetOffersPopupLastShown");
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (!popupClosed || (lastShown && now - parseInt(lastShown) > oneDayInMs)) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("internetOffersPopupLastShown", now.toString());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("internetOffersPopupClosed", "true");
  };

  const handleRemindLater = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleRemindLater}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Content Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Image (Desktop only) */}
                <div className="hidden lg:block lg:w-2/5 relative bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <Image
                      src="/popup.png"
                      alt="Internet Services"
                      width={400}
                      height={500}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12">
                  {/* Heading */}
                  <div className="mb-4 sm:mb-6">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      Special Offer
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      Get Up to 25% Off Internet Plans
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg">
                      Enjoy lightning-fast speeds with our 5G and Fiber packages
                    </p>
                  </div>

                  {/* Plans */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {/* 5G Plan */}
                    <div className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-green-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                            5G Internet
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            Up to 250 Mbps • Unlimited Data • Free Setup
                          </p>
                          <div className="flex items-baseline">
                            <span className="text-xl sm:text-2xl font-bold text-green-600">
                              KES 2,999
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-1">
                              /month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fiber Plan */}
                    <div className="border-2 border-green-500 rounded-xl p-3 sm:p-4 bg-green-50/50 relative">
                      <span className="absolute -top-2 left-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        BEST VALUE
                      </span>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                            Secure Fiber
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            Up to 1000 Mbps • Free Router • Free Installation
                          </p>
                          <div className="flex items-baseline">
                            <span className="text-xs sm:text-sm text-gray-500 line-through mr-2">
                              KES 2,999
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-green-600">
                              KES 2,250
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-1">
                              /month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promo Banner */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-orange-600">
                        Limited Time:
                      </span>{" "}
                      Save 25% on all Fiber plans. Offer valid for 30 days only!
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link
                      href="/internet-services"
                      onClick={handleClose}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      View All Plans
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="tel:0700776994"
                      onClick={handleClose}
                      className="flex-1 border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 hover:text-green-700 font-semibold py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </div>

                  {/* Dismiss Link */}
                  <button
                    onClick={handleRemindLater}
                    className="w-full text-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 mt-3 sm:mt-4 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
