import { notFound } from 'next/navigation';
import EditorialPage, { editorialMetadata } from '@/components/EditorialPage';
import { COMPANY_PAGES, CONTACT } from '@/lib/company-pages';
export const dynamicParams = false;
export function generateStaticParams() { return COMPANY_PAGES.map(p => ({ info: p.slug })); }
export function generateMetadata({ params }) { const p = COMPANY_PAGES.find(p => p.slug === params.info); return p ? editorialMetadata(p.title, p.description, `/${p.slug}`) : {}; }
export default function InfoPage({ params }) {
  const p = COMPANY_PAGES.find(p => p.slug === params.info);
  if (!p) notFound();
  return <EditorialPage title={p.title} description={p.description} path={`/${p.slug}`}>{p.sections.map(s => <section className="lp-section" key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(t => <p key={t}>{t}</p>)}</section>)}<section className="lp-section"><h2>Contact {CONTACT.name}</h2><p><a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a><br /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p></section></EditorialPage>;
}
