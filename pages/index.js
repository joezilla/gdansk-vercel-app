import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import StreetOverviewModule from '../components/streetoverview'
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
  console.log(heroPost);
  const morePosts = allPosts.slice(1)
  const firstStreet = allStreets[0]
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Danzig Street Names</title>
        </Head>

        <Container>
          Hero
          {heroPost}
        </Container>

        <Container>
          <Intro />

          <StreetOverviewModule streets={allStreets}> 

          </StreetOverviewModule>

          <button onClick="topFunction()" id="scrollBtn" title="Go to top">Top</button>

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
