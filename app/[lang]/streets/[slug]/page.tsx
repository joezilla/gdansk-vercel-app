// import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Container } from '../../layout/container'
import { StreetDetail } from '../streetdetails'
import { IStreet, IPost } from '../../../../lib/contentmodel/wrappertypes'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ContentfulLoader } from '../../../../lib/contentful'
import { parseStreetURL, createStreetURL } from '../../../../lib/urlutil';
// import { StreetMeta } from '../../components/streets/metatags'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'

// component properties
// type StreetProps = {
//   street: IStreet,
//   navigationPosts: IPost[],
//   preview: boolean,
//   locale: string
// }

export default async function Page({ params: { lang, slug }, }: { params: { lang: Locale, slug: string }; }) { 

  let loader = new ContentfulLoader(3600, lang);

  const street = await loader.getStreetBySlug(slug);
  if (!street) {
    log.error(`Cannot find street ${slug}`);
    return notFound();
  }

  return (
      <Container>
        <article>
        <StreetDetail street={street} locale={lang} />

            </article>
      </Container>
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