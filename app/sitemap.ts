import type { MetadataRoute } from "next";

const baseUrl = "https://wholelegacy.com";

const publicRoutes = [
  "",
  "/digital-legacy",
  "/private-document-storage",
  "/memory-vault",
  "/family-archive",
  "/life-story",
  "/digital-inheritance",
  "/private-documents-and-memories",
  "/faq",
  "/security",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
