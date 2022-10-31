import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import Header from '../../components/header'
import PostTitle from '../../components/post-title'
import PostBody from '../../components/post-body'
import StreetDetails from '../../components/streetdetails'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { CMS_NAME } from '../../lib/constants'
import { connectAutoComplete } from 'react-instantsearch-dom'
import { getAllStreets, getStreetByName, getNavigationPosts } from '../../lib/api'


export default function Street({ street, navigationPosts, preview }) {
  const router = useRouter()

  if (!router.isFallback && !street) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview} navigationPosts={navigationPosts}>
      <Container>
        <Header />
        {router.isFallback ? (
          <Container>Loading...</Container>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {street.germanName}
                </title>
              </Head>

              <StreetDetails street={street}></StreetDetails>
             
            </article>
            <SectionSeparator />
            

          </>
        )}
      </Container>
    </Layout>
  )
}

/* get the static properties for this street */
export async function getStaticProps({ params, preview = false }) {
  console.log("Getting street by name " + params.name);
  const data = (await getStreetByName( preview, params.name ));
  const navigationPosts = (await getNavigationPosts(preview)) ?? []
  return {
    props: {
        preview,
        street: data ?? null,
        navigationPosts
    }
  }
}

/* statically pre-renders all the street pages */
export async function getStaticPaths() {
/* const allPosts = await getAllPostsWithSlug() */
  const allStreets = (await getAllStreets()) ?? []
  return {
    paths: allStreets?.map((street) => `/streets/${street.germanName}`) ?? [],
    fallback: true,
  }
}
