import React from 'react';
import Head from 'next/head'
import { ContentfulLoader } from '../../../lib/contentful'
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';
import qs from 'qs';
import { useRouter } from 'next/router';
import { StreetSearch } from './streetsearch';

// //// algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID ?? "undefined",
  process.env.ALGOLIA_ACCESS_TOKEN ?? "undefined");

const updateAfter = 700;
const createURL = (state: any) => `?${qs.stringify(state)}`;

const pathToSearchState = (path: any) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = (searchState: any) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

// wrap algolia client to
// turn off initial empty requests
const searchClient = {
  ...algoliaClient,
  /* 
  search(requests) {
    console.log("requests", requests);
    if (requests.every(({ params }) => !params.query)) {
      console.log("empty saerch");
      // Here we have to do something else
    }
    return algoliaClient.search(requests);
  },*/
}


const DEFAULT_PROPS = {
  searchClient,
//   indexName: process.env.ALGOLIA_INDEX_NAME + "-en-US" ?? "undefined",
};

export default function Search(props: any) {


  

  const [searchState, setSearchState] = React.useState(props.searchState);
  const router = useRouter();
  const debouncedSetState = React.useRef<any>();// todo: defaults to undefined type
  const locale = props.locale;

  React.useEffect(() => {
    if (router) {
      router.beforePopState(({ url }) => {
        setSearchState(pathToSearchState(url));
        return true;
      });
    }
  }, [router]);

  let indexName = `${process.env.ALGOLIA_INDEX_NAME}-${locale}`;

  return (
    <>
{/*        <Head>
          <DefaultSocialTags title="The Streets of Danzig" description="Danzig | Streets, People, History." />
  </Head> */}
        <div className=" flex flex-col justify-left sm:py-6 lg:py-12 lg:flex-row lg:justify-between dark:bg-mybg-dark dark:text-white">
          <StreetSearch {...DEFAULT_PROPS}
            searchState={searchState}
            indexName={indexName}
            locale={locale}
            resultsState={props.resultsState}
            onSearchStateChange={(nextSearchState) => {
              clearTimeout(debouncedSetState.current);
              let dx = setTimeout(() => {
                const href = searchStateToURL(nextSearchState);

                router.push(href, href, { shallow: true });
              }, updateAfter);
              debouncedSetState.current = dx;
              setSearchState(nextSearchState);
            }}
            createURL={createURL}
          />
        </div>
    </>
  );
}

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
