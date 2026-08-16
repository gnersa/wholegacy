import type { MetadataRoute } from "next";

const SITE_URL = "https://wholegacy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: "/",
      priority: 1.0,
    },
    {
      url: "/about",
      priority: 0.7,
    },
    {
      url: "/digital-legacy",
      priority: 0.9,
    },
    {
      url: "/private-document-storage",
      priority: 0.9,
    },
    {
      url: "/private-documents-and-memories",
      priority: 0.9,
    },
    {
      url: "/memory-vault",
      priority: 0.9,
    },
    {
      url: "/family-archive",
      priority: 0.9,
    },
    {
      url: "/life-story",
      priority: 0.8,
    },
    {
      url: "/digital-inheritance",
      priority: 0.8,
    },
    {
      url: "/security",
      priority: 0.7,
    },
    {
      url: "/faq",
      priority: 0.8,
    },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency:
      route.url === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}
