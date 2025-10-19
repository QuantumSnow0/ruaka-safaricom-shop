export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  content?: string;
  category: string;
  tags: string[];
  author: string;
  authorBio?: string;
  authorImage?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  featured?: boolean;
  image: string;
  views: number;
  likes: number;
  comments?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  image: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  postCount?: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  author?: string;
  search?: string;
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface BlogSortOptions {
  field: "publishedAt" | "views" | "likes" | "title";
  direction: "asc" | "desc";
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogSearchResult {
  posts: BlogPost[];
  pagination: BlogPagination;
  filters: BlogFilters;
  sort: BlogSortOptions;
}

export interface BlogComment {
  id: string;
  postId: number;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
  parentId?: string;
  replies?: BlogComment[];
}

export interface BlogNewsletter {
  email: string;
  subscribedAt: string;
  preferences?: {
    categories?: string[];
    frequency?: "daily" | "weekly" | "monthly";
  };
}

export interface BlogAnalytics {
  postId: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  avgReadTime: number;
  bounceRate: number;
  conversionRate: number;
}

export type BlogPostStatus = "draft" | "published" | "archived";
export type BlogPostType = "article" | "tutorial" | "review" | "news" | "guide";
export type BlogSortField =
  | "publishedAt"
  | "views"
  | "likes"
  | "title"
  | "category";
export type BlogSortDirection = "asc" | "desc";
