"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, TrendingUp, Zap, BookOpen, Globe, Wrench } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  All: <TrendingUp size={16} />,
  "Deals & Savings Hub": <Zap size={16} />,
  "Technology & Products": <BookOpen size={16} />,
  "Internet & Connectivity": <Globe size={16} />,
  "Safaricom Services": <Tag size={16} />,
  "Local Business & Community": <Globe size={16} />,
  "How-To Guides": <Wrench size={16} />,
};

const categoryColors: { [key: string]: string } = {
  All: "bg-gray-600 text-white",
  "Deals & Savings Hub": "bg-yellow-500 text-gray-900",
  "Technology & Products": "bg-blue-600 text-white",
  "Internet & Connectivity": "bg-green-600 text-white",
  "Safaricom Services": "bg-purple-600 text-white",
  "Local Business & Community": "bg-orange-600 text-white",
  "How-To Guides": "bg-red-600 text-white",
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;
        const icon = categoryIcons[category] || <Tag size={16} />;
        const colorClass = categoryColors[category] || "bg-gray-600 text-white";
        const isEven = index % 2 === 0;

        return (
          <div
            key={category}
            className={`flex w-full ${
              isEven ? "justify-start" : "justify-end"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? `${colorClass} shadow-lg`
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {icon}
              <span>{category}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
