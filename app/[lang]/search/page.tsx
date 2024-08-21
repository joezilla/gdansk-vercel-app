'use client';

import { Locale } from "../../../i18n-config";
import algoliasearch from 'algoliasearch/lite';
import { StreetSearch } from "./streetsearch";
import React from 'react';
import qs from 'qs';
// import { useRouter } from 'next/router';
import { getServerState } from 'react-instantsearch';
import SearchComponent from "./searchComponent";
import { InstantSearch, SearchBox, Pagination, Hits, Configure, RefinementList } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import CustomSearchBox from './algoliaSearchBox';
import CustomHits from './algoliaHits';
import PaginationRenderer from './pagination';
import RefinementRenderer from './refinementList';
import { I18N } from "../../../lib/i18n";

const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID ?? "undefined",
    process.env.ALGOLIA_ACCESS_TOKEN ?? "undefined");

export default async function Page({ params: { lang }, }:
    { params: { lang: Locale } }) {

    let indexName = lang == "en" ? `${process.env.ALGOLIA_INDEX_NAME}-en-US` : `${process.env.ALGOLIA_INDEX_NAME}-de`;
    let t = new I18N(lang).getTranslator();

    return (<>
        <InstantSearchNext searchClient={searchClient} indexName={indexName}>
            <Configure hitsPerPage={12} />
            <div className="container">
                {/* Refinement */}
                <div className="flex flex-row">
                    <aside className="p-6 w-96 dark:bg-mybg-dark dark:text-gray-100">
                        <nav className="space-y-4 text-sm">
                            <div className="space-y-2">
                                <h2 className="text-sm font-semibold tracking-widest uppercase dark:text-gray-400">Districts</h2>
                                <RefinementList attribute='district' />
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
            <Pagination />
          </div>
            </div>
        </InstantSearchNext>
    </>);




    //   const [searchState, setSearchState] = React.useState(pathToSearchState(resolvedUrl));
    //  const router = useRouter();
    // const debouncedSetState = React.useRef<any>();// todo: defaults to undefined type
    // const locale = lang;
    // let indexName = `${process.env.ALGOLIA_INDEX_NAME}-${lang}`;

    // React.useEffect(() => {
    //     if (router) {
    //         router.beforePopState(({ url }) => {
    //             setSearchState(pathToSearchState(url));
    //             return true;
    //         });
    //     }
    // }, [router]);

    /*  let resultsState = foo(lang, resolvedUrl);
      let searchState2 = pathToSearchState(resolvedUrl);
      let p = {
          lang, 
          resolvedUrl,
          searchState2,
          resultsState
      }
      return (
          <>
              <SearchComponent params={p}/>
          </>
      );*/
}


/*

export async function getServerSideProps({ resolvedUrl, locale }: { resolvedUrl: string, locale: string }) {
    const preview = false;
    let loader = new ContentfulLoader(3600, locale);
    const navigationPosts = (await loader.getNavigationPosts()) ?? []
  
    let indexName = `${process.env.ALGOLIA_INDEX_NAME}-${locale}`;
  
    const searchState = pathToSearchState(resolvedUrl);
    const resultsState = await findResultsState(StreetSearch, {
      ...DEFAULT_PROPS,
      searchState,
      indexName,
      locale
    });
  
    return {
      props: {
        resultsState: JSON.parse(JSON.stringify(resultsState)),
        searchState,
        navigationPosts,
        preview,
        locale
      },
    };
  } 

  */