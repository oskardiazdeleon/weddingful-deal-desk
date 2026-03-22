import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/brand"],
    },
    sitemap: "https://weddingful.com/sitemap.xml",
    host: "https://weddingful.com",
  };
}
