"use client";

import React from "react";
import Image from "next/image";

interface BlogPostAuthorProps {
  author: {
    name: string;
    bio: string;
    image: string;
  };
}

export default function BlogPostAuthor({ author }: BlogPostAuthorProps) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-start gap-4">
        <Image
          src={author.image}
          alt={author.name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {author.name}
          </h3>
          <p className="text-gray-800 mb-4">{author.bio}</p>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Follow
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

