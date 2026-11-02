import { AREAS, SERVICES, SITE_URL } from '@/lib/seo';

export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...AREAS.map((a) => ({
      url: `${SITE_URL}/service-areas/${a.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
