"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@lipam/contexts/WishlistContext";
import { useCart } from "@lipam/contexts/CartContext";
import { useAuth } from "@lipam/contexts/AuthContext";
import { Product } from "@lipam/lib/types";
import { formatPrice } from "@lipam/lib/utils";
import { getPriceDisplayWithOriginal } from "@lipam/lib/priceUtils";
import Button from "@lipam/components/ui/Button";

export default function WishlistPage() {
  const {
    items: wishlistItems,
    itemCount,
    removeItem,
    clearWishlist,
    loading,
  } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeItem(productId);
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
  };

  // Show loading state while checking authentication or loading wishlist
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                >
                  <div className="relative h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view and manage your wishlist
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {itemCount > 0 && (
            <Button
              onClick={handleClearWishlist}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        {itemCount === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                      <Image
                        src={
                          product.image_urls?.[0] || "/placeholder-phone.jpg"
                        }
                        alt={product.name}
                        fill
                        className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />

                      {/* Discount Badge */}
                      {product.discount_percentage &&
                        product.discount_percentage > 0 && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{product.discount_percentage}%
                            </div>
                          </div>
                        )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">
                        {product.brand}
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h3>

                      {/* Price Display */}
                      <div className="mb-3">
                        {(() => {
                          const priceDisplay =
                            getPriceDisplayWithOriginal(product);
                          return (
                            <div>
                              {priceDisplay.hasDiscount &&
                                priceDisplay.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through mb-1">
                                    {priceDisplay.originalPrice}
                                  </div>
                                )}
                              <div className="text-lg font-bold text-orange-600">
                                {priceDisplay.currentPrice}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        variant="outline"
                        className="px-3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Heart className="w-4 h-4" fill="currentColor" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
