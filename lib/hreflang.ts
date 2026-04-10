/**
 * Generate hreflang alternate links for Next.js generateMetadata.
 *
 * Produces an `alternates` object with:
 *   - canonical pointing to the current locale
 *   - languages map with en, de, and x-default (always points to /en/)
 *
 * Slugs are identical across locales, so the same path works for both.
 *
 * Usage:
 *   export async function generateMetadata({ params }) {
 *     const { lang } = await params;
 *     return {
 *       ...,
 *       alternates: hreflangAlternates(lang, `/streets/${slug}`),
 *     };
 *   }
 */

type Alternates = {
    canonical: string;
    languages: Record<string, string>;
};

/**
 * @param currentLang - The current page's locale (e.g., 'en', 'de')
 * @param subPath - Path after the locale prefix (e.g., '/streets/all', '/streets/foo', '' for home)
 */
export function hreflangAlternates(currentLang: string, subPath: string = ''): Alternates {
    // Normalize subPath — ensure leading slash or empty
    const path = subPath && !subPath.startsWith('/') ? `/${subPath}` : subPath;

    return {
        canonical: `/${currentLang}${path}`,
        languages: {
            'en': `/en${path}`,
            'de': `/de${path}`,
            'x-default': `/en${path}`,
        },
    };
}
