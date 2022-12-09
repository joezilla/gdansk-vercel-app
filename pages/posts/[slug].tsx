import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Layout } from '../../components/layout'
import { FullpagePost } from '../../components/posts'
import { ContentfulLoader } from '../../lib/contentful'
import { IPost } from '../../src/@types/contentful'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'


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
    paths: allPosts?.map((p: any) => `/posts/${p.slug}`) ?? [],
    fallback: true,
  }
}




{/*
          <>
            <article>
              <Head>
                <title>
                  {post.fields.title}
                </title>
                <meta property="og:image" content={post..coverImage.fields.file.url} />
              </Head>
              <PostHeader
                title={post.fields.title}
                coverImage={post.fields.coverImage}
                date={post.fields.date}
                author={post.fields.author}
              />
              <PostBody content={post} />
            </article>
            <SectionSeparator />
            {morePosts && morePosts.length > 0 && (
              <MoreStories posts={morePosts} />
            )}
          </>
            */}