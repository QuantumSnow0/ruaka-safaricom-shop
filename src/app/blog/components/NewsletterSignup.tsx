"use client";

import React from "react";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSignup({
  title = "Stay Updated with the Latest Deals",
  description = "Get weekly updates on the best Safaricom deals, tech tips, and exclusive offers",
  className = "",
}: NewsletterSignupProps) {
  return (
    <div
      className={`bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center ${className}`}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-lg mb-6 opacity-90">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}

