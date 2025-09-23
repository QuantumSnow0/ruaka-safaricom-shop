"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import Button from "@lipam/components/ui/Button";
import VariantSelector from "@lipam/components/VariantSelector";
import QuantitySelector from "@lipam/components/ui/QuantitySelector";
import DescriptionFormatter from "@lipam/components/ui/DescriptionFormatter";
import ImageGallery from "@lipam/components/ui/ImageGallery";
import { useCart } from "@lipam/contexts/CartContext";
import { Product } from "@lipam/lib/types";
import { formatPrice, calculateInstallment } from "@lipam/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  requiresVariantSelection,
  getBestPriceDisplay,
  getPriceDisplayWithOriginal,
} from "@lipam/lib/priceUtils";

// Sample product data - in production, this would come from Supabase
const sampleProduct: Product = {
  id: "1",
  name: "iPhone 15 Pro Max",
  description:
    "The iPhone 15 Pro Max features a titanium design, the A17 Pro chip, and an advanced camera system. Experience the ultimate in smartphone technology with our most powerful iPhone yet.",
  price: 159999,
  brand: "Apple",
  model: "iPhone 15 Pro Max",
  storage: "256GB",
  ram: "8GB",
  color: "Natural Titanium",
  image_urls: [
    "/placeholder-phone.jpg",
    "/placeholder-phone-2.jpg",
    "/placeholder-phone-3.jpg",
  ],
  features: [
    "A17 Pro Chip",
    "Titanium Design",
    "48MP Camera",
    "USB-C",
    "Action Button",
    "ProRAW",
    "ProRes Video",
  ],
  specifications: {
    Display: '6.7" Super Retina XDR',
    Camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
    Battery: "Up to 29 hours video playback",
    Storage: "256GB",
    Processor: "A17 Pro chip",
    "Operating System": "iOS 17",
    "Water Resistance": "IP68",
    Weight: "221g",
    Dimensions: "159.9 x 76.7 x 8.25 mm",
  },
  in_stock: true,
  stock_quantity: 10,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, updateQuantity, removeItem, items } = useCart();

  // Get current cart quantity for this product
  const getCartQuantity = () => {
    if (!product) return 0;
    const cartItem = items.find((item) => item.product_id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingMoreRelated, setLoadingMoreRelated] = useState(false);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);
  const [relatedPage, setRelatedPage] = useState(1);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(false);
  const supabase = createClientComponentClient();

  // Function to fetch new arrivals
  const fetchNewArrivals = async () => {
    try {
      setLoadingNewArrivals(true);

      // Fetch the 6 most recent products
      let { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching new arrivals:", error);
        setNewArrivals([]);
        return;
      }

      setNewArrivals(products || []);
    } catch (err) {
      console.error("Error fetching new arrivals:", err);
      setNewArrivals([]);
    } finally {
      setLoadingNewArrivals(false);
    }
  };

  // Function to fetch related products based on specifications matching
  const fetchRelatedProducts = async (
    currentProduct: Product,
    page: number = 1,
    isLoadMore: boolean = false
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMoreRelated(true);
      } else {
        setLoadingRelated(true);
        setRelatedPage(1);
        setHasMoreRelated(true);
      }

      // Get all products except the current one with pagination
      const itemsPerPage = 4;
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Try without is_active filter first since it's causing 400 errors
      let { data: allProducts, error } = await supabase
        .from("products")
        .select("*")
        .neq("id", currentProduct.id)
        .range(from, to);

      // If that fails, try with is_active filter as fallback
      if (error) {
        console.log(
          "Trying to fetch related products with is_active filter..."
        );
        const fallbackResult = await supabase
          .from("products")
          .select("*")
          .neq("id", currentProduct.id)
          .eq("is_active", true)
          .range(from, to);

        allProducts = fallbackResult.data;
        error = fallbackResult.error;
      }

      if (error) {
        console.error("Error fetching related products:", error);
        if (!isLoadMore) {
          setRelatedProducts([]);
        }
        return;
      }

      if (!allProducts || allProducts.length === 0) {
        if (isLoadMore) {
          setHasMoreRelated(false);
        } else {
          setRelatedProducts([]);
        }
        return;
      }

      // Check if we have more products to load
      if (allProducts.length < itemsPerPage) {
        setHasMoreRelated(false);
      }

      console.log("Found products for related search:", allProducts.length);
      console.log("Current product for matching:", {
        id: currentProduct.id,
        brand: currentProduct.brand,
        storage: currentProduct.storage,
        ram: currentProduct.ram,
        color: currentProduct.color,
        model: currentProduct.model,
        price: currentProduct.price,
      });

      // Create a scoring system for related products
      const scoredProducts = allProducts.map((product) => {
        try {
          let score = 0;
          const matches: string[] = [];

          // Check brand match (highest priority)
          if (
            product.brand &&
            currentProduct.brand &&
            product.brand === currentProduct.brand
          ) {
            score += 3;
            matches.push("brand");
          }

          // Check storage match
          if (
            product.storage &&
            currentProduct.storage &&
            product.storage === currentProduct.storage
          ) {
            score += 2;
            matches.push("storage");
          }

          // Check RAM match
          if (
            product.ram &&
            currentProduct.ram &&
            product.ram === currentProduct.ram
          ) {
            score += 2;
            matches.push("ram");
          }

          // Check color match
          if (
            product.color &&
            currentProduct.color &&
            product.color === currentProduct.color
          ) {
            score += 1;
            matches.push("color");
          }

          // Check model similarity (if it contains similar keywords)
          if (product.model && currentProduct.model) {
            const currentModelWords = currentProduct.model
              .toLowerCase()
              .split(/\s+/);
            const productModelWords = product.model.toLowerCase().split(/\s+/);
            const commonWords = currentModelWords.filter((word) =>
              productModelWords.some(
                (pWord: string) => pWord.includes(word) || word.includes(pWord)
              )
            );
            if (commonWords.length > 0) {
              score += 1;
              matches.push("model");
            }
          }

          // Check price range similarity (within 20% range)
          if (product.price && currentProduct.price) {
            const priceDiff = Math.abs(product.price - currentProduct.price);
            const priceThreshold = currentProduct.price * 0.2;
            if (priceDiff <= priceThreshold) {
              score += 1;
              matches.push("price");
            }
          }

          return {
            ...product,
            score,
            matches,
            matchCount: matches.length,
          };
        } catch (err) {
          console.error("Error scoring product:", product.id, err);
          return {
            ...product,
            score: 0,
            matches: [],
            matchCount: 0,
          };
        }
      });

      // Sort by score (highest first), then by match count
      const sortedProducts = scoredProducts.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return b.matchCount - a.matchCount;
      });

      // Filter products with at least 1 match
      const filteredProducts = sortedProducts.filter(
        (product) => product.matchCount >= 1
      );

      console.log(
        "Related products found:",
        filteredProducts.map((p) => ({
          name: p.name,
          score: p.score,
          matches: p.matches,
          matchCount: p.matchCount,
        }))
      );

      if (isLoadMore) {
        setRelatedProducts((prev) => [...prev, ...filteredProducts]);
        setRelatedPage(page);
      } else {
        setRelatedProducts(filteredProducts);
        setRelatedPage(1);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
      if (!isLoadMore) {
        setRelatedProducts([]);
      }
    } finally {
      if (isLoadMore) {
        setLoadingMoreRelated(false);
      } else {
        setLoadingRelated(false);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", params.id);

        // Try without is_active filter first since it's causing 400 errors
        let { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();

        // If that fails, try with is_active filter as fallback
        if (error) {
          console.log("Trying with is_active filter...");
          const fallbackResult = await supabase
            .from("products")
            .select("*")
            .eq("id", params.id)
            .eq("is_active", true)
            .single();

          data = fallbackResult.data;
          error = fallbackResult.error;
        }

        if (error) {
          console.error("Error fetching product:", error);
          console.error("Error message:", error.message);
          console.error("Error code:", error.code);
          console.error("Error details:", error.details);
          console.error("Error hint:", error.hint);
          setError("Product not found");
          return;
        }

        if (data) {
          console.log("Product data:", data);
          console.log("Features type:", typeof data.features);
          console.log("Features value:", data.features);
          console.log(
            "Installment plans in fetched data:",
            data.installment_plans
          );
          console.log("Installment plans type:", typeof data.installment_plans);
          setProduct(data);
          // Set default values from the product data
          if (data.color) {
            setSelectedColor(data.color);
          }
          // Fetch related products and new arrivals after main product is loaded
          fetchRelatedProducts(data);
          fetchNewArrivals();
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, supabase]);

  // Function to load more related products
  const loadMoreRelatedProducts = () => {
    if (product && hasMoreRelated && !loadingMoreRelated) {
      fetchRelatedProducts(product, relatedPage + 1, true);
    }
  };

  // Infinite scroll for related products
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear previous timeout
      clearTimeout(timeoutId);

      // Throttle scroll events
      timeoutId = setTimeout(() => {
        // Trigger when user is 200px from bottom (more responsive)
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
        ) {
          loadMoreRelatedProducts();
        }
      }, 100); // 100ms throttle
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [product, hasMoreRelated, loadingMoreRelated, relatedPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images Skeleton */}
            <div className="lg:col-span-1 space-y-3">
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-200 rounded-lg animate-pulse"></div>

              {/* Thumbnail Images Skeleton */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`thumb-skeleton-${index}`}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              {/* Title and Brand */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>

              {/* Price Skeleton */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>

              {/* Features Skeleton */}
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`feature-skeleton-${index}`}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Variant Selector Skeleton */}
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`variant-skeleton-${index}`}
                      className="h-10 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Product Status Skeleton */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-40 animate-pulse"></div>
              </div>

              {/* Shipping Info Skeleton */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`shipping-skeleton-${index}`}
                    className="text-center"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrivals Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`new-arrival-skeleton-${index}`}
                      className="flex items-center space-x-3 p-3 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-16">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`related-skeleton-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // In production, add to wishlist in database
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;

    const phoneNumber = "254711271206";
    const quantity = getCartQuantity() > 0 ? getCartQuantity() : 1;
    const price = getBestPriceDisplay(product);
    const totalPrice = product.price * quantity;
    const message = `Hi! I'm interested in ordering this product:

📱 *${product.name}*
💰 Price: ${price} each
📦 Quantity: ${quantity}
💵 Total: ${formatPrice(totalPrice)}
${product.brand ? `🏷️ Brand: ${product.brand}` : ""}
${product.model ? `📋 Model: ${product.model}` : ""}
${product.storage ? `💾 Storage: ${product.storage}` : ""}
${product.ram ? `🧠 RAM: ${product.ram}` : ""}
${selectedColor ? `🎨 Color: ${selectedColor}` : ""}

Please let me know about availability and delivery options.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images - Enhanced with swipe and arrow navigation */}
          <div className="lg:col-span-1">
            <ImageGallery
              images={product.image_urls || ["/placeholder-phone.jpg"]}
              productName={product.name}
              discountPercentage={product.discount_percentage}
            />
          </div>

          {/* Product Info - Main content */}
          <div className="lg:col-span-1 space-y-6">
            {/* Brand and Name */}
            <div>
              <p className="text-orange-600 font-medium text-sm uppercase tracking-wide">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            {/* Specifications Table - Only show if there are actual specifications */}
            {(() => {
              // Check if there are any real specifications to display
              const hasSpecs =
                product.display ||
                product.processor ||
                product.camera ||
                product.storage ||
                product.ram ||
                product.battery ||
                product.software ||
                (product.specifications &&
                  Object.keys(product.specifications).length > 0) ||
                (product.installment_plans &&
                  product.installment_plans.length > 0);

              if (!hasSpecs) return null;

              return (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Specifications
                  </h3>
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {/* Build specifications from available product data */}
                        {product.display && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Display
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.display}
                            </td>
                          </tr>
                        )}
                        {product.processor && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Processor
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.processor}
                            </td>
                          </tr>
                        )}
                        {product.camera && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Camera
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.camera}
                            </td>
                          </tr>
                        )}
                        {(product.storage || product.ram) && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Memory
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.storage && product.ram
                                ? `${product.storage} Storage; ${product.ram} RAM`
                                : product.storage || product.ram}
                            </td>
                          </tr>
                        )}
                        {product.battery && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Battery
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.battery}
                            </td>
                          </tr>
                        )}
                        {product.software && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                              Software
                            </td>
                            <td className="py-3 text-gray-700">
                              {product.software}
                            </td>
                          </tr>
                        )}
                        {/* Add specifications from product.specifications if available */}
                        {product.specifications &&
                          Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <tr
                                key={key}
                                className="border-b border-gray-200"
                              >
                                <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                                  {key}
                                </td>
                                <td className="py-3 text-gray-700">
                                  {String(value)}
                                </td>
                              </tr>
                            )
                          )}
                        {/* Installment Plans */}
                        {product.installment_plans &&
                          product.installment_plans.length > 0 && (
                            <>
                              <tr className="border-b border-gray-200">
                                <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                                  Deposit
                                </td>
                                <td className="py-3 text-gray-700">
                                  {product.installment_plans.map(
                                    (plan, index) => (
                                      <span key={index}>
                                        {plan.storage} – Ksh {plan.deposit}
                                        {index <
                                        (product.installment_plans?.length ||
                                          0) -
                                          1
                                          ? "; "
                                          : ""}
                                      </span>
                                    )
                                  )}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-3 pr-4 font-medium text-gray-900 w-1/3">
                                  Installments
                                </td>
                                <td className="py-3 text-gray-700">
                                  {product.installment_plans.map(
                                    (plan, index) => (
                                      <span key={index}>
                                        {plan.storage} – Ksh{" "}
                                        {plan.daily_installment} Daily
                                        {index <
                                        (product.installment_plans?.length ||
                                          0) -
                                          1
                                          ? "; "
                                          : ""}
                                      </span>
                                    )
                                  )}
                                </td>
                              </tr>
                            </>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Price */}
            <div className="space-y-2">
              {(() => {
                const priceDisplay = getPriceDisplayWithOriginal(product);
                return (
                  <div>
                    {priceDisplay.hasDiscount && priceDisplay.originalPrice && (
                      <div className="text-xl text-gray-500 line-through mb-2">
                        {priceDisplay.originalPrice}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-gray-900">
                      {priceDisplay.currentPrice}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Variant Selector */}
            <VariantSelector
              product={product}
              onVariantSelect={(storage, ram, network, price) => {
                console.log("Variant selected:", {
                  storage,
                  ram,
                  network,
                  price,
                });
              }}
              onWhatsAppOrder={(storage, ram, network, price) => {
                const quantity = getCartQuantity() > 0 ? getCartQuantity() : 1;
                const totalPrice = price * quantity;
                const message = `Hi! I'm interested in ordering this product:

📱 *${product.name}* (${storage}/${ram}/${network})
💰 Price: ${formatPrice(price)} each
📦 Quantity: ${quantity}
💵 Total: ${formatPrice(totalPrice)}
${product.brand ? `🏷️ Brand: ${product.brand}` : ""}
${product.model ? `📋 Model: ${product.model}` : ""}

Please let me know about availability and delivery options.`;
                const whatsappUrl = `https://wa.me/254711271206?text=${encodeURIComponent(
                  message
                )}`;
                window.open(whatsappUrl, "_blank");
              }}
              onAddToCart={(storage, ram, network, price) => {
                addItem(product, 1);
                console.log("Added to cart:", { storage, ram, network, price });
              }}
              onProceedToCheckout={(storage, ram, network, price) => {
                addItem(product, 1);
                router.push("/checkout");
                console.log("Proceeding to checkout:", {
                  storage,
                  ram,
                  network,
                  price,
                });
              }}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeItem}
              cartQuantity={getCartQuantity()}
            />

            {/* Action Buttons - Only show if no variant selector */}
            {!requiresVariantSelection(product) && (
              <div className="space-y-4">
                {/* Cart Actions */}
                {getCartQuantity() > 0 ? (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-orange-800">
                          Added to Cart
                        </span>
                      </div>
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {getCartQuantity()} item
                        {getCartQuantity() !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <QuantitySelector
                        quantity={getCartQuantity()}
                        onIncrement={() =>
                          updateQuantity(product.id, getCartQuantity() + 1)
                        }
                        onDecrement={() =>
                          updateQuantity(product.id, getCartQuantity() - 1)
                        }
                        onRemove={() => removeItem(product.id)}
                        className="justify-center"
                      />

                      <Button
                        onClick={() => (window.location.href = "/cart")}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 text-sm"
                        size="sm"
                      >
                        View Cart
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Proceed to Checkout Button - First Option */}
                    <Button
                      onClick={() => {
                        // Add item to cart and redirect to checkout
                        addItem(product, 1);
                        // Use router.push for better navigation
                        router.push("/checkout");
                      }}
                      disabled={!product.in_stock}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      size="lg"
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Proceed to Checkout
                    </Button>

                    {/* Add to Cart Button - Second Option */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.in_stock}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                  </>
                )}

                {/* Other Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    size="lg"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Order via WhatsApp
                  </Button>
                  <Button
                    onClick={handleAddToWishlist}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-colors"
                    size="lg"
                  >
                    <Heart size={20} className="mr-2" />
                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors"
                  size="lg"
                >
                  <Share2 size={20} className="mr-2" />
                  Share
                </Button>
              </div>
            )}

            {/* Product Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-800 font-medium">In Stock</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {product.stock_quantity} people watching this product now!
              </p>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="text-orange-600 mx-auto mb-2" size={24} />
                <div className="text-sm font-medium text-gray-900">
                  Free Delivery
                </div>
                <div className="text-xs text-gray-600">Countrywide</div>
              </div>
              <div className="text-center">
                <Shield className="text-green-600 mx-auto mb-2" size={24} />
                <div className="text-sm font-medium text-gray-900">
                  Payment on Delivery
                </div>
                <div className="text-xs text-gray-600">100% Safe</div>
              </div>
              <div className="text-center">
                <RotateCcw className="text-blue-600 mx-auto mb-2" size={24} />
                <div className="text-sm font-medium text-gray-900">
                  Dedicated Support
                </div>
                <div className="text-xs text-gray-600">+254711271206</div>
              </div>
            </div>
          </div>

          {/* New Arrivals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                New Arrivals
              </h3>

              {loadingNewArrivals ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading...</span>
                </div>
              ) : newArrivals.length > 0 ? (
                <div className="space-y-4">
                  {newArrivals.map((newProduct) => (
                    <Link
                      key={newProduct.id}
                      href={`/products/${newProduct.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* Discount Badge */}
                        {newProduct.discount_percentage &&
                          newProduct.discount_percentage > 0 && (
                            <div className="absolute top-1 left-1 z-10">
                              <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                                -{newProduct.discount_percentage}%
                              </div>
                            </div>
                          )}

                        <Image
                          src={
                            newProduct.image_urls?.[0] ||
                            newProduct.image_url ||
                            "/placeholder-phone.jpg"
                          }
                          alt={newProduct.name}
                          fill
                          sizes="(max-width: 768px) 20vw, (max-width: 1200px) 10vw, 6.67vw"
                          className="object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {newProduct.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-bold text-orange-600">
                            {formatPrice(newProduct.price)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {newProduct.brand}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {newProduct.storage} • {newProduct.ram}
                        </div>
                      </div>
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/products"
                      className="block w-full text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-2 px-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No new arrivals found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {product.name.split("(")[0]} Specifications
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <DescriptionFormatter
                content={product.description}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            {loadingRelated ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading related products...
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct, index) => (
                    <Link
                      key={`${relatedProduct.id}-${index}`}
                      href={`/products/${relatedProduct.id}`}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow group"
                    >
                      <div className="aspect-square relative bg-gray-50 rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={
                            relatedProduct.image_urls?.[0] ||
                            relatedProduct.image_url ||
                            "/placeholder-phone.jpg"
                          }
                          alt={relatedProduct.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-orange-600 font-bold">
                          {formatPrice(relatedProduct.price)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {(relatedProduct as any).matches?.length || 0}{" "}
                            matches
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {relatedProduct.brand} • {relatedProduct.storage} •{" "}
                        {relatedProduct.ram}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Loading More Skeleton - Always show when loading more */}
                {loadingMoreRelated && (
                  <>
                    <div className="flex justify-center items-center py-4">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                        <span className="text-sm">
                          Loading more products...
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={`loading-skeleton-${index}`}
                          className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                        >
                          <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* End of Results Message */}
                {!hasMoreRelated && relatedProducts.length > 0 && (
                  <div className="text-center mt-8 py-4">
                    <p className="text-gray-500 text-sm">
                      You've reached the end of related products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
``;
