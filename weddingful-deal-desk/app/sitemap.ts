import type { MetadataRoute } from "next";
import { b2bArticles } from "@/lib/b2b-articles";

const BASE_URL = "https://weddingful.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/vendors",
    "/resources",
    "/intake",
    "/concierge",
    "/audit",
    "/guides/wedding-vendor-negotiation",
    "/destinations/cancun-wedding-cost",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = b2bArticles.map((article) => ({
    url: `${BASE_URL}/resources/${article.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
