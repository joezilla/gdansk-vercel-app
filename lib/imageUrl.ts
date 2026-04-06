/**
 * Normalizes a Contentful image URL to an absolute https:// URL.
 * Contentful returns protocol-relative URLs (//images.ctfassets.net/...).
 * Next.js Image component requires absolute URLs.
 */
export function normalizeContentfulImageUrl(url: string | undefined): string {
  if (!url) return '';
  return url.startsWith('//') ? `https:${url}` : url;
}
