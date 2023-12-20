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


export default function Index({ navigationPosts, allPosts, preview, heroPost, locale, }: InferGetStaticPropsType<typeof getStaticProps>) {
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
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  let locale = context.locale;
  let loader = new ContentfulLoader(3600, locale);
  const allPosts = await loader.getHomepagePosts() ?? []
  const navigationPosts = await loader.getNavigationPosts() ?? []
  const heroPost = await loader.getHomepageHeroPost();
  const preview = true;

  return {
    props: { preview, allPosts, navigationPosts, heroPost, locale },
    // refresh content weekly
    revalidate: 60 * 60 * 24 * 7,
  }
}

