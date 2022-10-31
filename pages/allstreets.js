import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import StreetOverviewModule from '../components/streetoverview'
import { getAllPostsForHome, getAllStreets, getNavigationPosts } from '../lib/api'
import Head from 'next/head'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import common_en from '../i18n/en/common.json'

const searchClient = algoliasearch(
  '8YAT2UHBPJ',
  '9f21f2b327d6f0e944f5276b1445aa51'
);

export default function AllStreets({ preview, allStreets, navigationPosts }) {
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts}>
        <Head>
          <title>Danzig Street Names</title>
        </Head>
        <Container>
          <Intro />
          <StreetOverviewModule streets={allStreets}> 
          </StreetOverviewModule>
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allStreets = (await getAllStreets(preview)) ?? []
  const navigationPosts = (await getNavigationPosts(preview)) ?? []
  return {
    props: { preview, allStreets, navigationPosts },
    // refresh content once a day
    revalidate: 86400
  }
}
