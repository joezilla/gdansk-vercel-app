import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Layout, Container } from '../../components/layout'
import { StreetDetail } from '../../components/streets'
import { IStreet, IPost } from '../../lib/contentmodel/wrappertypes'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ContentfulLoader } from '../../lib/contentful'
import { parseStreetURL, createStreetURL } from '../../lib/urlutil';
import { StreetMeta } from '../../components/streets/metatags'
import { log } from 'next-axiom'


// component properties
type StreetProps = {
  street: IStreet,
  navigationPosts: IPost[],
  preview: boolean,
  locale: string
}

export default function Street(content: StreetProps) {
  const router = useRouter()

  let locale = content.locale;

  if (!router.isFallback && !content.street) {
    log.error("Falling back to 404");
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={content.preview} navigationPosts={content.navigationPosts} locale={locale}>
      <Container>
        {router.isFallback ? (
          <Container>Loading...</Container>
        ) : (
          <>
            <StreetMeta street={content.street} locale={locale} />
            <article>
              <StreetDetail street={content.street} locale={locale} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

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



export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allStreets = await loader.getAllStreets();
  let pathsDe =  allStreets?.map((street: any) =>  ({ params: { name: String(street.slug) }, locale: 'de' } ) ) ?? [];
  let pathsEn =  allStreets?.map((street: any) =>  ({ params: { name: String(street.slug) }, locale: 'en-US' } ) ) ?? [];

  // let pathsDe =  allStreets?.map((street: any) => `{ params: { name: '${street.slug}' }, locale: 'en-US' }, )` ?? [];

  console.log(pathsEn.concat(pathsDe));


  // let pathsDe =  allStreets?.map((street: any) => `${createStreetURL(street.slug)}`) ?? []
  return {
    paths: pathsEn.concat(pathsDe),
    fallback: true
  }
}
