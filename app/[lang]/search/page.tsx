'use client';

// import 'instantsearch.css/themes/satellite.css';


import { Locale } from "../../../i18n-config";
import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import { Pagination, Hits, Configure, RefinementList } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import CustomSearchBox from './algoliaSearchBox';   
import CustomHits from './algoliaHits';

const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID ?? "undefined",
    process.env.ALGOLIA_ACCESS_TOKEN ?? "undefined");

export default async function Page({ params }:
    { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    const indexName = lang == "en" ? `${process.env.ALGOLIA_INDEX_NAME}-en-US` : `${process.env.ALGOLIA_INDEX_NAME}-de`;

    return (<>
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
            <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
                <InstantSearchNext
                    searchClient={searchClient}
                    indexName={indexName}
                    future={{
                        preserveSharedStateOnUnmount: true
                    }}>
                    <Configure hitsPerPage={12} />
                    <div className="container">
                       <div className="flex flex-row">
                            <aside className="p-6 w-1/4 dark:bg-mybg-dark dark:text-gray-100">
                                <nav className="space-y-4 text-sm">
                                    <div className="space-y-2">
                                        <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Districts</h2>
                                        <RefinementList attribute='district' classNames={
                                            {
                                                list: 'flex flex-col',
                                                item: 'mx-2',
                                                label: 'text-sm dark:text-gray-400',
                                                count: 'mx-2 text-sm uppercase dark:text-gray-400',
                                                checkbox: 'mx-2'
                                            }
                                        } />
                                    </div>
                                </nav>
                            </aside>
                            <div className="bg-white dark:bg-mybg-dark w-full">
                                <div className="mx-auto">
                                    <div className="mx-auto ">
                                        <CustomSearchBox classNames={{
                                            root: 'w-full',
                                            input: 'w-full'
                                        }}/>
                                    </div>
                                    <Hits hitComponent={CustomHits}
                                        classNames={{
                                            root: 'w-96',
                                            list: 'w-128',
                                            item: 'w-128 m-2 p-2',

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
            </div>
        </section>
    </>);
}