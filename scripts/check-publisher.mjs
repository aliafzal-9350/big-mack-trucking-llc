import assert from 'node:assert/strict';

const [origin, adsMode = 'off'] = process.argv.slice(2);
assert(['on', 'off'].includes(adsMode), 'Ad mode must be on or off');
assert(origin, 'Usage: node scripts/check-publisher.mjs https://site');
const get = async path => {
  const r = await fetch(new URL(path, origin));
  return { status: r.status, text: await r.text(), type: r.headers.get('content-type') };
};
const ads = await get('/ads.txt');
assert.equal(ads.status, 200);
assert(ads.type.includes('text/plain'));
assert.equal(ads.text.trim(), 'google.com, pub-1895109224491741, DIRECT, f08c47fec0942fa0');
const sitemap = await get('/sitemap.xml');
const paths = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const titles = new Set();
const descriptions = new Set();
const rows = [];
for (const path of paths) {
  const { status, text } = await get(path);
  assert.equal(status, 200, path);
  assert(text.includes('name="google-adsense-account" content="ca-pub-1895109224491741"'), `${path}: ownership metadata`);
  assert.equal(/<script[^>]*src="[^"]*adsbygoogle\.js/.test(text), adsMode === 'on', `${path}: unexpected ad-script state`);
  const title = text.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = text.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  assert(!titles.has(title), `${path}: duplicate title`);
  assert(!descriptions.has(description), `${path}: duplicate description`);
  titles.add(title); descriptions.add(description);
  const content = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const main = content.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || content;
  const words = main.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  for (const [, fragment] of text.matchAll(/href="#(section-\d+)"/g)) assert(text.includes(`id="${fragment}"`), `${path}: broken contents link`);
  rows.push({ path, title, mainWordsApprox: words });
}
assert(paths.includes('/editorial-policy'));
console.log(JSON.stringify({ origin, pages: paths.length, checks: 'Unique metadata, ads.txt, ownership, expected ad-script state, guide anchors: PASS', pagesInspected: rows }, null, 2));
