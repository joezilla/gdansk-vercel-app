import React from 'react';

import AlgoliaSearchBox from './algoliaSearchBox';
import AlgoliaHitRenderer from './algoliaHits';
import PaginationRenderer from './pagination';
import RefinementRenderer from './refinementList';

// Import components
import {
  InstantSearch,
  Configure,
  InstantSearchProps,
  RefinementList,
  Pagination
} from 'react-instantsearch-dom';


export function StreetSearch(props : InstantSearchProps & { locale: string, searchState: any, resultsState: any, onSearchStateChange: any, createURL: any } ) {
  const { query } = props.searchState;  
  return (
    <>
      <InstantSearch {...props}>
        <Configure hitsPerPage={12} />
        <div className="container">
          <div className="flex flex-row">
            <aside className="p-6 w-96 dark:bg-mybg-dark dark:text-gray-100">
              <nav className="space-y-4 text-sm">
            
                {/* District */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Stadtteil</h2>
                  <RefinementList attribute='district' />
                </div>
    
              </nav>
            </aside>
            {/* search results */}
            <div className="bg-white dark:bg-mybg-dark">
              <div className="mx-auto px-4 max-w-2xl px-4sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="mx-auto">
                  <AlgoliaSearchBox />
                </div>
                <AlgoliaHitRenderer hit={props.resultsState}/>
              </div>
            </div>
          </div>
          {/* pagination */}
          <div className="w-1/3 mx-auto">
          <Pagination totalPages={2} />


          </div>
        </div>
        {/* misc settings */}
      </InstantSearch>
    </>
  );
}
