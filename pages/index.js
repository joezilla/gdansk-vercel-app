import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import StreetOverviewModule from '../components/streetoverview'
import { getHomepagePosts, getAllStreets, getNavigationPosts } from '../lib/api'
import Head from 'next/head'
import algoliasearch from 'algoliasearch/lite';
import common_en from '../i18n/en/common.json'
import Post from './posts/[slug]'
import HeroPost from '../components/hero-post'
import MoreStories from '../components/more-stories'

const searchClient = algoliasearch(
  '8YAT2UHBPJ',
  '9f21f2b327d6f0e944f5276b1445aa51'
);

export default function Index({ preview, allPosts, navigationPosts }) {
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts}>
        <Head>
          <title>Danzig Street Names</title>
        </Head>
        <Container>
         <Intro />
         <HeroPost title={allPosts?.heroPost.title} coverImage={allPosts?.heroPost.coverImage} date={allPosts?.heroPost.date}
                   excerpt={allPosts?.heroPost.excerpt} author={allPosts?.heroPost.author} slug={allPosts?.heroPost.slug} />
          <MoreStories posts={allPosts?.morePosts}/>
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = (await getHomepagePosts(preview)) ?? []
  const navigationPosts = (await getNavigationPosts(preview)) ?? []
  return {
    props: { preview, allPosts, navigationPosts },
    // refresh content once a day
    revalidate: 86400
  }
}
