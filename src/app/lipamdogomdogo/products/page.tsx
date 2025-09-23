"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Heart,
  ShoppingCart,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@lipam/components/ui/ProductCard";
import Button from "@lipam/components/ui/Button";
import { useCart } from "@lipam/contexts/CartContext";
import { Product } from "@lipam/lib/types";
import { formatPrice } from "@lipam/lib/utils";
import { getPriceDisplayWithOriginal } from "@lipam/lib/priceUtils";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CategoriesSidebar from "@lipam/components/ui/CategoriesSidebar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import OffersCategory from "@lipam/components/ui/OffersCategory";
import WhatsappOrder from "@lipam/components/ui/whatsappOrder";

// Popular brands data
const popularBrands = [
  {
    name: "Oppo",
    logo: "/brands/oppo.png",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Redmi",
    logo: "/brands/redmi.png",
    color: "from-red-500 to-red-600",
  },
  {
    name: "Samsung",
    logo: "/brands/samsung.png",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Tecno",
    logo: "/brands/tecno.jpg",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Vivo",
    logo: "/brands/vivo.png",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Infinix",
    logo: "/brands/infinix.png",
    color: "from-orange-500 to-orange-600",
  },
];

// Promotions data
const promotions = [
  {
    id: 1,
    title: "Flash Sale",
    subtitle: "Up to 30%",
    description: "Limited time offer on selected smartphones",
    image: "/placeholder-phone.jpg",
    discount: "30%",
    validUntil: "2024-12-31",
    bgColor: "from-red-500 to-pink-600",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Models",
    description: "Get the newest smartphones with flexible payments",
    image: "/placeholder-phone.jpg",
    discount: "Free Shipping",
    validUntil: "2024-12-31",
    bgColor: "from-blue-500 to-purple-600",
  },
  {
    id: 3,
    title: "Trade-In Bonus",
    subtitle: "Extra KES 5,000",
    description: "Trade your old phone and get extra credit",
    image: "/placeholder-phone.jpg",
    discount: "KES 5,000",
    validUntil: "2024-12-31",
    bgColor: "from-green-500 to-teal-600",
  },
];

const ProductsContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Individual section loading states
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [specialOffersLoaded, setSpecialOffersLoaded] = useState(false);
  const [curvedDisplayLoaded, setCurvedDisplayLoaded] = useState(false);
  const [vivoLoaded, setVivoLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // WhatsApp ordering function
  const handleWhatsAppOrder = (product: Product) => {
    const phoneNumber = "254711271206";
    const message = `Hi! I'm interested in ordering this product:

📱 *${product.name}*
💰 Price: ${product.pricerange || formatPrice(product.price)}
${product.brand ? `🏷️ Brand: ${product.brand}` : ""}
${product.model ? `📋 Model: ${product.model}` : ""}

Please let me know about availability and delivery options.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Read search parameter from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Scroll behavior for mobile search bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply scroll behavior on mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px - hide search bar
          setIsSearchBarVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show search bar
          setIsSearchBarVisible(true);
        }
      } else {
        // On desktop, always show search bar
        setIsSearchBarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Countdown timer effect - calculates time until end of current month
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      const timeDiff = endOfMonth.getTime() - now.getTime();

      if (timeDiff <= 0) {
        // If we're past the end of the month, calculate for next month
        const nextMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        const nextTimeDiff = nextMonth.getTime() - now.getTime();

        const days = Math.floor(nextTimeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (nextTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (nextTimeDiff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((nextTimeDiff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch products from Supabase with pagination and category filtering
  const fetchProducts = async (
    pageNum: number = 1,
    isLoadMore: boolean = false
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      }

      const itemsPerPage = 24; // Load more products initially
      const from = (pageNum - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Add minimum loading time to ensure skeleton shows
      const minLoadingTime = isLoadMore ? 800 : 1200; // Longer initial load time
      const startTime = Date.now();

      // Build query for all products
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Check if we have more products to load
      if (!data || data.length < itemsPerPage) {
        setHasMore(false);
      }

      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...(data || [])]);
        setPage(pageNum);
      } else {
        setProducts(data || []);
        setPage(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [supabase]);

  // Manage section loading states
  useEffect(() => {
    if (products.length > 0) {
      // Set all sections as loaded after products are fetched
      const timer = setTimeout(() => {
        setFeaturedLoaded(true);
        setSpecialOffersLoaded(true);
        setCurvedDisplayLoaded(true);
        setVivoLoaded(true);
      }, 1500); // Ensure minimum loading time

      return () => clearTimeout(timer);
    }
  }, [products.length]);

  // Auto-load more products after initial load
  useEffect(() => {
    if (products.length > 0 && hasMore && !loadingMore) {
      // Load more products after a short delay to ensure initial products are rendered
      const timer = setTimeout(() => {
        loadMoreProducts();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [products.length, hasMore, loadingMore]);

  // Load more products function
  const loadMoreProducts = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(page + 1, true);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear previous timeout
      clearTimeout(timeoutId);

      // Throttle scroll events
      timeoutId = setTimeout(() => {
        // Trigger when user is 300px from bottom (more responsive)
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300
        ) {
          loadMoreProducts();
        }
      }, 100); // 100ms throttle
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [hasMore, loadingMore, page]);

  // Filter products with deduplication (only search filtering on products page)
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    })
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  // Get featured products - only products marked as featured, with deduplication
  const featuredProducts = (searchQuery ? filteredProducts : products)
    .filter((product) => product.is_featured)
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  // Get curved display products - use filtered products if searching, with deduplication
  const curvedProducts = (searchQuery ? filteredProducts : products)
    .filter((product) => product.is_curved_display)
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  // ========================================
  // MONTHLY OFFERS CONFIGURATION
  // ========================================
  // To change the monthly offer for future months:
  // 1. Update the 'month' field (e.g., "October", "November")
  // 2. Update the 'brand' field (e.g., "Oppo", "Vivo", "Tecno")
  // 3. Update the 'offer' description text
  // 4. Update the 'brandPage' to match the brand (e.g., "/products/brand/oppo")
  // ========================================
  const monthlyOfferConfig = {
    month: "September",
    brand: "Samsung",
    offer:
      "Get a free 25W Fast Charger on all Samsung Lipa Pole Pole purchases this month",
    brandPage: "/products/brand/samsung",
  };

  // Get special offer products - show Samsung phones for September offers, with deduplication
  const specialOfferProducts = (searchQuery ? filteredProducts : products)
    .filter(
      (product) =>
        product.brand.toLowerCase() === monthlyOfferConfig.brand.toLowerCase()
    )
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  // Get Vivo products for Lipa Mdogo Mdogo section - use filtered products if searching, with deduplication
  const vivoProducts = (searchQuery ? filteredProducts : products)
    .filter((product) => product.brand.toLowerCase().trim() === "vivo")
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  // Check if any section is still loading
  const isAnySectionLoading =
    loading ||
    (!featuredLoaded &&
      !specialOffersLoaded &&
      !curvedDisplayLoaded &&
      !vivoLoaded);

  if (isAnySectionLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Search Bar Skeleton */}
        <div className="md:hidden sticky top-16 z-30 bg-white shadow-lg border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Popular Brands Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`brand-skeleton-${index}`}
                  className="bg-white shadow-md border-2 border-gray-200 h-16 sm:h-20 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Promotions Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`promo-skeleton-${index}`}
                  className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
                  <div className="h-32 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={`featured-skeleton-${index}`}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse"
                >
                  {/* Image skeleton */}
                  <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>

                  {/* Content skeleton */}
                  <div className="space-y-2">
                    {/* Brand skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-16"></div>

                    {/* Title skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                    {/* Price skeleton */}
                    <div className="h-5 bg-gray-200 rounded w-20"></div>

                    {/* Specs skeleton */}
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>

                    {/* Button skeleton */}
                    <div className="h-8 bg-gray-200 rounded mt-3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curved Display Skeleton */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={`curved-skeleton-${index}`}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse"
                  >
                    {/* Image skeleton */}
                    <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>

                    {/* Content skeleton */}
                    <div className="space-y-2">
                      {/* Brand skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-16"></div>

                      {/* Title skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                      {/* Price skeleton */}
                      <div className="h-5 bg-gray-200 rounded w-20"></div>

                      {/* Specs skeleton */}
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>

                      {/* Button skeleton */}
                      <div className="h-8 bg-gray-200 rounded mt-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vivo Lipa Mdogo Mdogo Skeleton */}
          <div className="mb-12">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={`vivo-skeleton-${index}`}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse"
                  >
                    {/* Image skeleton */}
                    <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>

                    {/* Content skeleton */}
                    <div className="space-y-2">
                      {/* Brand skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-16"></div>

                      {/* Title skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                      {/* Price skeleton */}
                      <div className="h-5 bg-gray-200 rounded w-20"></div>

                      {/* Specs skeleton */}
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>

                      {/* Button skeleton */}
                      <div className="h-8 bg-gray-200 rounded mt-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Categories Sidebar - Only visible on large screens */}
      <div
        className="hidden xl:block fixed left-0 top-16 z-20 transition-all duration-150 ease-out"
        style={{
          width: isSidebarHovered ? "288px" : "60px",
          height: "calc(100vh - 64px)",
        }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* Sidebar Arrow Indicator - Full Height Tab */}
        {!isSidebarHovered && (
          <div className="absolute left-0 top-0 h-full w-12 z-30 flex items-center justify-center">
            <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white w-8 h-20 rounded-r-2xl shadow-lg cursor-pointer flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:scale-105">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Sidebar Content */}
        <div
          className={`h-full overflow-y-auto custom-scrollbar transition-all duration-150 ease-out ${
            isSidebarHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          <CategoriesSidebar />
        </div>
      </div>

      {/* Mobile Search Bar - Only visible on mobile, positioned below navbar */}
      <div
        className={`md:hidden sticky top-16 z-30 bg-white shadow-lg border-b border-gray-200 transition-transform duration-300 ${
          isSearchBarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Blur the input to dismiss the keyboard
              const input = e.currentTarget.querySelector("input");
              if (input) {
                input.blur();
              }
              if (searchQuery.trim()) {
                router.push(
                  `/products?search=${encodeURIComponent(searchQuery.trim())}`
                );
                setShowSearchDropdown(false);
              }
            }}
            className="relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search phones, brands, or features..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.length >= 2);
                }}
                onFocus={() => setShowSearchDropdown(searchQuery.length >= 2)}
                onBlur={() => {
                  // Delay hiding to allow for dropdown interactions
                  setTimeout(() => {
                    setShowSearchDropdown(false);
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Blur the input to dismiss the keyboard
                    e.currentTarget.blur();
                    // Submit the search
                    if (searchQuery.trim()) {
                      router.push(
                        `/products?search=${encodeURIComponent(
                          searchQuery.trim()
                        )}`
                      );
                      setShowSearchDropdown(false);
                    }
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Dropdown */}
            {showSearchDropdown && searchQuery.length >= 2 && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-3">
                    Search results for "{searchQuery}"
                  </div>
                  <div className="space-y-2">
                    {filteredProducts.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/lipamdogomdogo/products/${product.id}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={
                              product.image_urls?.[0] ||
                              "/placeholder-phone.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.brand} • {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="text-center py-4">
                        <div className="text-gray-400 text-2xl mb-2">🔍</div>
                        <p className="text-sm text-gray-500">
                          No products found
                        </p>
                      </div>
                    )}
                    {filteredProducts.length > 6 && (
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={() => {
                            router.push(
                              `/products?search=${encodeURIComponent(
                                searchQuery.trim()
                              )}`
                            );
                            setShowSearchDropdown(false);
                          }}
                          className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium py-2"
                        >
                          View all {filteredProducts.length} results
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 xl:ml-16">
        <WhatsappOrder />
        {/* Popular Brands */}
        <div className="mb-12">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 text-start mb-6">
            Popular Brands
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0.5">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() =>
                  router.push(`/products/brand/${brand.name.toLowerCase()}`)
                }
              >
                <div className="bg-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border-2 border-transparent group-hover:border-gray-200 relative overflow-hidden h-16 sm:h-20">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/10 transition-colors duration-300"></div>
                  {/* <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="font-semibold text-white text-sm text-center group-hover:text-orange-300 transition-colors">
                      {brand.name}
                    </h3>
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <div className="text-sm sm:text-base text-gray-600 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={addItem}
                        viewMode="grid"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Loading More Skeleton for Search Results - Always show when loadingMore */}
                {loadingMore && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`loading-skeleton-${index}`}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse"
                      >
                        <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-5 bg-gray-200 rounded w-20"></div>
                          <div className="flex gap-2 mt-2">
                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded mt-3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* End of Results Message for Search */}
                {!hasMore && filteredProducts.length > 0 && !loadingMore && (
                  <div className="text-center mt-8 py-4">
                    <p className="text-gray-500 text-sm">
                      You've reached the end of search results
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/products");
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Trending phones */}
        {!searchQuery &&
          (featuredLoaded && featuredProducts.length > 0 ? (
            <div className="mb-12">
              <div className="text-start mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Trending Phones
                </h2>
                {/* <p className="text-gray-600">
                Handpicked products that stand out from the rest
              </p> */}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-3">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={addItem}
                      viewMode="grid"
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Loading More Skeleton for Featured Products - Always show when loadingMore */}
              {loadingMore && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={`featured-loading-skeleton-${index}`}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse h-full"
                    >
                      <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                        <div className="flex gap-2 mt-2">
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded mt-3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Featured Products Skeleton
            <div className="mb-12">
              <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={`featured-skeleton-${index}`}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse h-full"
                  >
                    <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded mt-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {/* Offers Category */}
        <OffersCategory />
        {/* Special Offers */}
        {!searchQuery &&
          specialOffersLoaded &&
          specialOfferProducts.length > 0 && (
            <div className="mb-12">
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-2 sm:p-6 text-gray-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-orange-100/30"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/15 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10">
                  {/* Hero Section with Image and Countdown */}
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
                    {/* Left Side - Image */}
                    <div className="flex-1">
                      <Image
                        src="/deals.png"
                        alt="Special Deals"
                        width={500}
                        height={300}
                        className="rounded-2xl shadow-2xl"
                      />
                    </div>

                    {/* Right Side - Promotional Content */}
                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                        {monthlyOfferConfig.month} Offers
                      </h2>
                      <p className="text-gray-600 text-lg mb-6">
                        {monthlyOfferConfig.offer}
                      </p>
                      {/* Countdown Timer */}
                      <div className="flex justify-center lg:justify-start gap-2 mb-6">
                        <div className="bg-white text-black rounded-xl p-4 text-center min-w-[80px] shadow-lg">
                          <div className="text-2xl font-bold">
                            {timeLeft.days.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm opacity-90">days</div>
                        </div>
                        <div className="bg-white text-black rounded-xl p-4 text-center min-w-[80px] shadow-lg">
                          <div className="text-2xl font-bold">
                            {timeLeft.hours.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm opacity-90">hr</div>
                        </div>
                        <div className="bg-white text-black rounded-xl p-4 text-center min-w-[80px] shadow-lg">
                          <div className="text-2xl font-bold">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm opacity-90">min</div>
                        </div>
                        <div className="bg-white text-black rounded-xl p-4 text-center min-w-[80px] shadow-lg">
                          <div className="text-2xl font-bold">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm opacity-90">sec</div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link href={monthlyOfferConfig.brandPage}>
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          Go Shopping
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-4">
                    {specialOfferProducts.length > 0 ? (
                      specialOfferProducts.map((product, index) => {
                        const discount = product.discount_percentage || 25;
                        const originalPrice =
                          product.original_price || product.price * 1.3;
                        const savings = originalPrice - product.price;

                        return (
                          <Link
                            key={product.id}
                            href={`/lipamdogomdogo/products/${product.id}`}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group relative bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer h-full flex flex-col"
                            >
                              {/* Discount Badge */}
                              <div className="absolute top-4 left-4 z-20">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  -{discount}%
                                </div>
                              </div>

                              {/* Product Image */}
                              <div className="relative h-40 bg-white">
                                <Image
                                  src={
                                    product.image_urls?.[0] ||
                                    "/placeholder-phone.jpg"
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-contain group-hover:scale-110 transition-transform duration-500 p-3"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="p-3">
                                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                  {product.name.split("(")[0]}
                                </h3>

                                <div className="mb-3">
                                  {(() => {
                                    const priceDisplay =
                                      getPriceDisplayWithOriginal(product);
                                    return (
                                      <div>
                                        {priceDisplay.hasDiscount &&
                                          priceDisplay.originalPrice && (
                                            <div className="text-xs text-gray-500 line-through truncate mb-1">
                                              {priceDisplay.originalPrice}
                                            </div>
                                          )}
                                        <div className="text-sm font-bold text-orange-600 truncate">
                                          {priceDisplay.currentPrice}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      window.location.href = `/products/${product.id}`;
                                    }}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">
                                      Select Options
                                    </span>
                                    <span className="sm:hidden">Options</span>
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                          No {monthlyOfferConfig.brand} products available at
                          the moment
                        </div>
                        <Link href={monthlyOfferConfig.brandPage}>
                          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 rounded-xl">
                            View All {monthlyOfferConfig.brand} Products
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Special Offers Skeleton */}
        {!searchQuery && !specialOffersLoaded && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-2 sm:p-6 text-gray-900 relative overflow-hidden">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={`special-offer-skeleton-${index}`}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse h-full"
                  >
                    <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded mt-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Curved Phones */}
        {!searchQuery && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-2 sm:p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                  Immersive Curved Display
                </h3>
                <p className="text-gray-600 text-sm">
                  Experience the future with our premium curved display
                  smartphones
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-6">
                {curvedProducts.length > 0 ? (
                  curvedProducts.slice(0, 8).map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/lipamdogomdogo/products/${product.id}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1 cursor-pointer h-full flex flex-col"
                      >
                        <div className="relative h-40 bg-white">
                          <Image
                            src={
                              product.image_urls?.[0] ||
                              "/placeholder-phone.jpg"
                            }
                            alt={product.name.split("(")[0]}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500 p-1"
                          />

                          {/* Discount Badge */}
                          {product.discount_percentage &&
                            product.discount_percentage > 0 && (
                              <div className="absolute top-4 right-4 z-10">
                                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                  -{product.discount_percentage}%
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="p-3">
                          <h3 className="font-bold text-gray-900 text-[12px] mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {product.name.split("(")[0]}
                          </h3>
                          <div className="space-y-3">
                            {(() => {
                              const priceDisplay =
                                getPriceDisplayWithOriginal(product);
                              return (
                                <div className="text-start">
                                  {priceDisplay.hasDiscount &&
                                    priceDisplay.originalPrice && (
                                      <div className="text-[10px] text-gray-500 line-through mb-1">
                                        {priceDisplay.originalPrice}
                                      </div>
                                    )}
                                  <div className="text-[12px] font-bold text-orange-600 truncate">
                                    {priceDisplay.currentPrice}
                                  </div>
                                </div>
                              );
                            })()}
                            <div className="flex gap-2">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.location.href = `/products/${product.id}`;
                                }}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">
                                  Select Options
                                </span>
                                <span className="sm:hidden">Options</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      No curved display products available at the moment
                    </div>
                    <Button
                      onClick={() => router.push("/products")}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-xl"
                    >
                      View All Products
                    </Button>
                  </div>
                )}
              </div>

              {/* More Products Button */}
              {curvedProducts.length > 8 && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => router.push("/products")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View All Curved Display Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vivo Lipa Mdogo Mdogo Section */}
        {!searchQuery &&
          (vivoLoaded && vivoProducts.length > 0 ? (
            <div className="mb-12">
              <div className="p-1 sm:p-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Vivo Lipa Mdogo Mdogo
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Flexible payment options for Vivo smartphones
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/products/brand/vivo")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 py-2 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    More Products
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-6">
                  {vivoProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={addItem}
                        viewMode="grid"
                        className="h-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Vivo Skeleton
            <div className="mb-12">
              <div className="p-4 sm:p-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={`vivo-skeleton-${index}`}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse h-full"
                    >
                      <div className="relative h-40 bg-gray-200 rounded-lg mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                        <div className="flex gap-2 mt-2">
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded mt-3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* WhatsApp Order Component */}
      <WhatsappOrder />
    </div>
  );
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
