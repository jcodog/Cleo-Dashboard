import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/?$/, "") ??
  "https://cleoai.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Policies index and leaf pages
    {
      url: `${baseUrl}/policies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies/cookies`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/policies/refunds-disputes`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/policies/terms-of-service`,
      lastModified: now,
    },
  ];

  return urls;
}
