import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="Lipamdogomdogo"
                width={32}
                height={32}
                className="mr-2"
                style={{ width: "auto", height: "auto" }}
              />
              <h3 className="text-2xl font-bold text-blue-400">
                Lipamdogomdogo
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Own the latest phone today, pay little by little. We make premium
              smartphones accessible through flexible installment plans.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links - Brands */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Brands</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/brand/oppo"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Oppo
                </Link>
              </li>
              <li>
                <Link
                  href="/products/brand/samsung"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Samsung
                </Link>
              </li>
              <li>
                <Link
                  href="/products/brand/vivo"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Vivo
                </Link>
              </li>
              <li>
                <Link
                  href="/products/brand/tecno"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tecno
                </Link>
              </li>
              <li>
                <Link
                  href="/products/brand/redmi"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Redmi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin size={16} className="text-blue-400 mr-2" />
                <span className="text-gray-300 text-sm">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-blue-400 mr-2" />
                <span className="text-gray-300 text-sm">+254711271206</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="text-blue-400 mr-2" />
                <span className="text-gray-300 text-sm">
                  info@lipamdogomdogo.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Lipamdogomdogo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
