import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { Layout, Container } from '../../components/layout'
import { StreetDetail } from '../../components/streets'
import { IStreet, IPost} from '../../src/@types/contentful'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ContentfulLoader } from '../../lib/contentful'


// component properties
type StreetProps = {
  street: IStreet,
  navigationPosts: IPost[],
  preview: boolean
}

export default function Street(content: StreetProps) {
  const router = useRouter()

  if (!router.isFallback && !content.street) {
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
                <title>
                  {content.street.fields.germanName}
                </title>
              </Head>
              <StreetDetail street={content.street}/>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  let loader = new ContentfulLoader()

  let name = context?.params?.name ?? "";

  // can be array or single string
  name = Array.isArray(name) ? name[0] : name;

  return {
    props: {
      preview: false,
      street: await loader.getStreetByName(name),
      navigationPosts: await loader.getNavigationPosts() 
    }
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allStreets = await loader.getAllStreets();
  return {
    paths: allStreets?.map((street: any) => `/streets/${street.germanName}`) ?? [],
    fallback: true  }
}
