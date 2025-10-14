import type { MetadataRoute } from "next";

// Central list of bots and AI agents we want to block
const AI_BOT_UAS = [
  // General web crawlers
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandex",
  "sogou",
  "exabot",
  "ia_archiver",
  "facebot",
  "facebookexternalhit",
  "twitterbot",
  "applebot",
  "redditbot",
  "linkedinbot",
  "pinterestbot",
  // AI/LLM-specific and extended crawlers
  "gptbot",
  "chatgpt-user",
  "google-extended",
  "ccbot",
  "perplexitybot",
  "anthropic-ai",
  "claudebot",
  "claude-web",
  "oai-searchbot",
  "bytespider",
  "cohere-ai",
  "mazekai",
  "diffbot",
  "dataforseo",
  "serpapi",
  "scrapy",
];

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/?$/, "") ??
  "https://cleoai.cloud";

export default function robots(): MetadataRoute.Robots {
  // Allow only root and policies routes; disallow everything else
  const commonRules = {
    allow: ["/", "/policies", "/policies/"] as string[],
    disallow: ["/*"] as string[],
  };

  return {
    rules: [
      // Default rule for all user agents
      {
        userAgent: "*",
        allow: [
          "/",
          "/policies",
          "/policies/",
          "/policies/cookies/",
          "/policies/privacy/",
          "/policies/refunds-disputes/",
          "/policies/terms-of-service/",
        ],
        disallow: [
          "/_next/",
          "/api/",
          "/dashboard/",
          "/add/",
          "/webhooks/",
          "/staff/",
          "/auth/",
          "/sign-in",
          "/sign-up",
          "/*?*", // any query params
        ],
      },
      // Explicit denial for known AI/crawlers
      ...AI_BOT_UAS.map((ua) => ({ userAgent: ua, ...commonRules })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
