'use client';

import { Locale } from "../../../i18n-config";
import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import { Pagination, Hits, Configure, RefinementList } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import CustomSearchBox from './algoliaSearchBox';
import CustomHits from './algoliaHits';
import { I18N } from "../../../lib/i18n";

const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID ?? "undefined",
    process.env.ALGOLIA_ACCESS_TOKEN ?? "undefined");

export default async function Page({ params: { lang }, }:
    { params: { lang: Locale } }) {

    let indexName = lang == "en" ? `${process.env.ALGOLIA_INDEX_NAME}-en-US` : `${process.env.ALGOLIA_INDEX_NAME}-de`;
    let t = new I18N(lang).getTranslator();

    return (<>
        <InstantSearchNext
            searchClient={searchClient}
            indexName={indexName}
            future={{
                preserveSharedStateOnUnmount: true
            }}>
            <Configure hitsPerPage={12} />
            <div className="container">
                {/* Refinement */}
                <div className="flex flex-row">
                    <aside className="p-6 w-96 dark:bg-mybg-dark dark:text-gray-100">
                        <nav className="space-y-4 text-sm">
                            <div className="space-y-2">
                                <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Districts</h2>
                                <RefinementList attribute='district' classNames={
                                    {
                                        list: 'flex flex-col',
                                        item: 'mx-2',
                                        label: 'text-sm uppercase dark:text-gray-400',
                                        count: 'mx-2 text-sm uppercase dark:text-gray-400',
                                        checkbox: 'mx-2'
                                    }
                                } />
                            </div>
                        </nav>
                    </aside>
                    {/* search results */}
                    <div className="bg-white dark:bg-mybg-dark">
                        <div className="mx-auto px-4 max-w-2xl px-4sm:px-6 lg:max-w-7xl lg:px-8">
                            <div className="mx-auto">
                                {/* searchAsYouType={true} */}
                                <CustomSearchBox />
                            </div>
                            <Hits hitComponent={CustomHits} lang={lang}
                                classNames={{
                                    list: 'grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/3 mx-auto">
                    <Pagination classNames={
                        {
                            list: 'flex items-center justify-center mx-auto my-2',
                            item: 'mx-2',
                        }
                    } />
                </div>
            </div>
        </InstantSearchNext>
    </>);
}