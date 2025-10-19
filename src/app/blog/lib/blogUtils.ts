import {
  BlogPost,
  BlogFilters,
  BlogSortOptions,
  BlogPagination,
} from "./blogTypes";

/**
 * Format date for display - ensures consistent formatting between server and client
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Ensure we have a valid date
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date for short display (e.g., "Jan 15, 2024")
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Ensure we have a valid date
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate reading time based on content length
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Filter blog posts based on criteria
 */
export function filterPosts(
  posts: BlogPost[],
  filters: BlogFilters
): BlogPost[] {
  return posts.filter((post) => {
    // Category filter
    if (
      filters.category &&
      filters.category !== "All" &&
      post.category !== filters.category
    ) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        post.tags.some((postTag) =>
          postTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Author filter
    if (filters.author && post.author !== filters.author) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(searchLower);
      const matchesExcerpt = post.excerpt.toLowerCase().includes(searchLower);
      const matchesTags = post.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      const matchesAuthor = post.author.toLowerCase().includes(searchLower);

      if (!matchesTitle && !matchesExcerpt && !matchesTags && !matchesAuthor) {
        return false;
      }
    }

    // Featured filter
    if (filters.featured !== undefined && post.featured !== filters.featured) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const postDate = new Date(post.publishedAt);
      const fromDate = new Date(filters.dateFrom);
      if (postDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const postDate = new Date(post.publishedAt);
      const toDate = new Date(filters.dateTo);
      if (postDate > toDate) return false;
    }

    return true;
  });
}

/**
 * Sort blog posts
 */
export function sortPosts(
  posts: BlogPost[],
  sortOptions: BlogSortOptions
): BlogPost[] {
  return [...posts].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortOptions.field) {
      case "publishedAt":
        aValue = new Date(a.publishedAt).getTime();
        bValue = new Date(b.publishedAt).getTime();
        break;
      case "views":
        aValue = a.views;
        bValue = b.views;
        break;
      case "likes":
        aValue = a.likes;
        bValue = b.likes;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOptions.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

/**
 * Paginate posts
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number = 1,
  limit: number = 10
): { posts: BlogPost[]; pagination: BlogPagination } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const pagination: BlogPagination = {
    page,
    limit,
    total: posts.length,
    totalPages: Math.ceil(posts.length / limit),
    hasNext: endIndex < posts.length,
    hasPrev: page > 1,
  };

  return { posts: paginatedPosts, pagination };
}

/**
 * Get unique categories from posts
 */
export function getCategories(posts: BlogPost[]): string[] {
  const categories = posts.map((post) => post.category);
  return ["All", ...Array.from(new Set(categories))];
}

/**
 * Get unique tags from posts
 */
export function getTags(posts: BlogPost[]): string[] {
  const allTags = posts.flatMap((post) => post.tags);
  return Array.from(new Set(allTags));
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const otherPosts = allPosts.filter((post) => post.id !== currentPost.id);

  // Score posts based on category and tag matches
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;

    // Category match
    if (post.category === currentPost.category) {
      score += 3;
    }

    // Tag matches
    const commonTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    score += commonTags.length;

    return { post, score };
  });

  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.featured);
}

/**
 * Get recent posts
 */
export function getRecentPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return sortPosts(posts, { field: "publishedAt", direction: "desc" }).slice(
    0,
    limit
  );
}

/**
 * Get popular posts
 */
export function getPopularPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return sortPosts(posts, { field: "views", direction: "desc" }).slice(
    0,
    limit
  );
}

/**
 * Get trending posts (based on likes and recent views)
 */
export function getTrendingPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentPosts = posts.filter(
    (post) => new Date(post.publishedAt) >= oneWeekAgo
  );

  return sortPosts(recentPosts, { field: "likes", direction: "desc" }).slice(
    0,
    limit
  );
}

/**
 * Search posts by query
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;

  const searchLower = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchLower);
    const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
    const tagMatch = post.tags.some((tag) =>
      tag.toLowerCase().includes(searchLower)
    );
    const authorMatch = post.author.toLowerCase().includes(searchLower);

    return titleMatch || excerptMatch || tagMatch || authorMatch;
  });
}

/**
 * Generate SEO meta data for blog post
 */
export function generateSEOMeta(post: BlogPost) {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      image: post.image,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      image: post.image,
    },
  };
}

/**
 * Generate structured data for blog post
 */
export function generateStructuredData(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Safaricom Shop Ruaka",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://safaricomshopruaka.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
  };
}
