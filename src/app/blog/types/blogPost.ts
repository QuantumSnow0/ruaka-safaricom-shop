export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorBio: string;
  authorImage: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  image: string;
  views: number;
  likes: number;
  comments: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  image: string;
  readTime: string;
  views?: number;
}

