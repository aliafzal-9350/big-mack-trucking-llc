import Link from 'next/link';
import Image from 'next/image';
import SiteFooter from './SiteFooter';
import { BUSINESS, SITE_URL, toJsonLd } from '@/lib/seo';
import logo from '@/public/image/logo-transparent.png';

export function editorialMetadata(title, description, path) {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: BUSINESS.name, type: 'website', locale: 'en_US', images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: BUSINESS.name }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image.png'] },
  };
}

export default function EditorialPage({ title, description, path, children, article = false }) {
  return <>
    {article ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: title, description, mainEntityOfPage: `${SITE_URL}${path}`, author: { '@type': 'Organization', name: BUSINESS.name, url: SITE_URL }, publisher: { '@id': `${SITE_URL}/#business` }, image: `${SITE_URL}/opengraph-image.png` }) }} /> : null}
    <header className="lp-top"><Link href="/" className="lp-brand"><Image src={logo} alt="" width={44} height={44} /><span>{BUSINESS.shortName}</span></Link><a href={BUSINESS.phoneHref} className="button button-quiet lp-call">{BUSINESS.phoneDisplay}</a></header>
    <main className="lp"><nav className="lp-crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{article ? <><Link href="/resources">Resources</Link><span>/</span></> : null}<span aria-current="page">{title}</span></nav>
      <article><header className="lp-head"><h1>{title}</h1><p className="lp-lede">{description}</p>{article ? <p>Published by {BUSINESS.name}</p> : null}</header>{children}</article>
      <section className="lp-cta"><h2>Have a shipment to plan?</h2><p>Send the pickup, delivery, dimensions and weight. Dispatch confirms availability and rate.</p><div className="lp-actions"><Link className="button button-primary" href="/#book">Request a quote</Link><Link className="button button-quiet" href="/resources">Freight guides</Link></div></section>
    </main><SiteFooter />
  </>;
}
