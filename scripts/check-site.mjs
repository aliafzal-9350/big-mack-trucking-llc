import assert from 'node:assert/strict';

const [origin, canonicalOrigin] = process.argv.slice(2);
assert(origin && canonicalOrigin, 'Usage: node scripts/check-site.mjs http://localhost:PORT https://canonical-domain');
const get = async path => {
  const response = await fetch(new URL(path, origin), { redirect: 'manual' });
  return { status: response.status, text: await response.text() };
};
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200, 'Sitemap must be served without a redirect');
const locations = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert(locations.length > 1, 'Sitemap must include content pages');
assert.equal(new Set(locations).size, locations.length, 'Duplicate sitemap URLs');
const paths = new Set(locations.map(url => {
  assert.equal(new URL(url).origin, canonicalOrigin, `Wrong sitemap host: ${url}`);
  return new URL(url).pathname;
}));
const internal = new Set();
const warnings = [];
for (const path of paths) {
  const { status, text } = await get(path);
  assert.equal(status, 200, `${path} must not redirect or error`);
  assert.equal((text.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: expected one H1`);
  const canonical = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  assert(canonical, `${path}: missing canonical`);
  assert.equal(new URL(canonical).href, `${canonicalOrigin}${path}`, `${path}: canonical`);
  const ogUrl = text.match(/<meta[^>]*property="og:url"[^>]*content="([^"]+)"/i)?.[1];
  assert(ogUrl, `${path}: missing Open Graph URL`);
  assert.equal(new URL(ogUrl).href, new URL(canonical).href, `${path}: Open Graph URL differs from canonical`);
  assert(/<meta[^>]*property="og:image"/.test(text), `${path}: missing sharing image`);
  assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(text), `${path}: unexpectedly noindex`);
  const title = text.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title, `${path}: missing title`);
  const description = text.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  assert(description, `${path}: missing description`);
  if (title.length > 75) warnings.push(`${path}: title ${title.length} characters (HTML encoded)`);
  for (const match of text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
  for (const match of text.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url = new URL(match[1].replace(/&amp;/g, '&'), canonicalOrigin);
    if (url.origin === canonicalOrigin) internal.add(url.pathname);
  }
}
for (const path of internal) {
  const result = await get(path);
  assert.equal(result.status, 200, `Internal link ${path} is broken or redirects`);
  assert(paths.has(path), `Linked content page missing from sitemap: ${path}`);
}
const robots = await get('/robots.txt');
assert.equal(robots.status, 200);
assert(robots.text.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'Robots must point to the canonical sitemap');
const missing = await get('/this-page-does-not-exist');
assert.equal(missing.status, 404, 'Unknown URLs must return a real 404');
assert(/href="\//.test(missing.text), '404 must include navigation');
console.log(JSON.stringify({ origin, sitemapPages: paths.size, internalPaths: internal.size, warnings, result: 'PASS' }, null, 2));
