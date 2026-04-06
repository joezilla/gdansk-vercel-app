'use client';

import { createPostURL, createStreetURL } from '../../../lib/urlutil';
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl';
import { SearchResultCard } from './searchResultCard';

function getImageUrl(hit: any): string | null {
  if (!hit.images || hit.images.length === 0) return null;
  return normalizeContentfulImageUrl(hit.images[0].url);
}

export default function CustomHit({ hit, lang }: { hit: any; lang: string }) {
  if (hit.type === 'street') {
    return (
      <SearchResultCard
        type="street"
        headline={hit.germanName}
        excerpt={hit.polishNames?.[0] ?? ''}
        targetLink={createStreetURL(hit.slug, lang)}
        imageUrl={getImageUrl(hit)}
        locale={lang}
      />
    );
  }

  if (hit.type === 'post') {
    return (
      <SearchResultCard
        type="post"
        headline={hit.title}
        excerpt={hit.excerpt ?? ''}
        targetLink={createPostURL(hit.slug, lang)}
        imageUrl={getImageUrl(hit)}
        locale={lang}
      />
    );
  }

  return null;
}
