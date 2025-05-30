export const dynamic = 'force-static'

import { I18N } from '../../../../lib/i18n';
import { StreetDetail } from '../streetdetails'
import { ContentfulLoader } from '../../../../lib/contentful'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { StreetSummary } from '../../../../lib/contentmodel/wrappertypes';

async function getStreetData(lang: Locale, slug: string) {
  const loader = new ContentfulLoader(3600, lang);
  const street = await loader.getStreetBySlug(slug);
  if (!street) {
    log.error(`Cannot find street ${slug}`);
    return null;
  }
  return street;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale, slug: string }> }):
  Promise<Metadata> {
  const { lang, slug } = await params;
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
  return {
    title: i18n('streetdetail.title', { name: streetName }),
    description: i18n('streetdetail.description', { name: streetName, polishName: polishName }),
    openGraph: {
      title: i18n('homepage.title'),
      description: i18n('homepage.description'),
      url: `https://www.streetsofdanzig.com/{lang}/streets/{slug}`,
      siteName: i18n('streetdetail.title', { name: 'street name' }),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: i18n('streetdetail.title', { name: streetName }),
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: i18n('streetdetail.title', { name: streetName }),
      description: i18n('streetdetail.description', { name: streetName, polishName: polishName }),
      images: [image],
    },
  }
}

export default async function Page({ params }:
  { params: Promise<{ lang: Locale, slug: string }>; }) {
  const { lang, slug } = await params;

  const street = await getStreetData(lang, slug);
  if (!street) return notFound();

  return (
    <section className="dark:bg-mybg-dark dark:text-gray-100">
      <div className=" mx-auto p-0">
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

  return allStreets?.flatMap((street: StreetSummary) => [
    { lang: 'de', slug: String(street.slug) },
    { lang: 'en', slug: String(street.slug) }
  ]) ?? [];
}