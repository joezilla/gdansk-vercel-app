'use client';

import { useState, useMemo } from 'react';
import { StreetSummary } from '../../../lib/contentmodel/wrappertypes';
import Link from 'next/link'
import { createStreetURL } from '../../../lib/urlutil';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

type AllStreetsProps = {
  streets: StreetSummary[]
}

export function StreetOverview(props: AllStreetsProps) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreets = useMemo(() => {
    let filtered = props.streets;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.germanName.toLowerCase().includes(q) ||
        s.polishNames?.some(p => p.toLowerCase().includes(q))
      );
    }

    if (activeLetter) {
      filtered = filtered.filter(s => s.germanName.trim().charAt(0).toUpperCase() === activeLetter);
    }

    return filtered.sort((a, b) => a.germanName.localeCompare(b.germanName));
  }, [props.streets, activeLetter, searchQuery]);

  const availableLetters = useMemo(() => {
    const set = new Set(props.streets.map(s => s.germanName.trim().charAt(0).toUpperCase()));
    return set;
  }, [props.streets]);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-12 sticky top-[72px] z-40">
        <div className="bg-surface-container-lowest shadow-sm p-6 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative w-full lg:flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <label htmlFor="street-filter" className="sr-only">Filter streets</label>
            <input
              id="street-filter"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-lg font-body placeholder:text-on-surface/40"
              placeholder="Filter by name, old or modern..."
            />
          </div>
        </div>
      </div>

      {/* Alphabetical Index */}
      <div className="flex flex-wrap gap-1 mb-12 border-b border-surface-container pb-6">
        <button
          onClick={() => setActiveLetter(null)}
          className={`w-10 h-10 flex items-center justify-center font-bold font-headline text-sm transition-colors ${
            !activeLetter ? 'text-primary bg-primary-fixed' : 'text-on-surface/40 hover:text-primary'
          }`}
        >
          All
        </button>
        {letters.map(l => (
          <button
            key={l}
            onClick={() => setActiveLetter(activeLetter === l ? null : l)}
            disabled={!availableLetters.has(l)}
            className={`w-10 h-10 flex items-center justify-center font-bold font-headline transition-colors ${
              activeLetter === l
                ? 'text-primary bg-primary-fixed'
                : availableLetters.has(l)
                  ? 'text-on-surface/40 hover:text-primary'
                  : 'text-on-surface/20 cursor-not-allowed'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 px-6 py-4 text-xs font-label text-on-surface/40 uppercase tracking-widest bg-surface-container-low mb-2">
        <div className="col-span-5">Historical Name (Pre-1945)</div>
        <div className="col-span-4">Modern Polish Name</div>
        <div className="col-span-2">District</div>
        <div className="col-span-1 text-right"></div>
      </div>

      {/* Street List */}
      <div className="grid grid-cols-1 gap-1">
        {filteredStreets.map(street => (
          <Link
            key={street.sys.id}
            href={createStreetURL(street.slug)}
            className="group grid grid-cols-1 md:grid-cols-12 items-center px-6 py-6 bg-surface-container-lowest hover:bg-surface-container-high transition-all duration-300 relative border-l-4 border-transparent hover:border-primary"
          >
            <div className="col-span-5 mb-2 md:mb-0">
              <h3 className="text-xl font-headline font-bold text-on-surface">
                {street.germanName}
              </h3>
            </div>
            <div className="col-span-4 mb-2 md:mb-0">
              {street.polishNames?.[0] && (
                <span className="text-base text-tertiary underline underline-offset-4 decoration-tertiary/20">
                  {street.polishNames[0]}
                </span>
              )}
            </div>
            <div className="col-span-2 mb-2 md:mb-0">
              {street.districtRefCollection?.items?.[0] && (
                <span className="inline-flex items-center px-3 py-1 bg-surface-container text-on-surface/60 text-xs font-label rounded-full">
                  {street.districtRefCollection.items[0].slug}
                </span>
              )}
            </div>
            <div className="col-span-1 text-right hidden md:block">
              <svg className="w-5 h-5 text-on-surface/40 group-hover:text-primary transition-colors inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}

        {filteredStreets.length === 0 && (
          <div className="py-12 text-center text-on-surface/50">
            No streets found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
