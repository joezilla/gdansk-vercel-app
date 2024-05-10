import { Layout, Container } from '../components/layout'
import { StreetOverview } from '../components/streets'
import Head from 'next/head'
import { IPost } from '../lib/contentmodel/wrappertypes'
import { ContentfulLoader } from '../lib/contentful'
import { StreetSummary } from '../lib/contentmodel/wrappertypes'
import { DefaultSocialTags } from '../components/socialtags'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { I18N } from "../lib/i18n";

type AllStreetProps = {
  preview: boolean,
  allStreets: StreetSummary[],
  navigationPosts: IPost[],
  locale: string
}

export default function AllStreets(props: AllStreetProps) {
  let {
    preview,
    allStreets,
    navigationPosts,
    locale
  } = props;
  const i18n = new I18N(props.locale).getTranslator();
  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts} locale={locale}>
        <Head>
          <DefaultSocialTags title="The Streets of Danzig | All Streets" description="Overview of all old street names of Gdansk." />
        </Head>
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
          <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
              {i18n("allstreets.header")}
            </h1>
            <span className="text-sm">{i18n("allstreets.subhead", { "count": allStreets.length } )}</span>
            <StreetOverview streets={allStreets} />
          </div>  
        </section>
      </Layout>
    </>
  )
}
export const getStaticProps: GetStaticProps = async (context) => {
  let locale = context.locale;
  let loader = new ContentfulLoader();
  const allStreets = (await loader.getAllStreets()) ?? []
  const navigationPosts = (await loader.getNavigationPosts()) ?? []
  return {
    props: { locale, allStreets, navigationPosts },
    // refresh content weekly
    revalidate: 60 * 60 * 24 * 7,
  }
}
