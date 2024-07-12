/**
 * Homepage
 */
import { Layout } from '../components/layout'
import Head from 'next/head'
import { ContentfulLoader } from '../lib/contentful'
import { HeroPost } from '../components/posts'
import { MoreStories } from '../components/posts'
import { DefaultSocialTags } from '../components/socialtags'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { AlgoliaApi } from '../lib/search'
import { FancyCard } from '../components/cards/fancycard'


import { SmallCard, SmallCardProps } from '../components/cards/smallCard'
import { CardGrid } from '../components/cards/cardGrid'

export default function Index({ navigationPosts, allPosts, preview, heroPost, locale, cards}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts} locale={locale}>
        <Head>
          <DefaultSocialTags title="title todo" description="" />
        </Head>
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
          <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
            {heroPost &&
              <HeroPost locale={locale} content={heroPost} />
            }
            <MoreStories content={allPosts} locale={locale} />
            <CardGrid initialStreets={cards}/>
          </div>
        </section>
      </Layout>
    </>
  )
}

/*
function getCards(): Promise<SmallCardProps[]> {
  // For now, consider the data is stored on a static `users.json` file
  return fetch('http://localhost:3000/api/content/cardfeed')
    // the JSON body is taken from the response
    .then(res => res.json())
    .then(res => {
      // The response has an `any` type, so we need to cast
      // it to the `User` type, and return it from the promise
      return res.result as SmallCardProps[]
    })
}*/

export const getStaticProps: GetStaticProps = async (context) => {
  let locale = context.locale;
  let loader = new ContentfulLoader(3600, locale);
  const allPosts = await loader.getHomepagePosts() ?? []
  const navigationPosts = await loader.getNavigationPosts() ?? []
  const heroPost = await loader.getHomepageHeroPost();
  const cards = await new AlgoliaApi(locale).getStreetsWithImages(0,12);  
  const preview = true;
  return {
    props: { preview, allPosts, navigationPosts, heroPost, locale, cards },
    // refresh content weekly
    revalidate: 60 * 60 * 24 * 7,
  }
}

