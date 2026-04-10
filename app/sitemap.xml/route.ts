import { getContentfulLoader } from '../../lib/contentful'
import { createPostURL, createStreetURL, createDistrictURL } from '../../lib/urlutil';

const SITE_URL = 'https://www.streetsofdanzig.com';
const LOCALES = ['en', 'de'] as const;

export async function GET() {
  const sitemap = await generateSitemap();

  return new Response(sitemap, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}

function urlEntry(loc: string) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
  </url>`;
}

async function generateSitemap() {
  // Long TTL — sitemap only needs to regenerate when content list changes.
  // List-tag invalidation (streets-list, posts-list, districts-list) is
  // handled automatically by the webhook.
  const loader = getContentfulLoader(60 * 60 * 24);
  const [allStreets, allPosts, allDistricts] = await Promise.all([
    loader.getAllStreets().then(s => (s ?? []).filter(Boolean)),
    loader.getAllPosts().then(p => (p ?? []).filter(Boolean)),
    loader.getAllDistricts().then(d => (d ?? []).filter(Boolean)),
  ]);

  const staticPages = LOCALES.flatMap(locale => [
    urlEntry(`/${locale}`),
    urlEntry(`/${locale}/streets/all`),
    urlEntry(`/${locale}/districts/all`),
  ]);

  const streetPages = allStreets.flatMap(({ slug }) =>
    LOCALES.map(locale => urlEntry(createStreetURL(slug, locale)))
  );

  const postPages = allPosts.flatMap(({ slug }) =>
    LOCALES.map(locale => urlEntry(createPostURL(slug, locale)))
  );

  const districtPages = allDistricts.flatMap(({ slug }) =>
    LOCALES.map(locale => urlEntry(createDistrictURL(slug, locale)))
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...streetPages, ...districtPages, ...postPages].join('\n')}
</urlset>`;
}
