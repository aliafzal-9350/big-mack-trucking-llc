import Image from 'next/image';
import Link from 'next/link';
import { AREAS, SERVICES } from '@/lib/seo';
import logo from '@/public/image/logo-transparent.png';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image src={logo} alt="Big Mack Trucking LLC" width={72} height={72} />
          <div>
            <p className="footer-name">Big Mack Trucking LLC</p>
            <p>Nationwide expedited dock-high freight. Principal: Omari Headley.</p>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h2>Equipment</h2>
            <ul>
              <li>26-ft dock-high straight box</li>
              <li>3,500-lb hydraulic liftgate</li>
              <li>Onboard pallet jack</li>
              <li>Ratchet straps and E-track</li>
            </ul>
          </div>
          <div>
            <h2>Authority</h2>
            <ul>
              <li>USDOT 3843409</li>
              <li>MC 1398475</li>
              <li>26,000 lb GVWR</li>
              <li>TWIC-certified driver</li>
            </ul>
          </div>
          <div>
            <h2>Dispatch</h2>
            <ul>
              <li>
                <a href="tel:5165088078">(516) 508-8078</a>
              </li>
              <li>
                <a href="mailto:Bigmacklogisticsa1@gmail.com">Bigmacklogisticsa1@gmail.com</a>
              </li>
              <li>Answering 24/7</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Plain links into the service and area pages: how search engines find and weigh them. */}
      <nav className="footer-links" aria-label="Services and service areas">
        <div>
          <h2>Services</h2>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Service areas</h2>
          <ul>
            {AREAS.map((a) => (
              <li key={a.slug}>
                <Link href={`/service-areas/${a.slug}`}>{a.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <nav className="footer-legal" aria-label="Company and resources" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 24px' }}>
        <Link href="/resources">Freight guides</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms">Terms</Link>
      </nav>
      <p className="footer-legal">© {new Date().getFullYear()} Big Mack Trucking LLC. All rights reserved.</p>
    </footer>
  );
}
