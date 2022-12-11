import React from 'react';
import { connectPagination } from "react-instantsearch-dom";

/**
 * Up to 10 buttons
 * @param lowerBound 
 * @param upperBound 
 * @param currentRefinement 
 * @param createURL 
 * @returns 
 */
function renderButtons(currentRefinement: number, createURL: any) {  
    // upper and lower bounds for pagination`
    let lowerBound = Math.max(1, currentRefinement - 5);
    let upperBound = Math.max(10, currentRefinement + 5);
    return (
        <>
            {Array.apply(lowerBound, Array(10)).map( (x, index) =>
                    index + 1 === currentRefinement ?
                        <button type="button" title={`Page ${index + 1}`} className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md dark:bg-gray-900 dark:text-violet-400 dark:border-violet-400">{index + 1}</button>
                        :
                        <button type="button" title={`Page ${index + 1}`} className="inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md dark:bg-gray-900 dark:border-gray-800"><a href={createURL(index + 1)}>{index + 1}</a></button>
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
function PaginationRenderer(renderOptions: any, isFirstRender: any) {
    const { nbPages, currentRefinement, refine, createURL } = renderOptions;

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

                {renderButtons(currentRefinement, createURL)}

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
