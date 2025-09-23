"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Filter, SortAsc, Grid, List, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@lipam/components/ui/ProductCard";
import Button from "@lipam/components/ui/Button";
import { useCart } from "@lipam/contexts/CartContext";
import { Product } from "@lipam/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatPrice } from "@lipam/lib/utils";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

// Helper function to format price range display
const formatPriceRange = (priceRange: string) => {
  switch (priceRange) {
    case "under-2k":
      return "Under 2k";
    case "2k-5k":
      return "2k-5k";
    case "5k-8k":
      return "5k-8k";
    case "8k-12k":
      return "8k-12k";
    case "12k-16k":
      return "12k-16k";
    case "16k-20k":
      return "16k-20k";
    case "over-20k":
      return "Over 20k";
    default:
      return priceRange;
  }
};

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Read search and filter parameters from URL
  useEffect(() => {
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const price = searchParams.get("price");
    const sort = searchParams.get("sort");

    if (search) {
      setSearchQuery(search);
    }
    if (brand) {
      setSelectedBrand(brand);
    }
    if (price) {
      setPriceRange(price);
    }
    if (sort) {
      setSortBy(sort);
    }
  }, [searchParams]);

  // Fetch products with pagination (without search - search is handled client-side)
  const fetchProducts = useCallback(
    async (pageNum: number, reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setPage(0);
        } else {
          setLoadingMore(true);
        }

        const from = pageNum * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        let query = supabase.from("products").select("*");

        // Apply brand filter
        if (selectedBrand) {
          query = query.eq("brand", selectedBrand);
        }

        // Apply price filter
        if (priceRange) {
          switch (priceRange) {
            case "under-2k":
              query = query.lt("price", 2000);
              break;
            case "2k-5k":
              query = query.gte("price", 2000).lt("price", 5000);
              break;
            case "5k-8k":
              query = query.gte("price", 5000).lt("price", 8000);
              break;
            case "8k-12k":
              query = query.gte("price", 8000).lt("price", 12000);
              break;
            case "12k-16k":
              query = query.gte("price", 12000).lt("price", 16000);
              break;
            case "16k-20k":
              query = query.gte("price", 16000).lt("price", 20000);
              break;
            case "over-20k":
              query = query.gte("price", 20000);
              break;
          }
        }

        // Apply range after filters
        query = query.range(from, to);

        // Apply sorting
        switch (sortBy) {
          case "price-low":
            query = query.order("price", { ascending: true });
            break;
          case "price-high":
            query = query.order("price", { ascending: false });
            break;
          case "name":
            query = query.order("name", { ascending: true });
            break;
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          default:
            query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        const newProducts = data || [];

        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setHasMore(newProducts.length === ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [supabase, selectedBrand, priceRange, sortBy]
  );

  // Load initial products
  useEffect(() => {
    fetchProducts(0, true);
  }, [fetchProducts]);

  // Only fetch products once on initial load and when filters change
  // Search is handled purely client-side for better performance

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
      !loadingMore &&
      hasMore
    ) {
      fetchProducts(page + 1, false);
    }
  }, [fetchProducts, page, loadingMore, hasMore]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Mobile search bar scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsSearchBarVisible(false);
      } else {
        // Scrolling up
        setIsSearchBarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Filter and sort products (client-side for immediate feedback)
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) {
      return true; // Show all products when no search query
    }

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Remove duplicates based on product ID to prevent key conflicts
  const uniqueFilteredProducts = filteredProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* View Mode Toggle Skeleton */}
          <div className="mb-8 hidden md:block">
            <div className="flex items-center justify-end space-x-2">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-pulse"
              >
                {/* Image skeleton */}
                <div className="relative h-32 bg-gray-200 rounded-lg mb-3"></div>

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
          <Button onClick={() => fetchProducts(0, true)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                // For now, just hide dropdown - search is handled client-side
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
                    // Hide dropdown - search is handled client-side
                    setShowSearchDropdown(false);
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
              <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-3">
                    Search results for "{searchQuery}"
                  </div>
                  <div className="space-y-2">
                    {uniqueFilteredProducts.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
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
                            className="object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.brand} • {formatPrice(product.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {uniqueFilteredProducts.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No products found
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          className="block w-full text-center py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                          onClick={() => {
                            setShowSearchDropdown(false);
                            // Keep search query for filtering
                          }}
                        >
                          View all {uniqueFilteredProducts.length} results
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of smartphones
          </p>
        </div>

        {/* Applied Filters Display - Mobile Optimized */}
        {(selectedBrand || priceRange || sortBy) && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-700">
                  Applied filters:
                </span>
                <button
                  onClick={() => {
                    setSelectedBrand("");
                    setPriceRange("");
                    setSortBy("");
                    // Clear all filters and redirect to shop
                    const params = new URLSearchParams();
                    if (searchQuery.trim())
                      params.set("search", searchQuery.trim());
                    const queryString = params.toString();
                    router.push(`/shop${queryString ? `?${queryString}` : ""}`);
                  }}
                  className="text-xs text-orange-600 hover:text-orange-800 font-medium underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedBrand && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    {selectedBrand}
                    <button
                      onClick={() => {
                        setSelectedBrand("");
                        // Update URL without brand filter
                        const params = new URLSearchParams();
                        if (searchQuery.trim())
                          params.set("search", searchQuery.trim());
                        if (priceRange) params.set("price", priceRange);
                        if (sortBy) params.set("sort", sortBy);
                        const queryString = params.toString();
                        router.push(
                          `/shop${queryString ? `?${queryString}` : ""}`
                        );
                      }}
                      className="ml-1.5 text-orange-600 hover:text-orange-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {priceRange && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    {formatPriceRange(priceRange)}
                    <button
                      onClick={() => {
                        setPriceRange("");
                        // Update URL without price filter
                        const params = new URLSearchParams();
                        if (searchQuery.trim())
                          params.set("search", searchQuery.trim());
                        if (selectedBrand) params.set("brand", selectedBrand);
                        if (sortBy) params.set("sort", sortBy);
                        const queryString = params.toString();
                        router.push(
                          `/shop${queryString ? `?${queryString}` : ""}`
                        );
                      }}
                      className="ml-1.5 text-orange-600 hover:text-orange-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {sortBy && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    {sortBy
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    <button
                      onClick={() => {
                        setSortBy("");
                        // Update URL without sort filter
                        const params = new URLSearchParams();
                        if (searchQuery.trim())
                          params.set("search", searchQuery.trim());
                        if (selectedBrand) params.set("brand", selectedBrand);
                        if (priceRange) params.set("price", priceRange);
                        const queryString = params.toString();
                        router.push(
                          `/shop${queryString ? `?${queryString}` : ""}`
                        );
                      }}
                      className="ml-1.5 text-orange-600 hover:text-orange-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
              <span className="text-sm font-medium text-gray-700">
                Applied filters:
              </span>

              {selectedBrand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200">
                  Brand: {selectedBrand}
                  <button
                    onClick={() => {
                      setSelectedBrand("");
                      // Update URL without brand filter
                      const params = new URLSearchParams();
                      if (searchQuery.trim())
                        params.set("search", searchQuery.trim());
                      if (priceRange) params.set("price", priceRange);
                      if (sortBy) params.set("sort", sortBy);
                      const queryString = params.toString();
                      router.push(
                        `/shop${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {priceRange && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200">
                  Price: {formatPriceRange(priceRange)}
                  <button
                    onClick={() => {
                      setPriceRange("");
                      // Update URL without price filter
                      const params = new URLSearchParams();
                      if (searchQuery.trim())
                        params.set("search", searchQuery.trim());
                      if (selectedBrand) params.set("brand", selectedBrand);
                      if (sortBy) params.set("sort", sortBy);
                      const queryString = params.toString();
                      router.push(
                        `/shop${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {sortBy && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200">
                  Sort:{" "}
                  {sortBy
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  <button
                    onClick={() => {
                      setSortBy("");
                      // Update URL without sort filter
                      const params = new URLSearchParams();
                      if (searchQuery.trim())
                        params.set("search", searchQuery.trim());
                      if (selectedBrand) params.set("brand", selectedBrand);
                      if (priceRange) params.set("price", priceRange);
                      const queryString = params.toString();
                      router.push(
                        `/shop${queryString ? `?${queryString}` : ""}`
                      );
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedBrand("");
                  setPriceRange("");
                  setSortBy("");
                  // Clear all filters and redirect to shop
                  const params = new URLSearchParams();
                  if (searchQuery.trim())
                    params.set("search", searchQuery.trim());
                  const queryString = params.toString();
                  router.push(`/shop${queryString ? `?${queryString}` : ""}`);
                }}
                className="ml-auto text-sm text-orange-600 hover:text-orange-800 font-medium underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* View Mode Toggle - Desktop Only */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <List size={20} />
            </button>
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
                {uniqueFilteredProducts.length} product
                {uniqueFilteredProducts.length !== 1 ? "s" : ""} found
              </div>
            </div>

            {uniqueFilteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {uniqueFilteredProducts.map((product, index) => (
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
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Products Grid - Only show when not searching */}
        {!searchQuery && (
          <>
            {uniqueFilteredProducts.length > 0 ? (
              <>
                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                      : "space-y-4"
                  }`}
                >
                  <AnimatePresence>
                    {uniqueFilteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={viewMode === "grid" ? "h-full" : ""}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={addItem}
                          viewMode={viewMode}
                          className={viewMode === "grid" ? "h-full" : ""}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Loading More Skeleton */}
                {loadingMore && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-pulse"
                      >
                        {/* Image skeleton */}
                        <div className="relative h-32 bg-gray-200 rounded-lg mb-3"></div>

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
                )}

                {/* End of Results */}
                {!hasMore && uniqueFilteredProducts.length > 0 && (
                  <div className="text-center mt-8 py-8">
                    <p className="text-gray-500">
                      You've reached the end of our product catalog!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600 mb-6">
                  Check back later for new products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function ShopPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
