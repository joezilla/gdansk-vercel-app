import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { Layout } from '../../components/layout'
import { FullpagePost } from '../../components/posts'
import { ContentfulLoader } from '../../lib/contentful'
import { IPost } from '../../lib/contentmodel/wrappertypes'
import { GetStaticProps, GetStaticPaths } from 'next'
import { createPostURL } from '../../lib/urlutil';
import { log } from 'next-axiom'
import { PostMeta } from '../../components/posts/metatags'



type PostPageProps = {
  post: IPost
  navigationPosts: any,
  preview: boolean,
  locale: string
}

export default function PostPage(props: PostPageProps) {

  const { navigationPosts, post, locale } = props;

  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  // rm <Header />

  return (
    <Layout navigationPosts={navigationPosts} locale={locale}>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <PostMeta post={post} locale={locale}/>
          <section className="dark:bg-mybg-dark dark:text-gray-100">
            <div className="container  p-6 mx-auto space-y-6 sm:space-y-12">
              <FullpagePost content={post} locale={locale} />
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
  let post = await loader.getPostBySlug(slug);

  if (!post) {
    log.error(`Cannot find post ${slug}`);
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview: false,
      post: post,
      locale: locale,
      navigationPosts: await loader.getNavigationPosts()
    },
    revalidate: 60 * 60 * 24 // daily
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  let loader = new ContentfulLoader()
  let allPosts = await loader.getAllPosts();
  let pathsDe =  allPosts?.map((post: any) =>  ({ params: { slug: String(post.slug) }, locale: 'de' } ) ) ?? [];
  let pathsEn =  allPosts?.map((post: any) =>  ({ params: { slug: String(post.slug) }, locale: 'en-US' } ) ) ?? [];
  // allPosts?.map((p: any) => createPostURL(p.slug)) ?? [],

  return {
    paths: pathsEn.concat(pathsDe),
    fallback: true,
  }
}