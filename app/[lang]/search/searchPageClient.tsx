'use client';

import { Locale } from '../../../i18n-config';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import React, { useState } from 'react';
import {
  Pagination,
  Hits,
  Configure,
  RefinementList,
  useInstantSearch,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import CustomSearchBox from './algoliaSearchBox';
import CustomHit from './algoliaHits';
import { I18N } from '../../../lib/i18n';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID ?? 'undefined',
  process.env.ALGOLIA_ACCESS_TOKEN ?? 'undefined'
);

function SearchLayout({ lang, t }: { lang: string; t: (key: string) => string }) {
  const { status, results } = useInstantSearch();
  const isLoading = status === 'loading' || status === 'stalled';
  const hasResults = (results?.nbHits ?? 0) > 0;
  const hasQuery = (results?.query?.length ?? 0) > 0;
  const nbHits = results?.nbHits ?? 0;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section>
      <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-24">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-6">
            {t('search.title')}
          </h1>
          <p className="text-lg text-on-surface/60 leading-relaxed max-w-xl">
            {t('search.description')}
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <CustomSearchBox />
        </div>

        {/* Results Count */}
        {hasQuery && !isLoading && (
          <p className="mb-4 text-sm text-on-surface/50">
            {nbHits === 1 ? t('search.resultCountSingular') : t('search.resultCount').replace('{{ count }}', String(nbHits))}
          </p>
        )}

        {/* Main layout: sidebar + results */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-2 text-sm font-medium text-on-surface border border-outline-variant rounded-lg px-4 py-2 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            {sidebarOpen ? t('search.hideFilters') : t('search.showFilters')}
          </button>

          {/* Sidebar */}
          <aside
            className={`w-full md:w-64 lg:w-72 shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}
          >
            <div className="bg-surface-container-low p-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-on-surface/50 mb-3">
                {t('search.districts')}
              </h2>
              <RefinementList
                attribute="district"
                classNames={{
                  list: 'flex flex-col space-y-1',
                  item: '',
                  label:
                    'flex items-center gap-2 text-sm text-on-surface/70 cursor-pointer hover:text-accent',
                  count:
                    'ml-auto text-xs text-on-surface/40 bg-surface-container-high px-1.5 py-0.5 rounded-full',
                  checkbox:
                    'rounded border-outline-variant text-accent focus:ring-accent',
                  selectedItem: 'font-medium',
                }}
              />
            </div>
          </aside>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Loading overlay */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            {/* Empty state (query with no results) */}
            {!isLoading && hasQuery && !hasResults && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-outline mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-on-surface/60">
                  {t('search.noResults')}
                </h3>
                <p className="mt-1 text-sm text-on-surface/50">
                  {t('search.noResultsHint')}
                </p>
              </div>
            )}

            <Hits
              hitComponent={(props: any) => <CustomHit hit={props.hit} lang={lang} />}
              classNames={{
                list: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
              }}
            />
          </div>
        </div>

        {/* Pagination */}
        <nav aria-label="Search results pagination" className="mt-8">
          <Pagination
            classNames={{
              list: 'flex items-center justify-center gap-1',
              item: '',
              link: 'inline-flex items-center justify-center w-9 h-9 text-sm rounded-lg border border-outline-variant text-on-surface bg-surface-container-lowest hover:bg-surface-container-high transition-colors',
              selectedItem: '[&>a]:bg-accent [&>a]:text-on-primary [&>a]:border-accent',
              disabledItem: 'opacity-40 pointer-events-none',
            }}
          />
        </nav>
      </div>
    </section>
  );
}

export default function SearchPageClient({ lang }: { lang: Locale }) {
  const indexName =
    lang === 'en'
      ? `${process.env.ALGOLIA_INDEX_NAME}-en-US`
      : `${process.env.ALGOLIA_INDEX_NAME}-de`;
  const t = new I18N(lang).getTranslator();

  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={indexName}
      future={{ preserveSharedStateOnUnmount: true }}
      routing={{
        stateMapping: {
          stateToRoute(uiState) {
            const indexState = uiState[indexName] || {};
            return {
              q: indexState.query,
              district: indexState.refinementList?.district,
              page: indexState.page,
            };
          },
          routeToState(routeState) {
            return {
              [indexName]: {
                query: routeState.q as string,
                refinementList: {
                  district: routeState.district as string[],
                },
                page: routeState.page as number,
              },
            };
          },
        },
      }}
    >
      <Configure hitsPerPage={12} />
      <SearchLayout lang={lang} t={t} />
    </InstantSearchNext>
  );
}
