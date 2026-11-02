import { notFound } from 'next/navigation';
import LandingPage, { landingMetadata } from '@/components/LandingPage';
import { AREAS, findArea } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const page = findArea(params.slug);
  return page ? landingMetadata(page, 'area') : {};
}

export default function AreaPage({ params }) {
  const page = findArea(params.slug);
  if (!page) notFound();
  return <LandingPage page={page} kind="area" />;
}
