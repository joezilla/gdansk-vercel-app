export const dynamic = 'force-static'

import { I18N } from '../../../../lib/i18n';
import { Container } from '../../layout/container'
import { StreetDetail } from '../streetdetails'
import { ContentfulLoader } from '../../../../lib/contentful'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

async function getStreetData(lang: Locale, slug: string) {
  const loader = new ContentfulLoader(3600, lang);
  const street = await loader.getStreetBySlug(slug);
  if (!street) {
    log.error(`Cannot find street ${slug}`);
    return null;
  }
  return street;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }):
  Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;
  //
  const street = await getStreetData(lang, slug);
  if (!street) return notFound();

  const streetName = street.fields.germanName;
  let image = "";
  if (street.fields.media && street.fields.media.length > 0) {
    image = street.fields.media[0].fields?.image?.fields?.file?.url as string ?? "";
  }
  const polishName = street.fields.polishNames && street.fields.polishNames.length
    > 0 ? street.fields.polishNames[0] : "";

  //
  const i18n = new I18N(lang).getTranslator();

  // You can fetch data here if needed for dynamic metadata
  const title = i18n('streetdetail.title', { name: streetName });
  const description = i18n('streetdetail.description', { name: streetName, polishName: polishName });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/streets/${slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function Page({ params }:
  { params: Promise<{ lang: string, slug: string }> }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;

  const street = await getStreetData(lang, slug);
  if (!street) return notFound();

  return (
    <section className="dark:bg-mybg-dark dark:text-gray-100">
      <div className="container  p-6 mx-auto space-y-6 sm:space-y-12">
        <article>
          <StreetDetail street={street} locale={lang} />
        </article>
      </div>
    </section>
  )
}

export async function generateStaticParams() {
  const loader = new ContentfulLoader();
  const allStreets = await loader.getAllStreets();

  return (allStreets ?? [])
    .filter((street: any) => street?.slug)
    .flatMap((street: any) => [
      { lang: 'de', slug: String(street.slug) },
      { lang: 'en', slug: String(street.slug) }
    ]);
}