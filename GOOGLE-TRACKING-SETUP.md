# Google tracking setup — 6 November 2026

The owner requested separate reporting and supplied a distinct container for each site.

| Site | GTM container | GA4 measurement ID found in its published container |
| --- | --- | --- |
| Umaja Logistics | GTM-MG3HSSFH | G-CWWWWPV2S1 |
| Cargo Kings | GTM-TNMN2FZP | G-FJWRXJ6921 |
| Big Mack Trucking | GTM-WNJ6ZSD4 | G-C802QQQC7E |

All three public gtm.js requests returned HTTP 200 and contained the expected measurement ID. This verifies the published containers' visible configuration, not GA4 report receipt or the account's property hierarchy. The owner also supplied stream IDs 16284377911 for Cargo Kings and 16284382625 for Big Mack. Stream IDs are not the IDs installed in the script.

## Configuration

Each site's components/GoogleTag.jsx defaults to its own container. NEXT_PUBLIC_GOOGLE_TAG_ID can override that site's ID; rebuild after changing it on the corresponding Vercel project. Accepted values are a web-container ID (GTM-…) or a GA4 measurement ID (G-…). These identifiers are public, not credentials. An explicit empty value disables the integration.

The component follows Google's current head snippet: one asynchronous script and one data-layer initialization script. Google's older inline loader/noscript pair is documented as a previous version, so it is not installed alongside this snippet. For a direct G-… ID, the component instead loads gtag/js and configures that single ID. With a GTM container, no extra GA4 config call is added: its published Google tag owns that configuration.

The root layout includes the component once so all routes share the site's configuration. Existing Vercel Analytics and AdSense integration are retained as separate services. No custom code sends quote-form entries to Analytics. Privacy disclosures now mention Google measurement. No consent choice, property, tag, trigger, enhanced-measurement setting or GTM workspace version was changed in the Google accounts by this code installation.

## Separate reports

A shared container can route to several destinations using hostname rules, but these sites now use their supplied separate containers. Google recommends a container per website.

Distinct measurement IDs mean distinct web streams. They do not prove that the streams belong to separate GA4 properties. If all three streams were created within one property, its standard property reports may combine them. For fully independent business reporting, select or create a separate GA4 property for each company and ensure its container points to that property's web stream. That account structure was not verified here.

## Account-level checks

1. In Google Analytics, select the intended site's property in the property selector.
2. Open Admin → Data collection and modification → Data streams and confirm the domain and measurement ID match the table.
3. In Google Tag Manager, use Preview / Tag Assistant to verify the expected Google tag and applicable consent states. Align analytics consent with the site's CMP; Umaja's confirmed AdSense consent setup is not proof of every GA4/GTM consent setting.
4. Visit the live website, then check the intended property's Reports → Realtime or DebugView. Loading a container does not alone establish that events reach the correct report. No authenticated Realtime/DebugView result was observed by this installation.
5. Enable or check history-based page changes in GA4 enhanced measurement as appropriate for the Next.js app. Avoid adding a second automatic/manual page-view configuration that counts the same navigation twice.

## Verification

Production builds and server-rendered tag checks are required for all three sites. The checker inspects every sitemap URL for one correctly configured loader and initializer in the head. The browser sample checks the actual Umaja DOM for one loader and its new measurement disclosure. This is installation verification, not a guarantee of account-side reporting or privacy compliance.

Run: node scripts/check-google-tag.mjs ORIGIN GTM-CONTAINER-ID

Official references checked:

- [Google: create a container](https://support.google.com/tagmanager/answer/14842164)
- [Google: install a web container](https://support.google.com/tagmanager/answer/14847097)
- [Google: Analytics properties and web streams](https://support.google.com/analytics/answer/9304153)
- [Google: consent mode setup](https://developers.google.com/tag-platform/security/guides/consent)
