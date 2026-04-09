'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  locale: string;
  placeholder: string;
  buttonLabel: string;
};

export function HeroSearchBar({ locale, placeholder, buttonLabel }: Props) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchPath = `/${locale}/search`;
    if (query.trim()) {
      router.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(searchPath);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label={placeholder} className="flex items-center bg-surface-container-lowest p-2 rounded-lg shadow-2xl">
      <svg className="w-5 h-5 text-outline mx-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <label htmlFor="hero-search" className="sr-only">{placeholder}</label>
      <input
        id="hero-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 text-lg font-body placeholder:text-on-surface/30"
      />
      <button
        type="submit"
        className="bg-primary text-on-primary px-8 py-4 rounded-md font-label font-semibold hover:bg-primary-container transition-colors flex-shrink-0"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
