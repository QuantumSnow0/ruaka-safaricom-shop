"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowLeft,
  Package,
  Tag,
  Percent,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@lipam/components/ui/ProductCard";
import Button from "@lipam/components/ui/Button";
import { useCart } from "@lipam/contexts/CartContext";
import { Product } from "@lipam/lib/types";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  side_image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const OffersPageContent: React.FC = () => {
  const router = useRouter();
  const { addItem } = useCart();
  const supabase = createClientComponentClient();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Price ranges
  const priceRanges = [
    { label: "Under KSh 5,000", value: "0-5000" },
    { label: "KSh 5,000 - KSh 10,000", value: "5000-10000" },
    { label: "KSh 10,000 - KSh 20,000", value: "10000-20000" },
    { label: "KSh 20,000 - KSh 50,000", value: "20000-50000" },
    { label: "Over KSh 50,000", value: "50000-999999" },
  ];

  // Sort options
  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" },
    { label: "Most Popular", value: "popular" },
  ];

  // Fetch offers and their products
  useEffect(() => {
    const fetchOffersAndProducts = async () => {
      try {
        setIsLoading(true);

        // Fetch active offers
        const { data: offersData, error: offersError } = await supabase
          .from("offers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (offersError) {
          throw offersError;
        }

        setOffers(offersData || []);

        // Fetch products that belong to any offer
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .not("offer_id", "is", null)
          .order("created_at", { ascending: false });

        if (productsError) {
          throw productsError;
        }

        setProducts(productsData || []);
        setFilteredProducts(productsData || []);
      } catch (err) {
        console.error("Error fetching offers and products:", err);
        setError("Failed to load offers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffersAndProducts();
  }, [supabase]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const productPrice = product.price || 0;
        return productPrice >= min && productPrice <= max;
      });
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "popular":
        // Sort by featured first, then by creation date
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        break;
      default:
        // Default sort by creation date
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredProducts(filtered);

    // Update displayed products - show only 6 initially unless showAllProducts is true
    if (showAllProducts || searchQuery || priceRange || sortBy) {
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(filtered.slice(0, 6));
    }
  }, [products, searchQuery, priceRange, sortBy, showAllProducts]);

  // Load more products
  const loadMoreProducts = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setShowAllProducts(true);
      setIsLoadingMore(false);
    }, 500);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setSortBy("");
    setShowAllProducts(false);
  };

  // Scroll behavior for search bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show search bar when focused
      if (isSearchFocused) {
        setIsSearchBarVisible(true);
        return;
      }

      // Show search bar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsSearchBarVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsSearchBarVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isSearchFocused]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-200 rounded w-32 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
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
            Error Loading Offers
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // If search is focused, show only search bar and results
  if (isSearchFocused) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Full-screen Search Bar */}
        <div className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchFocused(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/products"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Tag className="mr-3 text-2xl sm:text-3xl text-orange-500" />
                  Special Offers
                </h1>
                <p className="text-gray-600 mt-1">
                  {displayedProducts.length}{" "}
                  {displayedProducts.length === 1 ? "product" : "products"} on
                  offer
                  {!showAllProducts &&
                    filteredProducts.length > 6 &&
                    ` of ${filteredProducts.length} total`}
                  {offers.length > 0 &&
                    ` • ${offers.length} active offer${
                      offers.length === 1 ? "" : "s"
                    }`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Only visible on mobile, positioned below navbar */}
      <div
        className={`md:hidden sticky z-30 bg-white shadow-lg border-b border-gray-200 transition-all duration-300 ${
          isSearchFocused
            ? "top-0"
            : isSearchBarVisible
            ? "top-16 translate-y-0"
            : "top-16 -translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
            />
          </div>
        </div>
      </div>

      {/* Desktop Search Bar - Sticky, only search bar */}
      <div
        className={`hidden md:block sticky z-30 bg-white border-b border-gray-200 py-4 transition-all duration-300 ${
          isSearchFocused
            ? "top-0"
            : isSearchBarVisible
            ? "top-16 translate-y-0"
            : "top-16 -translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters - Only visible on small screens */}
      <div className="lg:hidden bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Price Range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">All Prices</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Sort by</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchQuery || priceRange || sortBy) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar - Only visible on large screens */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Percent className="w-5 h-5 mr-2 text-orange-500" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">Default</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  View Mode
                </h4>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 p-2 text-center ${
                      viewMode === "grid"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 p-2 text-center ${
                      viewMode === "list"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || priceRange || sortBy) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid - Desktop */}
          <div className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No offers found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || priceRange || sortBy
                    ? "Try adjusting your search or filter criteria."
                    : "No products are currently on offer."}
                </p>
                {(searchQuery || priceRange || sortBy) && (
                  <Button onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  <AnimatePresence>
                    {displayedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={addItem}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Load More Button - Only show if there are more products and not showing all */}
                {!showAllProducts && filteredProducts.length > 6 && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMoreProducts}
                      disabled={isLoadingMore}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Loading...
                        </div>
                      ) : (
                        `Load More (${filteredProducts.length - 6} more)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Search Button - Mobile only */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsSearchBarVisible(true)}
          className={`bg-orange-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 ${
            isSearchBarVisible ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const OffersPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OffersPageContent />
    </Suspense>
  );
};

export default OffersPage;
