import { MetadataRoute } from 'next'

export default function sitemapIndex(): MetadataRoute.SitemapIndex {
  return [
    {
      url: 'https://www.byluc.in/sitemap.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://www.byluc.in/sitemap/main',
      lastModified: new Date(),
    },
    {
      url: 'https://www.byluc.in/sitemap/blog',
      lastModified: new Date(),
    },
    {
      url: 'https://www.byluc.in/sitemap/projects',
      lastModified: new Date(),
    },
  ]
}