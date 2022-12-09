// ./components/Search/AlgoliaHits.js
import { connectStateResults } from "react-instantsearch-dom";

import { Hits, HitsProps } from 'react-instantsearch-dom';

function renderImage(hit: any) {
  return (
    hit.images && hit.images.length > 0
      ?
      <img src={hit.images[0].fields?.file?.url}
        alt={hit.images[0].fields?.title} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
      :
      <img src="/images/No-Image-Placeholder.png"
        alt="no picture" className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
  );
}

function AlgoliaHitRenderer({ searchState, searchResults }: { searchState: any, searchResults: any }) {
  const validQuery = true; // searchState.query?.length >= 3;
  console.log("HITRENDERER:  searchResults", searchResults);
  console.log("validQuery", validQuery);
  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && (
        <p>Aw snap! No search results were found.</p>
      )}
      {searchResults?.hits.length > 0 && validQuery && (
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {searchResults.hits.map((hit: any) => (
            <div className="group relative">
              <div className="min-h-40 md:h-40 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
                {renderImage(hit)}
                {/*<img src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg" 
                   alt="Front of men&#039;s Basic Tee in black." class="h-full w-full object-cover object-center lg:h-full lg:w-full" /> */}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 dark:text-white">
                    <a href={`/streets/${hit.germanName}`}>
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      {hit.germanName}
                    </a>
                  </h3>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {hit.polishNames.map((name: string) =>
                      <div className="pr-2" key={name}>{name}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default connectStateResults(AlgoliaHitRenderer);