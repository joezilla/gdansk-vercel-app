export const dynamic = 'force-static'

import { Metadata } from 'next'
import { ContentfulLoader } from '../../../../lib/contentful'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { FullpagePost } from '../fullpagePost'
import { log } from 'next-axiom'
import { I18N } from '../../../../lib/i18n';
import { IPost } from '../../../../lib/contentmodel/wrappertypes';

async function getPostData(lang: Locale, slug: string) {
  let loader = new ContentfulLoader(3600, lang);
  const post = await loader.getPostBySlug(slug);
  if (!post) {
    log.error(`Cannot find post ${slug}`);
    return null;
  }
  return post;
}


export async function generateMetadata({ params: { lang, slug }, }: { params: { lang: Locale, slug: string } }):
  Promise<Metadata> {
  //
  const post = await getPostData(lang, slug);
  if (!post) return notFound();

  let name = post.fields?.title;
  let image = "";
  if (post.fields.coverImage) {
      image = post.fields?.coverImage?.fields?.file?.url as string ?? "";
  }
  let excerpt = post.fields.excerpt;

  //
  const i18n = new I18N(lang).getTranslator();

  // You can fetch data here if needed for dynamic metadata
  return {
    title: name,
    description: excerpt,
    openGraph: {
      title: name,
      description: i18n('homepage.description'),
      url: `https://www.streetsofdanzig.com/{lang}/posts/{slug}`,
      siteName: i18n('homepage.title'),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: excerpt,
      images: [image],
    },
  }
}

export async function generateStaticParams() {
  let loader = new ContentfulLoader()
  let allPosts = await loader.getAllPosts();

  return allPosts?.flatMap((post: any) => [
    { lang: 'de', slug: post.slug },
    { lang: 'en', slug: post.slug }
  ]) ?? [];
}

export default async function Page({ params: { lang, slug } }: { params: { lang: Locale, slug: string } }) {

  const post = await getPostData(lang, slug);
  if (!post) return notFound();

  return (
    <section className="dark:bg-mybg-dark dark:text-gray-100">
      <div className="mx-auto p-0">
        <FullpagePost content={post} locale={lang} />
      </div>
    </section>
  )
}
