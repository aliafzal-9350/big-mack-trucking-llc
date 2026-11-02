import { notFound } from 'next/navigation';
import LandingPage, { landingMetadata } from '@/components/LandingPage';
import { SERVICES, findService } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const page = findService(params.slug);
  return page ? landingMetadata(page, 'service') : {};
}

export default function ServicePage({ params }) {
  const page = findService(params.slug);
  if (!page) notFound();
  return <LandingPage page={page} kind="service" />;
}
