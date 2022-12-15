import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Layout } from '../../components/layout'
import { FullpagePost } from '../../components/posts'
import { ContentfulLoader } from '../../lib/contentful'
import { IPost } from '../../src/@types/contentful'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { parsePostURL, createPostURL } from '../../lib/urlutil';
import { log } from 'next-axiom'


type PostPageProps = {
  post: IPost
  navigationPosts: any,
  preview: boolean,
}

export default function PostPage(props: PostPageProps) {

  const { navigationPosts, post } = props;

  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  // rm <Header />

  return (
    <Layout navigationPosts={navigationPosts}>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <Head>
            <title>Danzig Street Names</title>
          </Head>
          <section className="dark:bg-gray-800 dark:text-gray-100">
            <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
              <FullpagePost content={post} />
            </div>
          </section>
        </>
      )}
    </Layout>
  )
}


export const getStaticProps: GetStaticProps = async (context) => {
  let loader = new ContentfulLoader()

  // can be array or single string 
  let slug = context?.params?.slug ?? "";
  slug = Array.isArray(slug) ? slug[0] : slug;

  // parse
  slug = parsePostURL(slug);

  log.debug("Loading post: " + slug);

  // load it
  let post = await loader.getPostBySlug(slug);

  return {
    props: {
      preview: false,
      post: post,
      navigationPosts: await loader.getNavigationPosts()
    },
    revalidate: 3600
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allPosts = await loader.getAllPosts();
  return {
    paths: allPosts?.map((p: any) => createPostURL(p.slug)) ?? [],
    fallback: true,
  }
}