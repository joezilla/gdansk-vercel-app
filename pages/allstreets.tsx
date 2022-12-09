import { Layout, Container }  from '../components/layout'
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

export default function AllStreets( props : AllStreetProps) {
  let {
    preview,
    allStreets,
    navigationPosts
  } = props;

  return (
    <>
      <Layout preview={preview} navigationPosts={navigationPosts}>
        <Container>
          <Head>
            <title>Danzig Street Names</title>
          </Head>
          <div className="p-6 py-6 w-full m-0 dark:bg-zinc-900 dark:text-gray-100">
            <section className="mt-4 mb-4 md:mb-8">
              <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter leading-tight md:pr-8 dark:text-white">
                Alle Strassen Danzigs
              </h1>
            </section>
            <StreetOverview streets={allStreets} />
          </div>
        </Container>
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
