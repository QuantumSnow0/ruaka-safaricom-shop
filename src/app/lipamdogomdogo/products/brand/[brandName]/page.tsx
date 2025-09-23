"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@lipam/components/ui/ProductCard";
import Button from "@lipam/components/ui/Button";
import { useCart } from "@lipam/contexts/CartContext";
import { Product } from "@lipam/lib/types";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const BrandPageContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const supabase = createClientComponentClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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

  const brandName = params.brandName as string;
  const capitalizedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  // Price ranges
  const priceRanges = [
    { label: "Under KES 30,000", value: "0-30000" },
    { label: "KES 30,000 - 50,000", value: "30000-50000" },
    { label: "KES 50,000 - 100,000", value: "50000-100000" },
    { label: "Over KES 100,000", value: "100000+" },
  ];

  // Fetch products by brand from Supabase
  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("brand", `%${brandName}%`)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        console.log(`Brand query for: "${brandName}"`);
        console.log(`Found ${data?.length || 0} products`);
        console.log(
          "Products:",
          data?.map((p) => ({ id: p.id, name: p.name, brand: p.brand }))
        );

        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        console.error("Error fetching products by brand:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (brandName) {
      fetchProductsByBrand();
    }
  }, [brandName, supabase]);

  // Filter products
  const filterProducts = (search: string, price: string, sort: string) => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.model.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Price filter
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(
          (product) => product.price >= min && product.price <= max
        );
      } else {
        filtered = filtered.filter((product) => product.price >= min);
      }
    }

    // Sort
    if (sort) {
      switch (sort) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(query, priceRange, sortBy);
  };

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    if (type === "price") {
      setPriceRange(value);
      filterProducts(searchQuery, value, sortBy);
    } else if (type === "sort") {
      setSortBy(value);
      filterProducts(searchQuery, priceRange, value);
    }
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

  // Filter products when filters change (search is handled in handleSearch)
  useEffect(() => {
    filterProducts(searchQuery, priceRange, sortBy);
  }, [priceRange, sortBy, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading {capitalizedBrand} products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Smartphone className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 mb-2">
            Error Loading Products
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">{error}</p>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Smartphone className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 mb-2">
            No {capitalizedBrand} phones found
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            We don't have any {capitalizedBrand} phones in stock right now.
          </p>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Button>
          </Link>
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
                  placeholder={`Search ${capitalizedBrand.toLowerCase()} phones...`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No phones found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
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
                  <span className="mr-3 text-2xl sm:text-3xl">📱</span>
                  {capitalizedBrand} Phones
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "phone" : "phones"} available
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
              placeholder={`Search ${capitalizedBrand.toLowerCase()} phones...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
              placeholder={`Search ${capitalizedBrand.toLowerCase()} phones...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
            {/* <select
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
            </select> */}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="newest">Newest First</option>
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
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange("");
                  setSortBy("");
                  setFilteredProducts(products);
                }}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Filters
              </h3>

              {/* Price Range */}
              {/* <div className="mb-6">
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
              </div> */}

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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="newest">Newest First</option>
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
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange("");
                    setSortBy("");
                    setFilteredProducts(products);
                  }}
                  className="w-full px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid - Desktop */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No phones found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
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

const BrandPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandPageContent />
    </Suspense>
  );
};

export default BrandPage;
