# SEO and AdSense readiness — 4 November 2026

## Scope and result

Audited the public production sites and their three source projects. Initial HTTP checks covered **all 44 sitemap URLs**: Umaja 18, Cargo Kings 8, Big Mack 18. Firecrawl inspected each rendered homepage and one representative guide per site, including raw head markup. Source inspection covered article templates, privacy pages, company information, ad configuration and model attribution. This is a technical and content audit, not proof of Google indexing, ranking, Core Web Vitals, ad approval or earnings.

| Site | Initial technical checks | Content observation | Remaining approval work |
| --- | --- | --- | --- |
| [Umaja](https://umajalogistics.online/) | 18/18 sitemap pages passed | Eight guides and a working pallet-planning tool; strongest informational coverage of the three | Confirm AdSense status and published consent configuration; use retained ownership metadata/ads.txt for verification |
| [Cargo Kings](https://www.cargokingsinc.com/) | 8/8 passed | Two useful guides, but limited depth beyond equipment and quote preparation | Add site in AdSense, verify ownership, configure consent before ad requests, expand original subject coverage |
| [Big Mack](https://www.bigmacktrucking.com/) | 18/18 passed | Two guides plus service/area pages; service pages serve commercial intent and are not substitutes for an informational library | Add site in AdSense, verify ownership, configure consent before ad requests, expand original subject coverage |

All initial sitemap pages returned 200, had one H1, titles, descriptions, canonical URLs and matching Open Graph URLs. Structured-data JSON parsed. Linked internal content paths resolved and were in the sitemap. Robots files pointed to the canonical sitemap. Unknown URLs returned actual 404 responses with navigation. No title-length warnings were raised by the existing check (75-character threshold). These checks do not certify eligibility for any rich result.

## Findings and implemented changes

| Priority | Finding and evidence | Fix | Verification |
| --- | --- | --- | --- |
| High | Umaja loaded the AdSense ad script, while its privacy text promised a certified consent message. The owner could not confirm that a message was published. | Retain account-verification metadata and ads.txt. Ad-script loading now requires an explicit enable switch; default is off until consent/account setup is checked. Rewrite the unsupported promise. | Check rendered HTML contains the publisher meta tag and no adsbygoogle script; verify consent in AdSense before enabling requests. |
| High | Cargo Kings and Big Mack lacked publisher-verification metadata and ads.txt. Neither had ad scripts. | Add metadata and `/ads.txt` for the existing publisher account, without activating ads. Update privacy text to distinguish verification from advertising. | `scripts/check-publisher.mjs`; select the matching verification method in AdSense. ads.txt is recommended by Google, not a mandatory approval guarantee. |
| Medium | Both two-guide libraries lacked links directly between related articles and contents links. | Add linked contents, heading anchors, related guides, publisher links and guide-policy pages. | Check guide anchors, related links and policy inclusion in sitemap; inspect desktop/mobile rendering. |
| Medium | Publisher/commercial context and correction routes were not explicit in the guide templates. | Add `/editorial-policy` on all three sites, linked in the footer, describing publisher identity, examples, commercial interests and corrections. No external endorsement or expert review is claimed. | Visit each policy and footer; confirm 200 and canonical metadata. |
| Medium | Big Mack's root layout preloaded the truck GLB on every text page. | Move the preload to its homepage. The model is 868,616 bytes; guide visitors should not preload it. | Inspect guide HTML for no truck preload and homepage HTML for the retained preload. |
| Medium | Umaja capacity guide described the CDL threshold without passenger/hazardous-material/combination qualifications. | Replace that simplification with qualified wording and an official FMCSA reference. | Read the updated capacity paragraph and official reference. |
| Low | Umaja article schema had modification dates but the visible article header showed only the publication date. | Show an updated date when it differs from publication. | Inspect the capacity guide header. |
| Low | Umaja quote form promised a quote within 15 minutes without evidence in this audit. | Replace with a request for an availability/rate check. | Inspect the quote-form introduction. |

Homepage visual systems, interactive truck scenes and Big Mack's restored branded loader are retained. Guide/footer additions follow existing styles. An ownership meta tag or ads.txt file does not place an ad.

## Content work that remains valuable

Google prioritizes useful original publisher content; no universal article-count threshold guarantees approval. Do not publish bulk city variants or copy the same guides across these domains.

| Site | Next distinct subjects | First-party material to collect |
| --- | --- | --- |
| Umaja | Improve existing JFK cargo and capacity guides with actual facility instructions and equipment measurements | Original truck/door/liftgate photos, confirmed empty weight/payload, a redacted shipment-planning example |
| Cargo Kings | Electric-jack receiving-path checklist; what changes a quoted expedited rate; damaged pallet acceptance workflow | Original equipment photos, actual equipment ratings, a blank quote checklist, real answers from dispatch |
| Big Mack | Multi-stop box-truck loading order; appointment/waiting-time planning; dock-to-curb handoff example | Original loading photos, a sample stop sheet, an anonymized real route with permission |

Use accurate descriptions, helpful examples and clearly labeled hypothetical scenarios. Have the business owner confirm equipment, credentials, insurance, service availability and any first-person operating claims. Authority numbers on a website are not proof of current FMCSA status. Do not invent shipments, reviews, years of experience or author qualifications.

Umaja's model credit names a noncommercial public license. The owner confirms separate written commercial permission. Retain that permission privately and ensure its scope covers all companies/domains, modifications and assets actually used. Cargo Kings' model files match the Umaja source, and Big Mack's optimization script names the archived Sketchfab source. This audit does not independently validate the permission contract.

## AdSense account steps

1. In **AdSense → Sites**, inspect Umaja's current status. The earlier supplied screenshot showed “Getting ready”; that is historical evidence, not a current account check.
2. Add `cargokingsinc.com` and `bigmacktrucking.com` if absent. Use the **meta tag** or **ads.txt** verification option matching the deployed files. Check the publisher ID against the existing account: `pub-1895109224491741`.
3. In **Privacy & messaging → European regulations**, create/configure the message for the relevant sites and publish it. Configure the required consent options and withdrawal mechanism, then test from the relevant region. Review other region-specific settings for the actual audience. A generic cookie banner is not proof of a Google-certified CMP.
4. Request/review site approval in the account. Resolve any specific policy reason Google reports. Do not delete/re-add a pending site solely to try to speed a review.
5. Before enabling ads, verify the published consent behavior and privacy disclosures. Umaja's ad script can then be enabled with `NEXT_PUBLIC_ADSENSE_ADS_ENABLED=true` in the intended deployment environment and a rebuild. Cargo Kings and Big Mack deliberately have no ad-serving scripts yet; integrate placement only after the account/consent checks, prioritizing guide pages and protecting the freight quote flow.

No review was submitted and no consent message was published by this code change. User account access/configuration is still needed for those actions. Code changes cannot grant Google's approval.

## Search Console and measurement

Submit/confirm these sitemaps in the corresponding existing properties:

- `https://umajalogistics.online/sitemap.xml`
- `https://www.cargokingsinc.com/sitemap.xml`
- `https://www.bigmacktrucking.com/sitemap.xml`

Inspect the homepage and representative resource URLs with URL Inspection. Review **Pages**, **Manual actions**, **Security issues** and **Core Web Vitals**. Record the last 90 days of clicks, impressions, queries, pages and countries; compare equivalent periods after publication. Search Console access has been confirmed by the owner, but its current reports were not available to this audit. No ranking, backlink-quality, search-volume or traffic-growth figures are inferred from crawl results.

Use the personal Ahrefs account's **Site Audit → New crawl** for each verified project. Start with crawl errors, broken internal links, indexability conflicts and duplicate canonicals. Do not buy backlinks based on Domain Rating or referring-domain count. Ahrefs estimates are not measured visitors or income. Use Vercel Analytics for visits and actual freight inquiries for business outcomes. Never buy bot traffic, click your own ads or encourage ad clicks.

## Verification commands

Prepared release verification: all three production builds passed. Full production-preview checks passed for **47 sitemap pages** (Umaja 19, Cargo Kings 9, Big Mack 19), including unique titles/descriptions, ownership metadata, ads.txt and no premature advertising scripts. Desktop browser checks covered the changed Cargo Kings/Big Mack guides and Umaja policy; 390px samples covered Big Mack's guide and Umaja's policy with no horizontal overflow. A Cargo Kings contents link changed to the correct section fragment. No console errors were captured on those three browser pages. These sampled browser checks do not establish every page's accessibility or Core Web Vitals.

From each project, after a production build and starting its production server:

```text
node scripts/check-site.mjs http://127.0.0.1:PORT https://CANONICAL-HOST
node scripts/check-publisher.mjs http://127.0.0.1:PORT
```

`check-publisher` checks unique page titles/descriptions, verification metadata, the publisher ads.txt line, no premature ad scripts, the policy route and contents-link targets. It is for this pre-advertising release; change its ad-script expectation after a verified ad launch. Browser verification covers changed text-page layouts, mobile overflow and contents navigation. Build and deployment outcomes should be reported separately from the initial live audit.

## Official references checked

- [Google: pages ready for AdSense](https://support.google.com/adsense/answer/7299563)
- [Google: low-value or missing publisher content](https://support.google.com/publisherpolicies/answer/11112688)
- [Google: adding and verifying a site](https://support.google.com/adsense/answer/12169212)
- [Google: ads.txt guide](https://support.google.com/adsense/answer/12171612)
- [Google: European regulations messages](https://support.google.com/adsense/answer/10961068)
- [Google Publisher Policies and privacy disclosures](https://support.google.com/adsense/answer/10502938)
- [FMCSA: driver license classifications](https://www.fmcsa.dot.gov/registration/commercial-drivers-license/drivers)
- [OSHA: powered industrial trucks](https://www.osha.gov/powered-industrial-trucks)

Traffic, revenue and approval are not guaranteed. The immediate output is improved technical readiness and a specific account/content follow-up plan.
