import { Layout, Container } from '../components/layout'
import { StreetOverview } from '../components/streets'
import Head from 'next/head'
import common_en from '../i18n/en/common.json'
import { IPost } from '../src/@types/contentful'
import { ContentfulLoader, StreetSummary } from '../lib/contentful'

type AllStreetProps = {
  preview: boolean,
  allStreets: StreetSummary[],
  navigationPosts: IPost[]
}

export default function AllStreets(props: AllStreetProps) {
  let {
    preview,
    allStreets,
    navigationPosts
  } = props;

  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts}>
          <Head>
            <title>Danzig Street Names</title>
          </Head>
          <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
            <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
              <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
                Alle Strassen Danzigs 22
              </h1>
              <StreetOverview streets={allStreets} />
            </div>
          </section>
      </Layout>
    </>
  )
}
export async function getStaticProps({ preview = false }) {
  let loader = new ContentfulLoader();
  const allStreets = (await loader.getAllStreets()) ?? []
  const navigationPosts = (await loader.getNavigationPosts()) ?? []
  return {
    props: { preview, allStreets, navigationPosts },
    // refresh content once a day
    revalidate: 86400
  }
}
