import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

// Generate a comprehensive sitemap for public pages
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://safaricomshopruaka.co.ke";
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/customer-care`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internet-services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/wishlist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/orders`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/profile`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lipamdogomdogo/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Include category and brand listing pages based on folder names
  try {
    const categoryDir = path.join(
      process.cwd(),
      "src/app/lipamdogomdogo/products/category"
    );
    if (fs.existsSync(categoryDir)) {
      const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
      entries
        .filter((d) => d.isDirectory())
        .forEach((d) => {
          routes.push({
            url: `${baseUrl}/lipamdogomdogo/products/category/${encodeURIComponent(
              d.name
            )}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
    }
  } catch {}

  try {
    const brandDir = path.join(
      process.cwd(),
      "src/app/lipamdogomdogo/products/brand"
    );
    if (fs.existsSync(brandDir)) {
      const entries = fs.readdirSync(brandDir, { withFileTypes: true });
      entries
        .filter((d) => d.isDirectory())
        .forEach((d) => {
          routes.push({
            url: `${baseUrl}/lipamdogomdogo/products/brand/${encodeURIComponent(
              d.name
            )}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
    }
  } catch {}

  return routes;
}
