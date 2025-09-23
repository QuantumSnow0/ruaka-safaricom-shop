"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryById, CATEGORIES } from "@lipam/lib/categoryUtils";
import { ChevronRight, Grid3X3, Star } from "lucide-react";

interface CategoriesSidebarProps {
  className?: string;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  className = "",
}) => {
  const pathname = usePathname();

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 custom-scrollbar ${className}`}
    >
      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Grid3X3 className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Categories</h3>
        </div>

        <nav className="space-y-1">
          {CATEGORIES.map((category) => {
            const isActive = pathname === `/products/category/${category.id}`;

            return (
              <Link
                key={category.id}
                href={`/products/category/${category.id}`}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md hover:transform hover:scale-105"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Popular Brands Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Popular Brands</h4>
        </div>

        <div className="space-y-1">
          {[
            {
              name: "Apple",
              href: "/products/brand/apple",
              icon: "🍎",
              color: "from-gray-500 to-gray-700",
            },
            {
              name: "Samsung",
              href: "/products/brand/samsung",
              icon: "📱",
              color: "from-blue-500 to-blue-700",
            },
            {
              name: "Tecno",
              href: "/products/brand/tecno",
              icon: "📱",
              color: "from-purple-500 to-purple-700",
            },
            {
              name: "Oppo",
              href: "/products/brand/oppo",
              icon: "📱",
              color: "from-green-500 to-green-700",
            },
            {
              name: "Redmi",
              href: "/products/brand/redmi",
              icon: "📱",
              color: "from-red-500 to-red-700",
            },
            {
              name: "Vivo",
              href: "/products/brand/vivo",
              icon: "📱",
              color: "from-orange-500 to-orange-700",
            },
            {
              name: "Infinix",
              href: "/products/brand/infinix",
              icon: "📱",
              color: "from-pink-500 to-pink-700",
            },
          ].map((brand) => {
            const isActive = pathname === brand.href;

            return (
              <Link
                key={brand.name}
                href={brand.href}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${brand.color} flex items-center justify-center mr-3 text-white text-sm font-bold`}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <span className="font-medium">{brand.name}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">1000+</div>
            <div className="text-sm text-orange-700 font-medium">
              Products Available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
