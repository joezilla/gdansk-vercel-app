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
      className="group flex flex-col bg-white dark:bg-mybg-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-mybg-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={props.headline}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-300 dark:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full capitalize">
          {props.type}
        </span>
      </div>

      {/* Text section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent transition-colors">
          {props.headline}
        </h3>
        {props.excerpt && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {props.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}
