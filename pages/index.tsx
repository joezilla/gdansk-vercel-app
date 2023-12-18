/**
 * Homepage
 */
import { Layout } from '../components/layout'
import Head from 'next/head'
import { IPost } from '../lib/contentmodel/wrappertypes'
import { ContentfulLoader } from '../lib/contentful'
import { HeroPost } from '../components/posts'
import { MoreStories } from '../components/posts'
import { DefaultSocialTags } from '../components/socialtags'
import { getTranslator } from "../lib/i18n";


type HomepageProps = {
  preview?: boolean,
  allPosts: IPost[],
  navigationPosts: IPost[],
  heroPost: IPost,
  locale: string
}

export default async function Index(props: HomepageProps) {
  const t = await getTranslator(props.locale);
  let { navigationPosts, allPosts, preview, heroPost, locale } = props;
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts} locale={locale}>
        <Head>
          <DefaultSocialTags title={t("site.title")} description={t("site.description")} />
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

export async function getStaticProps({ preview = false, locale="en" }) {
  let loader = new ContentfulLoader(3600, locale);
  const allPosts = (await loader.getHomepagePosts()) ?? []
  const navigationPosts = (await loader.getNavigationPosts()) ?? []
  const heroPost = (await loader.getHomepageHeroPost());

  return {
    props: { preview, allPosts, navigationPosts, heroPost, locale },
    // refresh content weekly
    revalidate: 60 * 60 * 24 * 7,
  }
}
