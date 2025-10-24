"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BlogPostHeader from "../components/BlogPostHeader";
import BlogPostContent from "../components/BlogPostContent";
import BlogPostAuthor from "../components/BlogPostAuthor";
import BlogPostActions from "../components/BlogPostActions";
import ShareModal from "../components/ShareModal";
import RelatedPosts from "../components/RelatedPosts";
import NewsletterSignup from "../components/NewsletterSignup";
import { useShare } from "../hooks/useShare";
import { sampleBlogPost, relatedPosts } from "../data/samplePosts";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const { isShareOpen, setIsShareOpen, copied, handleShare } = useShare();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: sampleBlogPost.title,
            description: sampleBlogPost.excerpt,
            image: sampleBlogPost.image,
            author: {
              "@type": "Person",
              name: sampleBlogPost.author,
              description: sampleBlogPost.authorBio,
            },
            publisher: {
              "@type": "Organization",
              name: "Safaricom Shop Ruaka",
              logo: {
                "@type": "ImageObject",
                url: "/logo.png",
              },
            },
            datePublished: sampleBlogPost.publishedAt,
            dateModified: sampleBlogPost.publishedAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.safaricomshopruaka.co.ke/blog/${sampleBlogPost.slug}`,
            },
            keywords: sampleBlogPost.tags.join(", "),
            articleSection: sampleBlogPost.category,
            wordCount: sampleBlogPost.content
              ? sampleBlogPost.content.split(/\s+/).length
              : 0,
            inLanguage: "en-KE",
          }),
        }}
      />

      {/* Header Actions */}
      <BlogPostActions
        isLiked={isLiked}
        onLike={() => setIsLiked(!isLiked)}
        onShare={() => setIsShareOpen(true)}
        likes={sampleBlogPost.likes}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShare={handleShare}
        copied={copied}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Blog Post Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BlogPostHeader post={sampleBlogPost} />
        </motion.div>

        {/* Blog Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="p-2">
            <BlogPostContent content={sampleBlogPost.content} />

            {/* Author Section */}
            <BlogPostAuthor
              author={{
                name: sampleBlogPost.author,
                bio: sampleBlogPost.authorBio,
                image: sampleBlogPost.authorImage,
              }}
            />
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <RelatedPosts posts={relatedPosts} />
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <NewsletterSignup
            title="Enjoyed this article?"
            description="Subscribe to get more insider tips and exclusive deals delivered to your inbox"
          />
        </motion.div>
      </div>
    </div>
  );
}
