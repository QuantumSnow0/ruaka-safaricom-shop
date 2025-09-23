import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";

function WhatsAppOrder({ product = null, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // WhatsApp phone number (replace with your actual number)
  const whatsappNumber = "254711271206"; // Format: country code + number without + or 0
  const businessName = "Lipam Dogo Mdogo";

  const handleWhatsAppClick = () => {
    let message = "";

    if (product) {
      // Product-specific message
      message = `Hi! I'm interested in this product:

📱 *${product.name}*
💰 Price: KES ${product.price?.toLocaleString()}
🏷️ Brand: ${product.brand}
💾 Storage: ${product.storage || "N/A"}
🧠 RAM: ${product.ram || "N/A"}

I'd like to know more about availability and pricing options. Thank you!`;
    } else {
      // General inquiry message
      message = `Hi! I'm interested in your products and would like to know more about:

• Available smartphones
• Pricing and payment options
• Delivery information
• Warranty details

Please share your current catalog. Thank you!`;
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Main WhatsApp Button */}
      <div className="relative">
        {/* Expanded Content */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 sm:bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Order on WhatsApp
                  </h3>
                  <p className="text-xs text-gray-600">Get instant support</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <p>• Instant product inquiries</p>
              <p>• Custom pricing options</p>
              <p>• Fast delivery arrangements</p>
              <p>• Expert recommendations</p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Image
                src="/whatsapp.png"
                alt="WhatsApp"
                width={16}
                height={16}
              />
              Start WhatsApp Chat
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-green-200 sm:bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/whatsapp.png"
              alt="WhatsApp"
              width={24}
              height={24}
              className="transition-transform group-hover:scale-110"
            />
            {!isExpanded && (
              <span className="hidden sm:block text-sm font-medium whitespace-nowrap">
                Order on WhatsApp
              </span>
            )}
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        </button>
      </div>
    </div>
  );
}

export default WhatsAppOrder;
