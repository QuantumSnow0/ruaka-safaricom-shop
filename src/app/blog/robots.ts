import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/blog/",
      disallow: ["/blog/admin/", "/blog/draft/"],
    },
    sitemap: "https://safaricomshopruaka.com/blog/sitemap.xml",
  };
}

