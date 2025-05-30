export const dynamic = 'force-static'

import { ContentfulLoader } from '../../../../lib/contentful'
import { Locale } from "../../../../i18n-config";
import { I18N } from '../../../../lib/i18n'
import { createDistrictURL } from '../../../../lib/urlutil'

// component properties
// type StreetProps = {
//   street: IStreet,
//   navigationPosts: IPost[],
//   preview: boolean,
//   locale: string
// }

export default async function Page({ params }: { params: Promise<{ lang: Locale, slug: string }>; }) {
  const { lang } = await params;

  const loader = new ContentfulLoader(3600, lang);
  const i18n = new I18N(lang).getTranslator();
  const allDistricts = await loader.getAllDistricts();

  return (
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
                <a href={createDistrictURL(district.slug, lang)} key={district.slug}>
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
  )
}
/*
 export const getStaticProps: GetStaticProps = async (context) => {

  let locale = context.locale;

  let loader = new ContentfulLoader(3600, locale);

  let nameParam = context?.params?.name ?? "";

  // can be array or single string
  nameParam = Array.isArray(nameParam) ? nameParam[0] : nameParam;

  // parse
  let name = parseStreetURL(nameParam);

  log.debug("Loading street: " + name);

  const street = await loader.getStreetBySlug(name);
  if (!street) {
    log.error(`Cannot find street ${name}`);
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview: false,
      street: street,
      locale: locale,
      navigationPosts: await loader.getNavigationPosts(),
    },
    revalidate: 60 * 60 * 24 * 5 // weekly
  };
}
*/
/*

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allStreets = await loader.getAllStreets();
  let pathsDe =  allStreets?.map((street: any) =>  ({ params: { name: String(street.slug) }, locale: 'de' } ) ) ?? [];
  let pathsEn =  allStreets?.map((street: any) =>  ({ params: { name: String(street.slug) }, locale: 'en-US' } ) ) ?? [];
  return {
    paths: pathsEn.concat(pathsDe),
    fallback: true
  }
}
*/