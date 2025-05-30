import React from 'react';
import { connectPagination } from 'instantsearch.js/es/connectors';

// number of pages shown at the bottom. please make this an odd number.
const MAX_PAGES = 7;


/**
 * Render the buttons for the pagination
 * 
 * @param currentRefinement 
 * @param createURL 
 * @param nbPages
 * @returns 
 */
function renderButtons(currentRefinement: number, createURL: (page: number) => string, nbPages: number) {
    // upper and lower bounds for pagination
    const lowerBound = Math.max(1, currentRefinement - 3);
    const upperBound = Math.max(nbPages, currentRefinement + 3);
    const showPages = Math.min(MAX_PAGES, upperBound - lowerBound + 1);

    // console.log("lower bound is " + lowerBound);
    // console.log("current refinement: " + currentRefinement);
    // console.log("nbPages: " + nbPages);
    // console.log("upper bound is " + upperBound);
    // console.log("showPages: " + showPages);

    return (
        <>
            {Array.apply(lowerBound, Array(showPages)).map((x, index) =>
                lowerBound + index === currentRefinement ?
                    <button key={`pg-${index + lowerBound}`} type="button" title={`Page ${index + lowerBound}`} className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md dark:bg-gray-900 dark:text-violet-400 dark:border-violet-400">{index + lowerBound}</button>
                    :
                    <button key={`pg-${index + lowerBound}`} type="button" title={`Page ${index + lowerBound}`} className="inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md dark:bg-gray-900 dark:border-gray-800"><a href={createURL(index + lowerBound)}>{index + lowerBound}</a></button>
            )}
        </>
    );
}

/**
 * Render the pagination
 * @param renderOptions 
 * @param isFirstRender 
 * @returns 
 */
function PaginationRenderer(renderOptions: { nbPages: number, currentRefinement: number, refine: (page: number) => void, createURL: (page: number) => string }, _isFirstRender: unknown) {
    const { nbPages, currentRefinement, createURL } = renderOptions;

    return (
        <>
            { /* 
       indexContextValue: undefined,
  nbPages: 1,
  currentRefinement: 1,
  canRefine: false,
  refine: [Function (anonymous)],
  createURL: [Function (anonymous)]  
    */}
            <div className="flex justify-center space-x-1 py-6 dark:text-gray-100">

                <button title="previous" type="button" className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md dark:bg-gray-900 dark:border-gray-800">
                    {currentRefinement === 1 ?
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        :
                        <a href={createURL(currentRefinement - 1)}>
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </a>
                    }
                </button>

                {renderButtons(currentRefinement, createURL, nbPages)}

                <button title="next" type="button" className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md dark:bg-gray-900 dark:border-gray-800">
                    {currentRefinement === nbPages ?
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        :
                        <a href={createURL(currentRefinement + 1)}>
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </a>
                    }


                </button>


            </div>


        </>
    );
}

export default connectPagination(PaginationRenderer);
