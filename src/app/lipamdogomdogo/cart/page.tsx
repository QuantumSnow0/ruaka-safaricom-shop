"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Button from "@lipam/components/ui/Button";
import ProductCard from "@lipam/components/ui/ProductCard";
import { useCart } from "@lipam/contexts/CartContext";
import { formatPrice } from "@lipam/lib/utils";
import { Product } from "@lipam/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CartPage() {
  const {
    items,
    total,
    itemCount,
    originalTotal,
    totalDiscount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const supabase = createClientComponentClient();

  // Fetch similar products based on brands in cart
  const fetchSimilarProducts = async () => {
    if (items.length === 0) return;

    try {
      setLoadingSimilar(true);

      // Get unique brands from cart items
      const cartBrands = [...new Set(items.map((item) => item.product.brand))];

      // Fetch products from the same brands, excluding items already in cart
      const cartProductIds = items.map((item) => item.product_id);

      let { data: products, error } = await supabase
        .from("products")
        .select("*")
        .in("brand", cartBrands)
        .not("id", "in", `(${cartProductIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching similar products:", error);
        // Fallback: fetch any 6 products if no similar ones found
        const { data: fallbackProducts } = await supabase
          .from("products")
          .select("*")
          .not("id", "in", `(${cartProductIds.join(",")})`)
          .order("created_at", { ascending: false })
          .limit(6);

        setSimilarProducts(fallbackProducts || []);
        return;
      }

      setSimilarProducts(products || []);
    } catch (err) {
      console.error("Error fetching similar products:", err);
      setSimilarProducts([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Fetch similar products when cart items change
  useEffect(() => {
    fetchSimilarProducts();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <ShoppingBag size={64} className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col space-y-3">
                      {/* Product Image and Info */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 relative overflow-hidden rounded-lg">
                            <Image
                              src={
                                item.product.image_urls?.[0] ||
                                "/placeholder-phone.jpg"
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {item.product.brand}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.product.storage} • {item.product.ram}
                          </p>

                          {/* Price with discount */}
                          <div className="mt-2">
                            {item.product.discount_percentage &&
                            item.product.discount_percentage > 0 ? (
                              <div className="flex items-center space-x-2">
                                <div className="text-sm font-bold text-orange-600">
                                  {formatPrice(item.price)} each
                                </div>
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(
                                    item.price /
                                      (1 -
                                        item.product.discount_percentage / 100)
                                  )}
                                </div>
                                <div className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                  -{item.product.discount_percentage}%
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm font-bold text-orange-600">
                                {formatPrice(item.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            className="p-1 rounded-full hover:bg-orange-100 transition-colors text-orange-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-medium text-sm text-orange-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="p-1 rounded-full hover:bg-orange-100 transition-colors text-orange-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Total Price and Remove Button */}
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-bold text-orange-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={clearCart}
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                Clear Cart
              </Button>
            </div>

            {/* Similar Products - Desktop only */}
            {similarProducts.length > 0 && (
              <div className="mt-8 hidden lg:block">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    You Might Also Like
                  </h2>
                  <Link
                    href="/products"
                    className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Shop More
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>

                {loadingSimilar ? (
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                      >
                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {similarProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        className="h-full"
                        onAddToCart={(product) => {
                          addItem(product, 1);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {totalDiscount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium text-sm">
                        Total Discount
                      </span>
                      <span className="text-green-600 font-bold text-lg">
                        -{formatPrice(totalDiscount)}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      You saved {formatPrice(totalDiscount)} on your order!
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="block">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    Secure Checkout
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    SSL Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products - Mobile and Tablet only */}
        {similarProducts.length > 0 && (
          <div className="mt-12 lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                You Might Also Like
              </h2>
              <Link
                href="/products"
                className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                Shop More
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {loadingSimilar ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                  >
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="h-full"
                    onAddToCart={(product) => {
                      addItem(product, 1);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
