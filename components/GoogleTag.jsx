// Public tracking IDs are configuration, not secrets. Each site uses its own ID.
const configuredId = (process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? 'GTM-WNJ6ZSD4').trim();
export const GOOGLE_TAG_ID = /^(?:GTM-[A-Z0-9]+|G-[A-Z0-9]+)$/.test(configuredId) ? configuredId : null;

export default function GoogleTag() {
  if (!GOOGLE_TAG_ID) return null;
  const isContainer = GOOGLE_TAG_ID.startsWith('GTM-');
  const source = isContainer ? 'gtm.js' : 'gtag/js';
  const initialize = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${isContainer ? '' : `gtag('config',${JSON.stringify(GOOGLE_TAG_ID)});`}`;

  return <>
    <script id="google-tag-loader" async src={`https://www.googletagmanager.com/${source}?id=${GOOGLE_TAG_ID}`} />
    <script id="google-tag-init" dangerouslySetInnerHTML={{ __html: initialize }} />
  </>;
}
