# WHOLEGACY GEO / AI SEO Implementation

This repository has been optimized to improve machine-readable positioning for:
- private document storage
- digital memory vault
- family digital archive
- life story preservation
- digital legacy
- digital inheritance

## Added public routes

- `/digital-legacy`
- `/private-document-storage`
- `/memory-vault`
- `/family-archive`
- `/life-story`
- `/digital-inheritance`
- `/private-documents-and-memories`
- `/faq`
- `/security`
- `/about`

## Technical changes

- Expanded generated sitemap.
- Removed conflicting static `app/sitemap.xml`.
- Added crawler rules for Googlebot, Bingbot and OAI-SearchBot.
- Private `/p/` and `/private-note/` routes are excluded from crawling.
- Added Organization, WebSite and SoftwareApplication JSON-LD.
- Added WebPage JSON-LD to GEO landing pages.
- Added FAQPage JSON-LD to the FAQ page.
- Added canonical URLs and improved metadata.
- Added a crawlable entity definition to the homepage.

## Important security note

`noindex` and `robots.txt` are not security controls. Private user content must still be protected by server-side authentication and authorization.

## Before deploying

Run:

```bash
npm install
npm run build
```

Then verify:

- `/robots.txt`
- `/sitemap.xml`
- `/digital-legacy`
- `/private-document-storage`
- `/memory-vault`
- `/family-archive`
- `/life-story`
- `/digital-inheritance`
- `/private-documents-and-memories`
- `/faq`
- `/security`
- `/about`

After deployment, submit the sitemap to Google Search Console and Bing Webmaster Tools.
