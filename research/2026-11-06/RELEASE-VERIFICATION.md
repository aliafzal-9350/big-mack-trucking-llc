# Article release verification — 6 November 2026

Production builds passed for all three projects. Rendered HTTP checks passed for 48 sitemap pages: Umaja 19, Cargo Kings 9, Big Mack 20. Checks cover canonicals, matching Open Graph URLs, indexability, titles/descriptions, one H1 per page, structured-data JSON, internal paths, robots sitemap references and genuine 404 responses. Big Mack's new search title was shortened after the first check raised a length warning; the final build was checked again.

| Article | Approximate words in rendered article, excluding its header/navigation | Result |
| --- | ---: | --- |
| Umaja JFK air cargo guide | 1,545 | PASS |
| Cargo Kings electric pallet jack guide | 1,331 | PASS |
| Big Mack multi-stop delivery guide | 1,240 | PASS |

These are transparent whitespace-based counts after stripping markup, not a ranking target. Local verification also checked `og:type=article`, Article `dateModified=2026-11-06`, visible update dates, unique page metadata, ads.txt and the expected ad-script state. Local previews defaulted to ads off; live Umaja should be checked with the previously confirmed production setting on. The other two sites retain ads off.

Browser samples covered the three changed guides at desktop and 390px widths with no horizontal overflow. Big Mack's contents link reached `#section-5`, with the target near the viewport top. The modified pages use existing layouts and styles. Public Ahrefs human-verification console messages were excluded from local page-error checks; they were not treated as website failures.

Research validation produced 180 unique candidates within each domain's list (60 per domain). Source and evidence-type columns distinguish current owned-homepage phrases from derived candidates. Keyword volume, difficulty, Moz DA and current Google ranking measurements were not fabricated. Current live Ahrefs authority results were obtained only for Umaja and Cargo Kings.

Useful commands, from the corresponding project:

```text
node scripts/check-site.mjs ORIGIN CANONICAL_ORIGIN
node scripts/check-guide-content.mjs ORIGIN /resources/ARTICLE_SLUG
node scripts/check-publisher.mjs ORIGIN off
```

For confirmed live Umaja advertising, use `on` as the last argument to `check-publisher`. Deployment outcomes and live verification are reported separately from these local build/browser checks.
