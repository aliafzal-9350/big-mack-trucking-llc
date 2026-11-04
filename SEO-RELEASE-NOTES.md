# SEO and inquiry improvements — 4 November 2026

This release improves discovery, useful content and freight inquiry handling. Live publication requires verification after the GitHub push; these changes do not establish an increase in traffic, revenue or AdSense eligibility.

## Projects

| Site | Local project | Changes |
| --- | --- | --- |
| Umaja Logistics | `C:\Users\User\Desktop\trucking` | Updated page-specific search and sharing metadata, shorter article search titles, matching canonical and Open Graph URLs, a pallet calculator, links to the calculator, and corrected sitemap modification dates. |
| Cargo Kings | `C:\Users\User\Desktop\trucking 2` | Canonical metadata, sharing images, organization data, sitemap and robots routes, two freight guides, company/contact/privacy/terms pages, footer links, proper 404 navigation and repaired quote handling. |
| Big Mack Trucking | `C:\Users\User\Desktop\trucking 3` | Canonical www host across metadata and sitemap, shorter service/area titles, corrected business image, organization data without an invented address, two guides, company/contact/privacy/terms pages, footer links, proper 404 navigation and repaired quote handling. |

Umaja was first fast-forwarded from the clean local commit `5ab2fa3` to the existing origin/main commit `6e82750`, bringing the checkout up to date with its current resource pages and layout. Changes are based on that newer source, not the obsolete single-page checkout.

The existing homepage layouts, fonts, 3D canvas implementations and animations were retained. Cargo Kings' client homepage moved into `components/HomePage.jsx` so its server page can publish canonical metadata. Its input labels now identify their fields. Resource content uses each site's existing visual language.

## New useful content

- Umaja: `/tools/pallet-calculator`. Uniform-grid pallet planning with editable dimensions, requested count, gross pallet weight, optional confirmed payload and door clearance. Explicitly excludes stacking, mixed layouts, axle distribution and final equipment approval. Linked from resources and the existing capacity guide.
- Cargo Kings: `/resources/electric-pallet-jack-freight-delivery` and `/resources/expedited-freight-quote-checklist`.
- Big Mack: `/resources/liftgate-delivery-site-checklist` and `/resources/dedicated-box-truck-vs-ltl`.

No city-page expansion, copied articles across the three domains, fabricated testimonials, invented shipment results or paid backlink campaigns were added.

## Inquiry handling

Big Mack previously posted to `YOUR_FORM_ID`, an unconfigured endpoint. Cargo Kings previously displayed a received confirmation without sending the request anywhere. Both now prepare an addressed email containing the entered shipment details, explain that the visitor must send that email, retain/edit the details, and provide direct dispatch contact alternatives. No message was sent during verification. Direct server-side form delivery would need an approved email/form service and its configuration.

## Verification

- Final production builds passed for all three projects.
- Rendered HTTP checks passed for 44 sitemap pages: Umaja 18, Cargo Kings 8, Big Mack 18.
- Checks cover successful page responses, canonical hosts, canonical/Open Graph agreement, sharing images, one H1, structured-data JSON parsing, internal links, sitemap membership, robots sitemap references, and real 404 responses with navigation.
- Desktop (1440px) and mobile (390px) browser checks cover home/resource layout overflow, quote-form required-field validation and runtime exceptions. The calculator was exercised in the browser, including invalid input, overweight results and reset.
- Calculator logic tests cover normal and rotated layouts, insufficient floor space, payload, clearance, invalid inputs and missing optional limits.
- Big Mack quote-email logic was checked for correct recipient, equipment flags and special-character encoding. Email delivery itself is not claimed or tested.

Run from each project after a production build and starting its local server:

```text
node scripts/check-site.mjs http://127.0.0.1:PORT https://CANONICAL-HOST
```

Umaja also includes:

```text
node scripts/test-pallet-fit.mjs
```

## Publication and measurement

The connected Vercel tool returned no accessible teams and `vercel whoami` reported logged out. No deployment was attempted directly through Vercel. A Git-connected host may deploy automatically when main is pushed; check its deployment status and confirm the existing project/domain mapping before treating the release as live. Do not create replacement projects or alter DNS.

After publication, verify the live URLs and submit these canonical sitemaps in the matching Search Console properties:

- `https://umajalogistics.online/sitemap.xml`
- `https://www.cargokingsinc.com/sitemap.xml`
- `https://www.bigmacktrucking.com/sitemap.xml`

Record a Search Console baseline by page/query/country, then compare organic clicks, impressions and freight inquiries over comparable periods. Ahrefs traffic figures are estimates, not visitor counts or earnings. Actual keyword volume and competitor opportunities still require the user's Ahrefs reports; none were invented for these changes.

Umaja remains in the AdSense review process according to the supplied screenshot. No AdSense code was added to the other sites. Review outstanding AdSense account tasks and consent configuration before activating ads. The existing Umaja model attribution names a noncommercial license; separate commercial permission has not been established in this task. The model was retained to avoid changing the requested 3D experience.
