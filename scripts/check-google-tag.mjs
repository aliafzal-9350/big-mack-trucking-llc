import assert from 'node:assert/strict';
const [origin, expectedId = 'off'] = process.argv.slice(2);
assert(origin, 'Usage: node scripts/check-google-tag.mjs ORIGIN GTM-ID|G-ID|off');
const sitemap = await fetch(new URL('/sitemap.xml', origin)).then(r => r.text());
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
assert(paths.length > 1);
for (const pathname of paths) {
  const r = await fetch(new URL(pathname, origin));
  assert.equal(r.status, 200, pathname);
  const html = await r.text();
  const loaders = [...html.matchAll(/<script\b[^>]*id="google-tag-loader"[^>]*>/g)];
  const inits = [...html.matchAll(/<script\b[^>]*id="google-tag-init"[^>]*>(.*?)<\/script>/gs)];
  assert.equal(loaders.length, expectedId === 'off' ? 0 : 1, `${pathname}: duplicate/missing loader`);
  assert.equal(inits.length, expectedId === 'off' ? 0 : 1, `${pathname}: duplicate/missing initializer`);
  if (expectedId !== 'off') {
    const endpoint = expectedId.startsWith('GTM-') ? 'gtm.js' : 'gtag/js';
    assert(loaders[0][0].includes(`https://www.googletagmanager.com/${endpoint}?id=${expectedId}`));
    assert(html.indexOf(loaders[0][0]) < html.indexOf('</head>'), `${pathname}: loader must be in head`);
    assert(inits[0][1].includes('window.dataLayer=window.dataLayer||[]'));
    if (expectedId.startsWith('GTM-')) assert(!inits[0][1].includes("gtag('config'"), 'GTM owns its destination config');
  }
}
console.log(JSON.stringify({ origin, pages: paths.length, expectedId, checks: 'one correct Google loader/initializer per page, or none while unconfigured: PASS' }, null, 2));
