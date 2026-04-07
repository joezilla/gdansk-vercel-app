export const dynamic = 'force-static'

import { Metadata } from 'next'
import { ContentfulLoader } from '../../../../lib/contentful'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { FullpagePost } from '../fullpagePost'
import { log } from 'next-axiom'
import { I18N } from '../../../../lib/i18n';
import { IPost } from '../../../../lib/contentmodel/wrappertypes';
import { articleJsonLd, breadcrumbJsonLd, JsonLdScript } from '../../../../lib/jsonld'
import { Breadcrumbs } from '../../layout/breadcrumbs'

async function getPostData(lang: Locale, slug: string) {
  const loader = new ContentfulLoader(3600, lang);
  const post = await loader.getPostBySlug(slug);
  if (!post) {
    log.error(`Cannot find post ${slug}`);
    return null;
  }
  return post;
}


export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }):
  Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;
  //
  const post = await getPostData(lang, slug);
  if (!post) return notFound();

  const name = post.fields?.title;
  let image = "";
  if (post.fields.coverImage) {
      image = post.fields?.coverImage?.fields?.file?.url as string ?? "";
  }
  const excerpt = post.fields.excerpt;

  //
  const i18n = new I18N(lang).getTranslator();

  // You can fetch data here if needed for dynamic metadata
  return {
    title: name,
    description: excerpt,
    alternates: {
      canonical: `/${lang}/posts/${slug}`,
      languages: { en: `/en/posts/${slug}`, de: `/de/posts/${slug}` },
    },
    openGraph: {
      title: name,
      description: excerpt,
      url: `/${lang}/posts/${slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: lang,
      type: 'article',
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
  const loader = new ContentfulLoader()
  const allPosts = await loader.getAllPosts();

  return (allPosts ?? [])
    .filter((post: any) => post?.slug)
    .flatMap((post: any) => [
      { lang: 'de', slug: post.slug },
      { lang: 'en', slug: post.slug }
    ]);
}

export default async function Page({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;

  const post = await getPostData(lang, slug);
  if (!post) return notFound();

  const i18n = new I18N(lang).getTranslator();
  const postTitle = post.fields.title;
  let imageUrl = '';
  if (post.fields.coverImage) {
    imageUrl = post.fields.coverImage?.fields?.file?.url as string ?? '';
  }

  const breadcrumbItems = [
    { name: i18n('homepage.title'), url: `/${lang}` },
    { name: postTitle, url: `/${lang}/posts/${slug}` },
  ];

  return (
    <>
      <JsonLdScript data={[
        articleJsonLd({
          title: postTitle,
          description: post.fields.excerpt,
          locale: lang,
          slug,
          datePublished: post.fields.date,
          imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
        }),
        breadcrumbJsonLd(breadcrumbItems),
      ]} />
      <section className="dark:bg-mybg-dark dark:text-gray-100">
        <div className="container p-6 mx-auto space-y-6 sm:space-y-12">
          <Breadcrumbs items={breadcrumbItems.map(b => ({
            label: b.name,
            href: b.url === `/${lang}/posts/${slug}` ? undefined : b.url,
          }))} />
          <FullpagePost content={post} locale={lang} />
        </div>
      </section>
    </>
  )
}
