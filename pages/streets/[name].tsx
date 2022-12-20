import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { Layout, Container } from '../../components/layout'
import { StreetDetail } from '../../components/streets'
import { IStreet, IPost } from '../../src/@types/contentful'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ContentfulLoader } from '../../lib/contentful'
import { parseStreetURL, createStreetURL } from '../../lib/urlutil';
import { StreetMeta } from '../../components/streets/metatags'
import { log } from 'next-axiom'

// component properties
type StreetProps = {
  street: IStreet,
  navigationPosts: IPost[],
  preview: boolean
}

export default function Street(content: StreetProps) {
  const router = useRouter()

  if (!router.isFallback && !content.street) {
    log.error("Falling back to 404");
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={content.preview} navigationPosts={content.navigationPosts}>
      <Container>
        {router.isFallback ? (
          <Container>Loading...</Container>
        ) : (
          <>
            <article>
              <Head>
                <title>The Streets of Danzig: {content.street.fields.germanName}</title>
                <StreetMeta street={content.street} />
              </Head>
              <StreetDetail street={content.street} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  let loader = new ContentfulLoader()

  let nameParam = context?.params?.name ?? "";

  // can be array or single string
  nameParam = Array.isArray(nameParam) ? nameParam[0] : nameParam;

  // parse
  let name = parseStreetURL(nameParam);

  log.debug("Loading street: " + name);

  const street =  await loader.getStreetByName(name);
  if(!street) {
    log.error(`Cannot find street ${name}`);
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview: false,
      street: street,
      navigationPosts: await loader.getNavigationPosts()
    }
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allStreets = await loader.getAllStreets();
  return {
    paths: allStreets?.map((street: any) => `${createStreetURL(street.germanName)}`) ?? [],
    fallback: true
  }
}
