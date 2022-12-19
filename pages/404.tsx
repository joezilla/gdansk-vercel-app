/**
 * 404 Error
 */
import { Layout } from '../components/layout'
import Head from 'next/head'
import { IPost } from '../src/@types/contentful'
import { ContentfulLoader } from '../lib/contentful'

type ErrorpageProps = {
    navigationPosts: IPost[],
    preview: boolean
}

export default function NotFoundPage(props: ErrorpageProps) {
    let { navigationPosts, preview } = props;
    return (
        <>
            <Layout preview={preview} navigationPosts={navigationPosts}>
                <Head>
                    <title>Danzig Street Names</title>
                </Head>
                <section className="grid grid-cols-2 dark:bg-mybg-dark dark:text-mytxt-dark">
                    <div className="max-w-6xl p-6 py-24 mx-auto space-y-6 sm:space-y-12">
                        <object type="image/svg+xml" data="/images/404UnicornNotFound.svg">
                            <img src="/images/404UnicornNotFound.svg" />
                        </object>
                    </div>
                    <div className="max-w-6xl pl-2 pr-64 py-48 mx-auto space-y-6 sm:space-y-12">
                        <h1 className="text-4xl pb-16 lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
                            Chucks.</h1>
                        Looks like we can't find that file. But we also just re-organized a bunch of
                        things, so maybe try heading over here:
                        <ul>
                            <li><a href="/allstreets" className="text-accent underline">Overview of all streets</a></li>
                        </ul>

                    </div>
                </section>
            </Layout>
        </>
    )
}

export async function getStaticProps({ preview = false }) {
    let loader = new ContentfulLoader();
    const navigationPosts = (await loader.getNavigationPosts()) ?? []
    return {
        props: { preview, navigationPosts },
        // refresh content once a day
        revalidate: 86400
    }
}
