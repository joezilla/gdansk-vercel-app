import { Layout, Container } from '../components/layout'
import { StreetOverview } from '../components/streets'
import Head from 'next/head'
import { IPost, DistrictSummary } from '../lib/contentmodel/wrappertypes'
import { ContentfulLoader } from '../lib/contentful'
import { StreetSummary } from '../lib/contentmodel/wrappertypes'
import { DefaultSocialTags } from '../components/socialtags'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { I18N } from "../lib/i18n";
import { createDistrictURL } from '../lib/urlutil'

type AllDistrictProps = {
    preview: boolean,
    //  allStreets: StreetSummary[],
    navigationPosts: IPost[],
    locale: string,
    allDistricts: DistrictSummary[]
}

export default function AllDistricts(props: AllDistrictProps) {
    let {
        preview,
        allDistricts,
        navigationPosts,
        locale
    } = props;
    const i18n = new I18N(props.locale).getTranslator();
    return (
        <>
            <Layout preview={preview} navigationPosts={navigationPosts} locale={locale}>
                <Head>
                    <DefaultSocialTags title="The Streets of Danzig | All Districts" description="All districts of Danzig (Gdansk)." />
                </Head>
                <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
                    <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-6">
                        <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
                            {i18n("alldistricts.header")}
                        </h1>
                        <span className="text-sm">{i18n("alldistricts.subhead", { "count": allDistricts.length })}</span>
                        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
                            <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {allDistricts.map(district =>
                                    <>
                                        <a href={createDistrictURL(district.slug, props.locale)} key={district.slug}>
                                            <div>
                                                <h3 className="font-semibold hover:underline">{district.name}</h3>
                                                <span className="text-sm">{district.polishName}</span>
                                            </div>
                                        </a>
                                    </>
                                )}

                            </div></section>


                    </div>
                </section>
            </Layout>
        </>
    )
}
export const getStaticProps: GetStaticProps = async (context) => {
    let locale = context.locale;
    let loader = new ContentfulLoader();
    const navigationPosts = (await loader.getNavigationPosts()) ?? [];
    const allDistricts = (await loader.getAllDistricts()) ?? [];
    console.log(allDistricts);

    return {
        props: { locale, navigationPosts, allDistricts },
        // refresh content weekly
        revalidate: 60 * 60 * 24 * 7,
    }
}
