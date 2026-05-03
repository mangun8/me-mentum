import type { MetadataRoute } from 'next';
import { PROGRAMS, INSIGHTS_ARTICLES } from '../constants';

const BASE = 'https://mementum.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const programPages: MetadataRoute.Sitemap = Object.values(PROGRAMS).map((p) => ({
    url: `${BASE}/program/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const insightPages: MetadataRoute.Sitemap = INSIGHTS_ARTICLES.map((a) => ({
    url: `${BASE}/insights/${a.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...programPages, ...insightPages];
}
