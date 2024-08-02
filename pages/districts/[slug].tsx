import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Layout } from '../../components/layout'
// import { FullpagePost } from '../../components/districts'
import { ContentfulLoader } from '../../lib/contentful'
import { IDistrict, StreetSummary } from '../../lib/contentmodel/wrappertypes'
import { GetStaticProps, GetStaticPaths } from 'next'
import { StreetsByDistrict } from '../../components/streets/streetsByDistrict'
import { log } from 'next-axiom'
import { DistrictMeta } from '../../components/districts/districtMeta'
import { I18N } from "../../lib/i18n";

type DistrictPageProps = {
  district: IDistrict,
  allStreets: StreetSummary[],
  navigationPosts: any,
  preview: boolean,
  locale: string
}

export default function PostPage(props: DistrictPageProps) {
  const { navigationPosts, allStreets, district, locale } = props;
  const router = useRouter();
  const i18n = new I18N(props.locale).getTranslator();

  if (!router.isFallback && !district) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout navigationPosts={navigationPosts} locale={locale}>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <DistrictMeta district={district} locale={locale}/> 
          <section className="dark:bg-mybg-dark dark:text-gray-100">
            <div className="container  p-6 mx-auto space-y-6 sm:space-y-12">
             {/*} <FullpagePost content={post} locale={locale} /> */}
             <StreetsByDistrict streets={allStreets} district={district} locale={locale} />
            </div>
          </section>
        </>
      )}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {

  let locale = context.locale;
  let loader = new ContentfulLoader(3600, locale);

  // can be array or single string 
  let slug = context?.params?.slug ?? "";
  slug = Array.isArray(slug) ? slug[0] : slug;

  log.debug("Loading post: " + slug);

  // load it
  let district = await loader.getDistrictBySlug(slug);

  if (!district) {
    log.error(`Cannot find district ${slug}`);
    return {
      notFound: true,
    }
  }

  let allStreets = await loader.getAllStreets();

  return {
    props: {
      preview: false,
      district: district,
      locale: locale,
      allStreets: allStreets,
      navigationPosts: await loader.getNavigationPosts()
    },
    revalidate: 60 * 60 * 24 // daily
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allDistricts = await loader.getAllDistricts();

  let pathsDe =  allDistricts?.map((district: any) =>  ({ params: { slug: String(district.slug) }, locale: 'de' } ) ) ?? [];
  let pathsEn =  allDistricts?.map((district: any) =>  ({ params: { slug: String(district.slug) }, locale: 'en-US' } ) ) ?? [];

  return {
    paths: pathsEn.concat(pathsDe),
    fallback: true,
  }
}