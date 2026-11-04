import Link from 'next/link';

export default function NotFound() {
  return <main className="lp"><h1>Page not found</h1><p>This address does not match a page on Big Mack Trucking.</p><div className="lp-actions"><Link className="button button-primary" href="/">Return home</Link><Link className="button button-quiet" href="/resources">Read freight guides</Link></div></main>;
}
