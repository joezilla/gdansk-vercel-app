import { Layout, Container } from '../components/layout'
import { StreetOverviewPolish } from '../components/streets'
import Head from 'next/head'
import { IPost } from '../src/@types/contentful'
import { ContentfulLoader, StreetSummary } from '../lib/contentful'
import { DefaultSocialTags } from '../components/socialtags'


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
          <DefaultSocialTags title="The Streets of Danzig | All Streets" description="Overview of all old street names of Gdansk." />
        </Head>
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
          <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
              List of All Streets
            </h1>
            <span className="text-sm">{allStreets.length} cataloged streets of Danzig (Gdansk).</span>
            <StreetOverviewPolish streets={allStreets} />
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
    // refresh content weekly
    revalidate: 60 * 60 * 24 * 7,
  }
}
