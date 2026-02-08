'use client';

import { useSearchBox } from 'react-instantsearch';

function AlgoliaSearchBox({
  query,
  isSearchStalled,
  refine,
}: {
  query: string;
  isSearchStalled: boolean;
  refine: (value: string) => void;
}) {
  return (
    <form noValidate action="" role="search" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="w-full space-y-1 dark:text-gray-100">
        <label htmlFor="algolia_search" className="hidden">
          Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              fill="currentColor"
              viewBox="0 0 512 512"
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
            >
              <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z" />
            </svg>
          </span>
          <input
            id="algolia_search"
            type="search"
            name="Search"
            placeholder="Search..."
            className="w-full py-2.5 pl-10 pr-10 text-sm rounded-lg border border-gray-300 bg-white dark:bg-mybg-900 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent dark:focus:ring-accent dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={query}
            onChange={(event) => refine(event.currentTarget.value)}
          />
          {/* Loading spinner */}
          {isSearchStalled && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
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
            </span>
          )}
          {/* Clear button */}
          {query && !isSearchStalled && (
            <button
              type="button"
              onClick={() => refine('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

export default function CustomSearchBox() {
  const { query, refine, isSearchStalled } = useSearchBox();
  return <AlgoliaSearchBox query={query} refine={refine} isSearchStalled={isSearchStalled} />;
}
