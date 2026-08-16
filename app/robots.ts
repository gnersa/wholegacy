import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/p/", "/private-note/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/p/", "/private-note/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/p/", "/private-note/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/p/", "/private-note/"],
      },
    ],
    sitemap: "https://wholelegacy.com/sitemap.xml",
  };
}
