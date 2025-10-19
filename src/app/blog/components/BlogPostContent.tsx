"use client";

import React from "react";
import { marked } from "marked";

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Parse markdown to HTML
  const htmlContent = marked(content);

  return (
    <div className="max-w-none">
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </div>
  );
}
