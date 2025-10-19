"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowRight, TrendingUp } from "lucide-react";
import { formatDate } from "../lib/blogUtils";

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  image: string;
  readTime: string;
  views?: number;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  title?: string;
  className?: string;
}

export default function RelatedPosts({
  posts,
  title = "Related Articles",
  className = "",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </div>
                    {post.views && (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {post.views} views
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-green-600 group-hover:gap-2 transition-all">
                    <span className="text-sm font-semibold">Read More</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
