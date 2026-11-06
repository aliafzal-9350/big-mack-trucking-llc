import { AREAS, SERVICES, SITE_URL } from '@/lib/seo';
import { RESOURCES } from '@/lib/resources';
import { COMPANY_PAGES } from '@/lib/company-pages';

export default function sitemap() {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/resources`, changeFrequency: 'monthly', priority: 0.8 },
    ...RESOURCES.map(r => ({ url: `${SITE_URL}/resources/${r.slug}`, ...(r.updated ? { lastModified: new Date(r.updated) } : {}), changeFrequency: 'monthly', priority: 0.7 })),
    ...COMPANY_PAGES.map(p => ({ url: `${SITE_URL}/${p.slug}`, changeFrequency: 'yearly', priority: 0.4 })),
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
