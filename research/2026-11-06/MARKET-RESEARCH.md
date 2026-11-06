# Freight SEO research and implementation — 6 November 2026

## What the research supports

The owner clarified the request: one useful **1,000+ word article per site**, plus a keyword research list. This release improves two existing articles and adds one distinct article. It does not put 1,000 keywords into a page or claim that a word count is a ranking factor.

Firecrawl retrieved the three current homepages, four competitor/service benchmarks, official facility/equipment references and six US-oriented search-result samples. Exact queries and direct result URLs are in `search-observations.json`; redirect-wrapper results were excluded from that retained evidence. This is a qualitative competitor and intent study, not a census of the freight market or an estimate of market share.

## Current authority baseline

| Domain | Ahrefs DR | Backlinks | Linking websites | Status |
| --- | ---: | ---: | ---: | --- |
| umajalogistics.online | 0 | 802 | 518 | Live public-checker observation |
| cargokingsinc.com | 0.1 | 869 | 833 | Live public-checker observation |
| bigmacktrucking.com | Not verified | Not verified | Not verified | Human-verification control prevented completion |

**Domain Rating by Ahrefs** — [source and metric explanation](https://ahrefs.com/website-authority-checker/). Observed 6 November 2026. Umaja displayed 3% dofollow for both backlinks and linking websites; Cargo Kings displayed 41% and 42% respectively. URL Rating was not supplied by the free result. These are provider-index measurements, not Google metrics. A large linking-domain count with low DR does not by itself establish spam, a penalty or the need for disavowal.

Moz **Domain Authority (DA)** was not measured. It must not be substituted with Ahrefs DR. No matching Moz/Ahrefs keyword-measurement provider was exposed by Firecrawl discovery. Ahrefs was not signed in in the available browser. The discovered AnswerThePublic free-catalogue workflow returned `not_found` for “box truck.” The official free DR API also requires an account API key; no key was requested, created or exposed. Existing screenshots from 4 November are not reused as current measurements.

## Competitor and intent findings

| Source inspected | Observed content strategy | Application to these sites |
| --- | --- | --- |
| [First Class: JFK cargo trucking](https://truckfirstclass.com/jfk-air-cargo-trucking-company/) | Airport-specific commercial page, credentials, recovery/transfer services, FAQs and quote path | Umaja: explain the release/availability handoff and exact facility checks. Do not copy the competitor’s certifications, reviews, service claims or performance figures. |
| [Jung: box-truck shipping](https://www.junglogistics.com/Services/BoxTruck) | Equipment/service explanations, use cases and liftgate FAQs | Cargo Kings: explain why powered-jack compatibility, operator arrangements and the receiving path must be checked separately. This Wisconsin-focused page is a content benchmark, not evidence of a local NYC market share. |
| [ExpeditedFreight: box trucks](https://www.expeditedfreight.com/box-trucks) | Dedicated transport, equipment fit, applications and quote collection | Compete with clear assigned-equipment checks and shipment detail, not generic claims of urgency. The page discusses different truck sizes; its capacity figures should not be imported into these fleets’ specifications. |
| [Xentra: NJ vans/box trucks](https://www.xentratransport.com/locations/new-jersey-courier-nj/services/vans-box-trucks-liftgate-nj) | Local service intent paired with equipment and delivery conditions | Big Mack: connect its existing NYC/NJ/Long Island service pages to practical multi-stop planning. Do not create city permutations without distinct service information. |

Broad searches for box-truck dedicated routes and equipment returned job boards, owner-operator discussions, rentals/equipment sellers and shipper services together. That is a reason to qualify page intent with **freight, shipment, carrier, delivery, receiving, quote and with driver**, not evidence of keyword volume. Rental, hiring, salary, load-board and start-a-trucking-business intent are excluded from the shipper-focused list.

## Page ownership and implemented work

| Site | Primary article | Intent and change |
| --- | --- | --- |
| Umaja | [/resources/jfk-air-cargo-trucking](https://umajalogistics.online/resources/jfk-air-cargo-trucking) | Improve the established JFK guide with a dispatch packet, availability-versus-arrival explanation, facility verification and a labeled delay example. Update its visible/schema modification date. |
| Cargo Kings | [/resources/electric-pallet-jack-freight-delivery](https://www.cargokingsinc.com/resources/electric-pallet-jack-freight-delivery) | Deepen the established equipment guide with separate capacity checks, operator responsibility, curbside/inside scope, receiving records and booking confirmation. Add an honest update date. Replace the homepage’s unsupported “zero-failure” wording. |
| Big Mack | [/resources/multi-stop-box-truck-delivery-planning](https://www.bigmacktrucking.com/resources/multi-stop-box-truck-delivery-planning) | New stop-sheet, load-access, securement, receiving-window, change-approval and proof-of-delivery guide. Link it through the existing resource index, related-guide sections and sitemap. |

The three editorial subjects serve different questions. Existing URLs are retained where the intent already had a useful page. Article Open Graph types and available publication/modification dates are aligned with the content. Homepage layouts, truck scenes and the restored loader are preserved. No mass keyword blocks, hidden keyword lists or cloned location pages are added.

## How to use the keyword files

`keyword-research.csv` contains **180 curated candidates, 60 per site**, with intent, cluster, target URL, source, evidence type and manual editorial priority. Individual domain files contain the same rows split by site. Three exact phrases were observed in the current owned-homepage text; the other rows are **derived research candidates**, not extracted searches or proof of demand. Sources on derived rows indicate the seed topic, not that the exact query appeared in that source.

Monthly search volume, keyword difficulty and current Google position are intentionally blank. “High” is an editorial fit judgment based on the assigned page and business goal; it is not a measured competition or ranking score. Do not publish the spreadsheet as website copy or create one page for every phrase. Several variants should map to one useful page. Confirm any service-area or equipment implication with dispatch before using it in a commercial claim.

## Rankings and the next measurement

Current Google keyword positions, Search Console clicks/impressions, conversion rates and Moz DA remain unverified. Firecrawl’s numbered result positions are retained only as search-tool observations; they are not a reproducible Google rank baseline. No claim is made that a missing result means a page is unindexed or that a content edit has already increased rankings.

For each property, export Search Console **Performance → Search results → last 3 months → Queries and Pages**, retaining country/device and date context. Inspect the changed article with URL Inspection and confirm the submitted sitemap. Compare the same query/page cohorts after a meaningful observation period; changes over a day or two cannot establish causation.

In the owner’s Ahrefs account, validate the primary commercial and informational clusters. Where the plan permits Keywords Explorer, select United States, inspect matching terms and export volume/KD/intent; remove irrelevant intent before selecting targets. On a free verified-project account, use available Site Explorer/GSC reports for the owned sites and record unavailable fields as unavailable. Check **Referring domains/Backlinks** for relevance and actual link context before treating link counts as useful. No links should be bought just to raise a score.

## AdSense and limitations

The supplied screenshot shows Umaja “Getting ready,” with ads.txt “Authorized”; it does not show approval. Cargo Kings and Big Mack are not listed in that screenshot. Their current account inclusion/status cannot be established from it. This release does not submit reviews or change consent settings. Umaja’s previously confirmed production ad toggle is retained; the publisher check now accepts explicit `on` or `off` modes so tests can reflect the actual setup.

More words alone do not secure AdSense approval. Original utility, accurate business statements, functional navigation and applicable privacy/consent requirements still matter. [Google’s SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) explains that there is no magical word-count target and that meta keywords are not used. [Google’s spam policy](https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing) warns against unnatural keyword repetition and blocks of locations. Traffic, ranking gains, income and approval are not promised.

## Official references used for the writing

- [American Airlines Cargo: JFK facilities](https://www.aacargo.com/AACargo/ua/facilities/JFK) — different facility/service instructions; readers should check current pickup/drop-off details instead of relying on copied opening hours.
- [OSHA: powered industrial trucks](https://www.osha.gov/powered-industrial-trucks) — equipment and workplace hazards and operator-training context, not a substitute for equipment-specific instruction.
- [FMCSA: cargo securement](https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules) — remaining-freight securement context; the article does not invent a tiedown formula.

The research files live outside `public` and are not injected into pages. Production build results, rendered body word counts and final live checks are recorded separately with the release verification.
