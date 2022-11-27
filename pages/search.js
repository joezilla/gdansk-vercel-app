import React from 'react';
import Head from 'next/head'
import Container from '../components/container'
import Layout from '../components/layout'
import { getNavigationPosts } from '../lib/api'
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';
import qs from 'qs';
import StreetSearch from '../components/streetsearch';
import { useRouter } from 'next/router';

// //// algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID ?? "undefined",
  process.env.ALGOLIA_ACCESS_TOKEN ?? "undefined");

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = (searchState) =>
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
    indexName: process.env.ALGOLIA_INDEX_NAME ?? "undefined",
  };

export default function Search(props) {

  const [searchState, setSearchState] = React.useState(props.searchState);
  const router = useRouter();
  const debouncedSetState = React.useRef();

  React.useEffect(() => {
    if (router) {
      router.beforePopState(({ url }) => {
        setSearchState(pathToSearchState(url));
      });
    }
  }, [router]);


  return (
    <>
    <Layout preview={props.preview} navigationPosts={props.navigationPosts}>
      <Head>
        <title>Danzig Street Names</title>
      </Head>

      <div className=" flex flex-col justify-left sm:py-6 lg:py-12 lg:flex-row lg:justify-between dark:bg-gray-800 dark:text-white">
        <StreetSearch {...DEFAULT_PROPS}  
            searchState={searchState}
            resultsState={props.resultsState}
            onSearchStateChange={(nextSearchState) => {
              clearTimeout(debouncedSetState.current);

              debouncedSetState.current = setTimeout(() => {
                const href = searchStateToURL(nextSearchState);

                router.push(href, href, { shallow: true });
              }, updateAfter);

              setSearchState(nextSearchState);
            }}
            createURL={createURL}
          />
         </div>
    </Layout>
  </>
  );
}

export async function getServerSideProps({ resolvedUrl }) {
  const preview = false;
  const navigationPosts = (await getNavigationPosts(preview)) ?? []
  
  const searchState = pathToSearchState(resolvedUrl);
  const resultsState = await findResultsState(StreetSearch, {
    ...DEFAULT_PROPS,
    searchState,
  });

  console.log("searchState", searchState);
  console.log("resultsState", resultsState);

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      searchState,
      navigationPosts,
      preview
    },
  };
} 