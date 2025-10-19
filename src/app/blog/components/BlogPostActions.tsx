"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

interface BlogPostActionsProps {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  likes: number;
}

export default function BlogPostActions({
  isLiked,
  onLike,
  onShare,
  likes,
}: BlogPostActionsProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              {isLiked ? likes + 1 : likes}
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

