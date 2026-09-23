/** Resolve the real family name next/font generated for a CSS variable like --font-display. */
export function fontFamily(variable, fallback = 'sans-serif') {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** Resolves once the given faces are ready to draw with (or after a short timeout). */
export async function fontsReady(specs) {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = specs.map((spec) => document.fonts.load(spec).catch(() => null));
  await Promise.race([Promise.all(loads), new Promise((resolve) => setTimeout(resolve, 2500))]);
}
