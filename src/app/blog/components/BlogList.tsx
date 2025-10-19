"use client";

import React from "react";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  image: string;
  views: number;
  likes: number;
}

interface BlogListProps {
  posts: BlogPost[];
  variant?: "grid" | "list" | "featured";
  showFeatured?: boolean;
  className?: string;
}

export default function BlogList({
  posts,
  variant = "grid",
  showFeatured = true,
  className = "",
}: BlogListProps) {
  const featuredPosts = showFeatured
    ? posts.filter((post) => post.featured)
    : [];
  const regularPosts = showFeatured
    ? posts.filter((post) => !post.featured)
    : posts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (variant === "featured") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`space-y-8 ${className}`}
      >
        {featuredPosts.map((post) => (
          <BlogCard key={post.id} post={post} variant="featured" />
        ))}
      </motion.div>
    );
  }

  if (variant === "list") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`space-y-4 ${className}`}
      >
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} variant="compact" index={index} />
        ))}
      </motion.div>
    );
  }

  // Grid variant (default) - Zigzag layout
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-12 ${className}`}
    >
      {posts.map((post, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={post.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`flex flex-col lg:flex-row gap-8 ${
              isEven ? "" : "lg:flex-row-reverse"
            } ${isEven ? "lg:pr-8" : "lg:pl-8"}`}
          >
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
                {post.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      <span>⭐</span>
                      Featured
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 flex items-center">
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    <span className="hidden sm:inline">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    {post.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span className="hidden sm:inline">{post.author}</span>
                    <span className="sm:hidden">Safaricom Shop Ruaka</span>
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-800 mb-6 text-lg leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>👁️</span>
                      <span className="hidden sm:inline">
                        {post.views} views
                      </span>
                      <span className="sm:hidden">{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span className="hidden sm:inline">
                        {post.likes} likes
                      </span>
                      <span className="sm:hidden">{post.likes}</span>
                    </div>
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg group-hover:gap-3 transition-all"
                  >
                    <span className="hidden sm:inline">Read More</span>
                    <span className="sm:hidden">Read</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
