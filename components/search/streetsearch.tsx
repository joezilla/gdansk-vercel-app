import React from 'react';

import AlgoliaSearchBox from './algoliaSearchBox';
import AlgoliaHitRenderer from './algoliaHits';
import PaginationRenderer from './pagination';
import RefinementRenderer from './refinementList';

// Import components
import {
  InstantSearch,
  Configure,
  InstantSearchProps
} from 'react-instantsearch-dom';


export function StreetSearch(props : InstantSearchProps) {
  const { query } = props.searchState;
  return (
    <>
      <InstantSearch {...props}>
        <Configure hitsPerPage={12} />
        <div className="container">
          <div className="flex flex-row">
            <aside className="w-full p-6 w-36 sm:w-60 dark:bg-gray-900 dark:text-gray-100">
              <nav className="space-y-4 text-sm">
                {/* City */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Orte</h2>
                  <RefinementRenderer attribute='city' />
                </div>
                {/* District */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Stadtteil</h2>
                  <RefinementRenderer attribute='district' />
                </div>
                {/* Type */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Type</h2>
                  <RefinementRenderer attribute='type' />
                 </div>
              </nav>
            </aside>
            {/* search results */}
            <div className="bg-white dark:bg-gray-800">
              <div className="mx-auto px-4 max-w-2xl px-4sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="mx-auto">
                  {/* searchAsYouType={true} */}
                  <AlgoliaSearchBox />
                </div>
                <AlgoliaHitRenderer />
              </div>
            </div>
          </div>
          {/* pagination */}
          <div className="w-1/3 mx-auto">
            <PaginationRenderer />
          </div>
        </div>
        {/* misc settings */}
      </InstantSearch>
    </>
  );
}
