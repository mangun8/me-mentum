import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth', '/dashboard', '/login', '/apply', '/payment'],
      },
    ],
    sitemap: 'https://mementum.me/sitemap.xml',
    host: 'https://mementum.me',
  };
}
