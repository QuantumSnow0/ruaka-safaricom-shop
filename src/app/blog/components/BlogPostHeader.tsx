"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { formatDate } from "../lib/blogUtils";

interface BlogPostHeaderProps {
  post: {
    title: string;
    excerpt: string;
    publishedAt: string;
    readTime: string;
    views: number;
    comments: number;
    category: string;
    tags: string[];
    image: string;
  };
}

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      {/* Featured Image */}
      <div className="relative h-96">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-6 left-6">
          <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </span>
        </div>
        <div className="absolute top-6 right-6">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-8">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {post.readTime}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} />
            {post.views} views
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            {post.comments} comments
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-800 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

