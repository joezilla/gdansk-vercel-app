/**
 * JSON-LD structured data generators for SEO
 */

const SITE_URL = 'https://www.streetsofdanzig.com';
const SITE_NAME = 'Streets of Danzig';

export function websiteJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'de' ? 'Die Straßen von Danzig' : 'The Streets of Danzig',
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale === 'de' ? 'de' : 'en',
    description: locale === 'de'
      ? 'Entdecken Sie die reiche Geschichte und Kultur von Danzig durch seine Straßen, Menschen und Geschichten.'
      : 'Explore the rich history and culture of Danzig through its streets, people, and stories.',
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function streetJsonLd(opts: {
  germanName: string;
  polishNames?: string[];
  previousNames?: string;
  description: string;
  locale: string;
  slug: string;
  lat?: number;
  lon?: number;
  imageUrl?: string;
  districtName?: string;
}) {
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.germanName,
    description: opts.description,
    url: `${SITE_URL}/${opts.locale}/streets/${opts.slug}`,
  };

  if (opts.polishNames?.length) {
    jsonLd.alternateName = opts.polishNames;
  }
  if (opts.lat && opts.lon) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: opts.lat,
      longitude: opts.lon,
    };
  }
  if (opts.imageUrl) {
    jsonLd.image = opts.imageUrl;
  }
  if (opts.districtName) {
    jsonLd.containedInPlace = {
      '@type': 'Place',
      name: opts.districtName,
    };
  }

  return jsonLd;
}

export function districtJsonLd(opts: {
  name: string;
  polishName?: string;
  description: string;
  locale: string;
  slug: string;
}) {
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}/${opts.locale}/districts/${opts.slug}`,
    containedInPlace: {
      '@type': 'City',
      name: 'Gdańsk',
      alternateName: 'Danzig',
    },
  };

  if (opts.polishName) {
    jsonLd.alternateName = opts.polishName;
  }

  return jsonLd;
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  locale: string;
  slug: string;
  datePublished?: string;
  imageUrl?: string;
}) {
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${SITE_URL}/${opts.locale}/posts/${opts.slug}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (opts.datePublished) {
    jsonLd.datePublished = opts.datePublished;
  }
  if (opts.imageUrl) {
    jsonLd.image = opts.imageUrl;
  }

  return jsonLd;
}

export function JsonLdScript({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
