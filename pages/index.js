import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import IndexModule from '../components/indexmodule'
import { getAllPostsForHome, getAllStreets } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import StreetSummary from '../components/street-summary'
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import common_en from '../i18n/en/common.json'

const searchClient = algoliasearch(
  '8YAT2UHBPJ',
  '9f21f2b327d6f0e944f5276b1445aa51'
);

export default function Index({ preview, allPosts, allStreets }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  const firstStreet = allStreets[0]
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Intro />
          <StreetSummary content={firstStreet} />
          <h1>{firstStreet.germanName}</h1>
          <div>
          </div>
          <InstantSearch
            indexName="dev_danzig"
            searchClient={searchClient}
          >
            <SearchBox />
            <Hits />
          </InstantSearch>

          <p />
          <IndexModule> 

          </IndexModule>

        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = true }) {
  const allPosts = (await getAllPostsForHome(preview)) ?? []
  const allStreets = (await getAllStreets(preview)) ?? []
  return {
    props: { preview, allPosts, allStreets },
  }
}
