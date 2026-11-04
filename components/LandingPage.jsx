import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import { AREAS, BUSINESS, SERVICES, landingJsonLd, toJsonLd } from '@/lib/seo';
import logo from '@/public/image/logo-transparent.png';

// One template for every service and service-area page: a light, text-first page with no 3D,
// so it loads fast on phones and gives search engines plain HTML to read. Visual language
// (fonts, tokens, buttons, footer) is shared with the homepage.
export default function LandingPage({ page, kind }) {
  const base = kind === 'service' ? '/services' : '/service-areas';
  const path = `${base}/${page.slug}`;
  const related = kind === 'service' ? SERVICES : AREAS;
  const other = kind === 'service' ? AREAS : SERVICES;
  const otherBase = kind === 'service' ? '/service-areas' : '/services';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(landingJsonLd(page, path, kind)) }} />

      <header className="lp-top">
        <Link href="/" className="lp-brand">
          <Image src={logo} alt="" width={44} height={44} priority />
          <span>{BUSINESS.shortName}</span>
        </Link>
        <a href={BUSINESS.phoneHref} className="button button-quiet lp-call">
          {BUSINESS.phoneDisplay}
        </a>
      </header>

      <main className="lp">
        <nav className="lp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{page.name}</span>
        </nav>

        <article>
          <header className="lp-head">
            <p className="lp-eyebrow">{kind === 'service' ? 'Service' : 'Service area'}</p>
            <h1>{page.h1}</h1>
            <p className="lp-lede">{page.lede}</p>
            <div className="lp-actions">
              <Link href="/#book" className="button button-primary">
                Get a quote
              </Link>
              <a href={BUSINESS.phoneHref} className="button button-quiet">
                Call {BUSINESS.phoneDisplay}
              </a>
            </div>
            <ul className="lp-creds" aria-label="Operating authority">
              <li>USDOT {BUSINESS.usdot}</li>
              <li>MC {BUSINESS.mc}</li>
              <li>TWIC certified</li>
              <li>Dispatch 24/7</li>
            </ul>
          </header>

          {page.places ? (
            <section className="lp-section">
              <h2>Where we pick up and deliver</h2>
              <ul className="lp-tags">
                {page.places.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {page.sections.map((section) => (
            <section key={section.heading} className="lp-section">
              <h2>{section.heading}</h2>
              {section.body?.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              {section.list ? (
                <ul className="lp-list">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.specs ? (
                <dl className="lp-specs">
                  {section.specs.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ))}

          <section className="lp-section">
            <h2>Questions</h2>
            <div className="lp-faq">
              {page.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="lp-cta">
            <h2>Tell dispatch what&apos;s moving.</h2>
            <p>Pickup, delivery, pallet count and weight. Rates are confirmed by phone or email, day or night.</p>
            <div className="lp-actions">
              <Link href="/#book" className="button button-primary">
                Get a quote
              </Link>
              <a href={`mailto:${BUSINESS.email}`} className="button button-quiet">
                Email dispatch
              </a>
            </div>
          </section>

          <nav className="lp-related" aria-label="Related pages">
            <div>
              <h2>{kind === 'service' ? 'More services' : 'More service areas'}</h2>
              <ul>
                {related
                  .filter((r) => r.slug !== page.slug)
                  .map((r) => (
                    <li key={r.slug}>
                      <Link href={`${base}/${r.slug}`}>{r.name}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h2>{kind === 'service' ? 'Service areas' : 'Services'}</h2>
              <ul>
                {other.map((r) => (
                  <li key={r.slug}>
                    <Link href={`${otherBase}/${r.slug}`}>{r.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}

export function landingMetadata(page, kind) {
  const path = `${kind === 'service' ? '/services' : '/service-areas'}/${page.slug}`;
  const labels = {
    'expedited-freight': 'Expedited Box Truck Freight',
    'liftgate-delivery': 'Liftgate Delivery Service',
    '26ft-dock-high-box-truck': '26 ft Dock-High Box Truck',
    'twic-port-trucking': 'TWIC Port & Terminal Trucking',
    'air-cargo-recovery': 'JFK & Newark Air Cargo Recovery',
    'pallet-delivery': 'Direct Pallet Delivery',
    'new-york-city': 'NYC Box Truck Freight Delivery',
    'long-island': 'Long Island Box Truck Freight',
    'new-jersey': 'New Jersey Box Truck Freight',
    'nationwide': 'Nationwide Expedited Box Truck',
  };
  const title = `${labels[page.slug] ?? page.name} | Big Mack Trucking`;
  return {
    title: { absolute: title },
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: page.description,
      url: path,
      siteName: BUSINESS.name,
      locale: 'en_US',
      type: 'website',
      // Child openGraph replaces the root one wholesale, so the share card must be restated.
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: BUSINESS.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.description,
      images: ['/opengraph-image.png'],
    },
  };
}
