import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://safaricomshopruaka.co.ke";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          // Disallow API and admin/testing paths from indexing
          "/api/",
          "/lipamdogomdogo/admin",
          "/lipamdogomdogo/debug-admin",
          "/lipamdogomdogo/test-",
          "/lipamdogomdogo/console-debug",
          "/lipamdogomdogo/simple-debug",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
