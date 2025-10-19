"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Filter,
} from "lucide-react";
import { useCart } from "@lipam/contexts/CartContext";
import { useWishlist } from "@lipam/contexts/WishlistContext";
import { useAuth } from "@lipam/contexts/AuthContext";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import SearchDropdown from "../ui/SearchDropdown";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"menu" | "categories">(
    "categories"
  );

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync filter states with URL parameters
  useEffect(() => {
    const brand = searchParams.get("brand");
    const price = searchParams.get("price");
    const sort = searchParams.get("sort");

    setSelectedBrand(brand || "");
    setPriceRange(price || "");
    setSortBy(sort || "");
  }, [
    searchParams.get("brand"),
    searchParams.get("price"),
    searchParams.get("sort"),
  ]);

  // Filter options
  const brands = [
    "Apple",
    "Samsung",
    "Tecno",
    "Oppo",
    "Redmi",
    "Infinix",
    "Vivo",
  ];

  // Categories for mobile menu
  const categories = [
    { name: "All Products", href: "/lipamdogomdogo/shop", icon: "📱" },
    {
      name: "Smartphones",
      href: "/lipamdogomdogo/products/category/smartphones",
      icon: "📱",
    },
    {
      name: "Tablets",
      href: "/lipamdogomdogo/products/category/tablets",
      icon: "📱",
    },
    {
      name: "Accessories",
      href: "/lipamdogomdogo/products/category/accessories",
      icon: "🎧",
    },
    {
      name: "Cases & Covers",
      href: "/lipamdogomdogo/products/category/cases",
      icon: "🛡️",
    },
    {
      name: "Chargers",
      href: "/lipamdogomdogo/products/category/chargers",
      icon: "🔌",
    },
    {
      name: "Earphones",
      href: "/lipamdogomdogo/products/category/earphones",
      icon: "🎧",
    },
    {
      name: "Power Banks",
      href: "/lipamdogomdogo/products/category/powerbanks",
      icon: "🔋",
    },
    {
      name: "Gaming",
      href: "/lipamdogomdogo/products/category/gaming",
      icon: "🎮",
    },
    {
      name: "Smart Watches",
      href: "/lipamdogomdogo/products/category/smart-watches",
      icon: "⌚",
    },
    {
      name: "Laptops",
      href: "/lipamdogomdogo/products/category/laptops",
      icon: "💻",
    },
    {
      name: "Cameras",
      href: "/lipamdogomdogo/products/category/cameras",
      icon: "📷",
    },
  ];

  const brandCategories = [
    { name: "Apple", href: "/lipamdogomdogo/products/brand/apple", icon: "📱" },
    {
      name: "Samsung",
      href: "/lipamdogomdogo/products/brand/samsung",
      icon: "📱",
    },
    { name: "Tecno", href: "/lipamdogomdogo/products/brand/tecno", icon: "📱" },
    { name: "Oppo", href: "/lipamdogomdogo/products/brand/oppo", icon: "📱" },
    { name: "Redmi", href: "/lipamdogomdogo/products/brand/redmi", icon: "📱" },
    {
      name: "Infinix",
      href: "/lipamdogomdogo/products/brand/infinix",
      icon: "📱",
    },
    { name: "Vivo", href: "/lipamdogomdogo/products/brand/vivo", icon: "📱" },
  ];
  const priceRanges = [
    { label: "Under KES 2,000", value: "under-2k" },
    { label: "KES 2,000 - 5,000", value: "2k-5k" },
    { label: "KES 5,000 - 8,000", value: "5k-8k" },
    { label: "KES 8,000 - 12,000", value: "8k-12k" },
    { label: "KES 12,000 - 16,000", value: "12k-16k" },
    { label: "KES 16,000 - 20,000", value: "16k-20k" },
    { label: "Over KES 20,000", value: "over-20k" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setSearchQuery("");
      setIsSearchExpanded(false);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow for dropdown interactions
    setTimeout(() => {
      if (!showSearchDropdown) {
        setIsSearchExpanded(false);
      }
    }, 200);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setShowSearchDropdown(query.length >= 2);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const handleProductClick = () => {
    setShowSearchDropdown(false);
  };

  const handleFilterChange = (type: string, value: string) => {
    // Only update local state, don't apply filters yet
    if (type === "brand") {
      setSelectedBrand(value);
    } else if (type === "price") {
      setPriceRange(value);
    } else if (type === "sort") {
      setSortBy(value);
    }
  };

  const applyFilters = () => {
    // If a brand is selected, redirect to the brand page
    if (selectedBrand) {
      const brandName = selectedBrand.toLowerCase();
      router.push(`/products/brand/${brandName}`);
      setIsFilterOpen(false);
      return;
    }

    // For other filters (price, sort), redirect to shop with query parameters
    const params = new URLSearchParams();

    // Add search query if exists
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    // Add other filters (excluding brand since it redirects to brand page)
    if (priceRange) params.set("price", priceRange);
    if (sortBy) params.set("sort", sortBy);

    // Debug: Log current pathname and redirect
    console.log("Current pathname:", pathname);
    console.log("Redirecting to shop with filters:", params.toString());

    // Redirect to shop page with filters
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedBrand("");
    setPriceRange("");
    setSortBy("");
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    // Always redirect to shop page
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`);
    setIsFilterOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Logo */}
            <Link
              href="/lipamdogomdogo/products"
              className="hidden md:flex items-center"
            >
              <Image
                src="/android-chrome-192x192.png"
                alt="Lipamdogomdogo"
                width={40}
                height={40}
                className="mr-2"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>

            {/* Mobile Layout */}
            <div className="flex md:hidden items-center justify-between w-full">
              {/* Mobile Menu Button - Left */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Mobile Logo - Center */}
              <Link
                href="/lipamdogomdogo/products"
                className="flex items-center"
              >
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Lipamdogomdogo"
                  width={50}
                  height={50}
                  className="mx-auto"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </Link>

              {/* Mobile Cart - Right */}
              <Link
                href="/lipamdogomdogo/cart"
                className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative"
              >
                <ShoppingCart size={22} />
                {isClient && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/lipamdogomdogo/shop"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/lipamdogomdogo/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/lipamdogomdogo/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Search Icon - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Icon */}
              {!isSearchExpanded ? (
                <button
                  onClick={handleSearchIconClick}
                  className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="flex items-center flex-1 max-w-md">
                  <form onSubmit={handleSearch} className="w-full relative">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search phones, brands, or features..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() =>
                          setShowSearchDropdown(searchQuery.length >= 2)
                        }
                        onBlur={handleSearchBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch(e);
                          }
                        }}
                        className="w-full px-4 py-2 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200"
                        autoFocus
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Search Dropdown */}
                    <SearchDropdown
                      searchQuery={searchQuery}
                      isOpen={showSearchDropdown}
                      onClose={() => setShowSearchDropdown(false)}
                      onProductClick={handleProductClick}
                    />
                  </form>
                </div>
              )}

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 text-gray-700 hover:text-orange-600 transition-colors bg-gray-100 hover:bg-orange-100 rounded-lg"
                title="Filters"
              >
                <Filter size={20} />
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop: Show all actions */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Wishlist */}
                <Link
                  href="/lipamdogomdogo/wishlist"
                  className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative"
                >
                  <Heart size={20} />
                  {isClient && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/lipamdogomdogo/cart"
                  className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {isClient && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                {isClient && user ? (
                  <div className="relative group">
                    <button className="p-2 text-gray-700 hover:text-orange-600 transition-colors">
                      <User size={20} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        href="/lipamdogomdogo/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/lipamdogomdogo/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : isClient ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => router.push("/login")}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => router.push("/signup")}
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop - Covers entire screen */}
              <div
                className="fixed inset-0 bg-black/70 z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Sidebar */}
              <div
                className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeMobileTab === "menu" ? "Menu" : "Categories"}
                    </h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveMobileTab("categories")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeMobileTab === "categories"
                          ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Categories
                    </button>
                    <button
                      onClick={() => setActiveMobileTab("menu")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeMobileTab === "menu"
                          ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Menu
                    </button>
                  </div>

                  {/* Sidebar Content */}
                  <div className="flex-1 overflow-y-auto">
                    {activeMobileTab === "categories" ? (
                      <>
                        {/* Categories Content */}
                        <div className="p-4 space-y-4">
                          {/* Product Categories */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Product Categories
                            </h3>
                            <nav className="space-y-1">
                              {categories.map((category) => (
                                <Link
                                  key={category.name}
                                  href={category.href}
                                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="text-lg mr-3">
                                    {category.icon}
                                  </span>
                                  <span className="text-base font-medium">
                                    {category.name}
                                  </span>
                                </Link>
                              ))}
                            </nav>
                          </div>

                          {/* Brand Categories */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Popular Brands
                            </h3>
                            <nav className="space-y-1">
                              {brandCategories.map((brand) => (
                                <Link
                                  key={brand.name}
                                  href={brand.href}
                                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="text-lg mr-3">
                                    {brand.icon}
                                  </span>
                                  <span className="text-base font-medium">
                                    {brand.name}
                                  </span>
                                </Link>
                              ))}
                            </nav>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Navigation Links */}
                        <nav className="p-4 space-y-2">
                          <Link
                            href="/"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-base font-medium">Home</span>
                          </Link>
                          <Link
                            href="/lipamdogomdogo/shop"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-base font-medium">Shop</span>
                          </Link>
                          <Link
                            href="/lipamdogomdogo/about"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-base font-medium">About</span>
                          </Link>
                          <Link
                            href="/blog"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-base font-medium">Blog</span>
                          </Link>
                          <Link
                            href="/lipamdogomdogo/contact"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-base font-medium">
                              Contact
                            </span>
                          </Link>
                        </nav>
                      </>
                    )}

                    {/* Action Buttons - Only show in Menu tab */}
                    {activeMobileTab === "menu" && (
                      <div className="p-4 space-y-2 border-t border-gray-200">
                        {/* Filter Button */}
                        <button
                          onClick={() => {
                            setIsFilterOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                        >
                          <Filter size={20} className="mr-3" />
                          <span className="text-base font-medium">Filters</span>
                        </button>

                        {/* Cart */}
                        <Link
                          href="/lipamdogomdogo/cart"
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShoppingCart size={20} className="mr-3" />
                          <span className="text-base font-medium">Cart</span>
                          {isClient && itemCount > 0 && (
                            <span className="ml-auto bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {itemCount}
                            </span>
                          )}
                        </Link>

                        {/* Wishlist */}
                        <Link
                          href="/lipamdogomdogo/wishlist"
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart size={20} className="mr-3" />
                          <span className="text-base font-medium">
                            Wishlist
                          </span>
                          {isClient && wishlistCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        {/* User Actions */}
                        {isClient && user ? (
                          <>
                            <Link
                              href="/lipamdogomdogo/profile"
                              className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <User size={20} className="mr-3" />
                              <span className="text-base font-medium">
                                Profile
                              </span>
                            </Link>
                            <Link
                              href="/lipamdogomdogo/orders"
                              className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="text-base font-medium">
                                My Orders
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                            >
                              <span className="text-base font-medium">
                                Sign Out
                              </span>
                            </button>
                          </>
                        ) : isClient ? (
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                router.push("/login");
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                            >
                              Sign In
                            </button>
                            <button
                              onClick={() => {
                                router.push("/signup");
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                            >
                              Sign Up
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Products"
        size="md"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search phones, brands, or features..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-6 py-3 pl-12 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200"
              autoFocus
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Search
          </Button>
        </form>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Products"
        size="lg"
      >
        <div className="space-y-6">
          {/* Brand Filter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Brand</h4>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          {/* <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
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
                    onChange={(e) =>
                      handleFilterChange("price", e.target.value)
                    }
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Sort By
            </h4>
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={clearFilters}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Clear All
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
