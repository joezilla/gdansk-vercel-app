'use client';

import Image from 'next/image';
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl';

type SearchResultCardProps = {
  type: 'street' | 'post';
  headline: string;
  excerpt: string;
  targetLink: string;
  imageUrl: string | null;
  locale: string;
};

export function SearchResultCard(props: SearchResultCardProps) {
  const imageUrl = props.imageUrl ? normalizeContentfulImageUrl(props.imageUrl) : null;

  return (
    <a
      href={props.targetLink}
      className="group flex flex-col bg-surface-container-lowest editorial-shadow overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] w-full bg-surface-container-high overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={props.headline}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-on-surface/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-3 right-3 bg-primary text-on-primary text-[10px] font-label font-bold px-3 py-1 uppercase tracking-widest">
          {props.type}
        </span>
      </div>

      {/* Text section */}
      <div className="p-6">
        <h3 className="text-lg font-headline font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {props.headline}
        </h3>
        {props.excerpt && (
          <p className="text-sm text-on-surface/60 leading-relaxed line-clamp-2">
            {props.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}
