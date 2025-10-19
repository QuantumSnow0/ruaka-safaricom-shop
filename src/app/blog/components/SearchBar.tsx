"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Filter, SortAsc } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  sortBy: string;
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "alphabetical", label: "A-Z" },
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSortChange,
  sortBy,
  className = "",
  placeholder = "Search articles...",
  showFilters = true,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative transition-all duration-200 ${
          isFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              isFocused ? "text-green-600" : "text-gray-400"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full pl-12 pr-12 py-4 text-lg rounded-full border-2 transition-all duration-300 focus:outline-none bg-white shadow-sm ${
              isFocused
                ? "border-green-500 shadow-lg shadow-green-100 ring-2 ring-green-100"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* Search Suggestions (placeholder for future implementation) */}
        {isFocused && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="p-4">
              <p className="text-sm text-gray-500">
                Search suggestions will appear here
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-4 mt-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SortAsc size={16} />
              <span className="text-sm">
                {sortOptions.find((option) => option.value === sortBy)?.label ||
                  "Sort by"}
              </span>
            </button>

            {showSortOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-48"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showSortOptions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSortOptions(false)}
        />
      )}
    </div>
  );
}
