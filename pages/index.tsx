/**
 * Homepage
 */
import { Layout } from '../components/layout'
import Head from 'next/head'
import { IPost } from '../src/@types/contentful'
import { ContentfulLoader, StreetSummary } from '../lib/contentful'
import { HeroPost } from '../components/posts'
import { MoreStories } from '../components/posts'
import {I18nextProvider} from 'react-i18next'

type HomepageProps = {
  preview?: boolean,
  allPosts: IPost[],
  navigationPosts: IPost[],
  heroPost: IPost
}

export default function Index( props :  HomepageProps) {
  let { navigationPosts, allPosts, preview, heroPost } = props;
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts}>
        <Head>
          <title>Danzig Street Names</title>
        </Head>
        <section className="dark:bg-gray-800 dark:text-gray-100">
          <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
            {heroPost &&
              <HeroPost content={heroPost} />
            }
            <MoreStories content={allPosts} />
          </div>
        </section>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  let loader = new ContentfulLoader();
  const allPosts = (await loader.getHomepagePosts()) ?? []
  const navigationPosts = (await loader.getNavigationPosts()) ?? []
  const heroPost = (await loader.getHomepageHeroPost());
  return {
    props: { preview, allPosts, navigationPosts, heroPost },
    // refresh content once a day
    revalidate: 86400
  }
}
