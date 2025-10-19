"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";
import { formatDate } from "../lib/blogUtils";

interface BlogCardProps {
  post: {
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
  };
  variant?: "featured" | "regular" | "compact";
  index?: number;
}

export default function BlogCard({
  post,
  variant = "regular",
  index = 0,
}: BlogCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1 },
    },
  };

  if (isFeatured) {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group border-b border-gray-200 pb-4 mb-4"
      >
        <div className="relative h-64">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span className="hidden sm:inline">
                {formatDate(post.publishedAt)}
              </span>
              <span className="sm:hidden">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime}
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="hidden sm:inline">{post.author}</span>
              <span className="sm:hidden">Safaricom Shop Ruaka</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-800 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} />
                <span className="hidden sm:inline">{post.views} views</span>
                <span className="sm:hidden">{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={14} />
                <span className="hidden sm:inline">{post.likes} likes</span>
                <span className="sm:hidden">{post.likes}</span>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold group-hover:gap-3 transition-all text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Read More</span>
              <span className="sm:hidden">Read</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  if (isCompact) {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group border-b border-gray-100 pb-4 mb-4"
      >
        <div className="flex">
          <div className="relative w-32 h-24 flex-shrink-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                {post.category}
              </span>
              <div className="flex items-center gap-1">
                <Clock size={10} />
                {post.readTime}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-2 text-sm">
              {post.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TrendingUp size={10} />
                  {post.views}
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={10} />
                  {post.likes}
                </div>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-green-600 hover:text-green-700 font-semibold text-xs"
              >
                Read →
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Regular variant
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group border-b border-gray-200 pb-4 mb-4"
    >
      <div className="relative h-48">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
        {post.featured && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
              <Star size={10} fill="currentColor" />
              Featured
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span className="hidden sm:inline">
              {formatDate(post.publishedAt)}
            </span>
            <span className="sm:hidden">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {post.readTime}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-800 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span className="hidden sm:inline">{post.views} views</span>
              <span className="sm:hidden">{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} />
              <span className="hidden sm:inline">{post.likes} likes</span>
              <span className="sm:hidden">{post.likes}</span>
            </div>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            <span className="hidden sm:inline">Read More</span>
            <span className="sm:hidden">Read</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
