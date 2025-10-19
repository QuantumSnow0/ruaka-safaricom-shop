import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://safaricomshopruaka.com";

  // Sample blog posts - in a real app, this would come from your CMS or database
  const blogPosts = [
    {
      slug: "safaricom-secret-deals-insider-tips",
      lastModified: "2024-01-15",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      slug: "5g-vs-4g-difference-kenya",
      lastModified: "2024-01-12",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      slug: "best-data-bundle-deals-january-2024",
      lastModified: "2024-01-10",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      slug: "lipa-mdogo-mdogo-complete-guide",
      lastModified: "2024-01-08",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      slug: "samsung-vs-tecno-budget-phone-comparison",
      lastModified: "2024-01-05",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      slug: "ruaka-area-internet-coverage-guide",
      lastModified: "2024-01-03",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Blog categories
  const categories = [
    "deals-savings-hub",
    "technology-products",
    "internet-connectivity",
    "safaricom-services",
    "local-business-community",
    "how-to-guides",
  ];

  // Generate sitemap entries
  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: post.changeFrequency,
    priority: post.priority,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogEntries,
    ...categoryEntries,
  ];
}

