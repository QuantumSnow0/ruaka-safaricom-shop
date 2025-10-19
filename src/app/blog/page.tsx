"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  Star,
  BookOpen,
  Zap,
  X,
} from "lucide-react";
import BlogList from "./components/BlogList";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";
import { BlogPost } from "./lib/blogTypes";
import { filterPosts, sortPosts, getCategories } from "./lib/blogUtils";
import { blogPosts } from "./data/blogPosts";

const categories = getCategories(blogPosts);

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSearch, setShowSearch] = useState(false);

  const filteredPosts = filterPosts(blogPosts, {
    category: selectedCategory,
    search: searchQuery,
  });

  const sortOptions = {
    field:
      sortBy === "newest" || sortBy === "oldest"
        ? "publishedAt"
        : sortBy === "popular"
        ? "views"
        : "likes",
    direction: sortBy === "oldest" ? "asc" : "desc",
  } as const;

  const sortedPosts = sortPosts(filteredPosts, sortOptions);

  const featuredPosts = sortedPosts.filter((post) => post.featured);
  const regularPosts = sortedPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Blog Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/android-chrome-512x512.png"
                alt="Safaricom Shop Ruaka"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Safaricom
                  </span>
                  <span className="text-lg font-bold text-green-600 group-hover:text-gray-900 transition-colors">
                    Shop
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Ruaka
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    Blog
                  </span>
                </div>
              </div>
            </Link>

            {/* Search Icon */}
            <div className="flex items-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                {showSearch ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {showSearch && (
          <div className="relative -mt-2 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSortChange={setSortBy}
                sortBy={sortBy}
                className="w-full"
                showFilters={false}
                placeholder="Search for deals, tips, or guides..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sorting */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="w-full lg:w-auto">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Star className="text-yellow-500" size={24} />
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Articles
              </h2>
            </div>
            <BlogList posts={featuredPosts} variant="featured" />
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="text-green-600" size={24} />
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Articles
            </h2>
          </div>
          <BlogList posts={regularPosts} variant="grid" />
        </div>

        {/* Stats Section */}
        <div className="mt-16 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Articles</p>
                  <p className="text-3xl font-bold">50+</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Monthly Readers</p>
                  <p className="text-3xl font-bold">25K+</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Money Saved</p>
                  <p className="text-3xl font-bold">ksh 2M+</p>
                </div>
                <Zap className="w-8 h-8 text-purple-200" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Stay Updated with the Latest Deals
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Get weekly updates on the best Safaricom deals, tech tips, and
            exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
