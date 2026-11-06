import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditorialPage, { editorialMetadata } from '@/components/EditorialPage';
import { RESOURCES } from '@/lib/resources';
export const dynamicParams = false;
export function generateStaticParams() { return RESOURCES.map(r => ({ slug: r.slug })); }
export function generateMetadata({ params }) { const r = RESOURCES.find(r => r.slug === params.slug); return r ? editorialMetadata(r.seoTitle || r.title, r.description, `/resources/${r.slug}`, 'article') : {}; }
export default function Resource({ params }) {
  const r = RESOURCES.find(r => r.slug === params.slug);
  if (!r) notFound();
  return <EditorialPage title={r.title} description={r.description} path={`/resources/${r.slug}`} article published={r.published} updated={r.updated}>
    <nav aria-label="In this guide" className="lp-section"><h2>In this guide</h2><ul>{r.sections.map((s, i) => <li key={s.heading}><a href={`#section-${i + 1}`}>{s.heading}</a></li>)}</ul></nav>
    {r.sections.map((s, i) => <section id={`section-${i + 1}`} style={{ scrollMarginTop: '2rem' }} className="lp-section" key={s.heading}><h2>{s.heading}</h2>{s.paragraphs?.map(p => <p key={p}>{p}</p>)}{s.list ? <ul className="lp-list">{s.list.map(p => <li key={p}>{p}</li>)}</ul> : null}</section>)}
    {r.sources?.length ? <section className="lp-section"><h2>References and equipment checks</h2><p>Use these official references alongside the instructions for the actual equipment and facility.</p><ul>{r.sources.map(s => <li key={s.url}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.name}</a></li>)}</ul></section> : null}
    <section className="lp-section"><h2>Related planning guide</h2><ul>{RESOURCES.filter(other => other.slug !== r.slug).map(other => <li key={other.slug}><Link href={`/resources/${other.slug}`}>{other.title}</Link></li>)}</ul><p>Published by <Link href="/about">{"Big Mack Trucking LLC"}</Link>. <Link href="/editorial-policy">About these guides and corrections</Link>.</p></section>
  </EditorialPage>;
}
