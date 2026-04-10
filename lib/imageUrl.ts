/**
 * Normalizes a Contentful image URL to an absolute https:// URL.
 * Contentful returns protocol-relative URLs (//images.ctfassets.net/...).
 * Next.js Image component requires absolute URLs.
 *
 * In file-backend mode (CONTENTFUL_BACKEND=file), rewrites
 * images.ctfassets.net URLs to a local route handler that serves
 * from the cached export directory. This fully bypasses the
 * Contentful CDN.
 */
export function normalizeContentfulImageUrl(url: string | undefined): string {
  if (!url) return '';

  // Convert protocol-relative → absolute https
  const absolute = url.startsWith('//') ? `https:${url}` : url;

  // File backend: rewrite to local cached route
  const backend = (process.env.CONTENTFUL_BACKEND ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase();
  if (backend === 'file') {
    const match = absolute.match(/^https?:\/\/images\.ctfassets\.net\/(.+)$/);
    if (match) return `/cached-assets/${match[1]}`;
  }

  return absolute;
}
