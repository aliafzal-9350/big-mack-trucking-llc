import { notFound } from 'next/navigation';
import EditorialPage, { editorialMetadata } from '@/components/EditorialPage';
import { RESOURCES } from '@/lib/resources';
export const dynamicParams = false;
export function generateStaticParams() { return RESOURCES.map(r => ({ slug: r.slug })); }
export function generateMetadata({ params }) { const r = RESOURCES.find(r => r.slug === params.slug); return r ? editorialMetadata(r.title, r.description, `/resources/${r.slug}`) : {}; }
export default function Resource({ params }) {
  const r = RESOURCES.find(r => r.slug === params.slug);
  if (!r) notFound();
  return <EditorialPage title={r.title} description={r.description} path={`/resources/${r.slug}`} article>{r.sections.map(s => <section className="lp-section" key={s.heading}><h2>{s.heading}</h2>{s.paragraphs?.map(p => <p key={p}>{p}</p>)}{s.list ? <ul className="lp-list">{s.list.map(p => <li key={p}>{p}</li>)}</ul> : null}</section>)}</EditorialPage>;
}
