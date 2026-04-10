export const dynamic = 'force-static'

import { I18N } from '../../../../lib/i18n';
import { Container } from '../../layout/container'
import { StreetDetail } from '../streetdetails'
import { getContentfulLoader } from '../../../../lib/contentful'
import { hreflangAlternates } from '../../../../lib/hreflang'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { streetJsonLd, breadcrumbJsonLd, JsonLdScript } from '../../../../lib/jsonld'
import { Breadcrumbs } from '../../layout/breadcrumbs'

async function getStreetData(lang: Locale, slug: string) {
  const loader = getContentfulLoader(3600, lang);
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
    alternates: hreflangAlternates(lang, `/streets/${slug}`),
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

  const i18n = new I18N(lang).getTranslator();
  const streetName = street.fields.germanName;
  const polishName = street.fields.polishNames?.[0] ?? '';
  const description = i18n('streetdetail.description', { name: streetName, polishName });
  let imageUrl = '';
  if (street.fields.media?.length) {
    imageUrl = street.fields.media[0].fields?.image?.fields?.file?.url as string ?? '';
  }
  const districtName = street.fields.district_ref?.[0]?.fields?.name;
  const location = street.fields.location;

  const breadcrumbItems = [
    { name: i18n('homepage.title'), url: `/${lang}` },
    { name: i18n('allstreets.header'), url: `/${lang}/streets/all` },
    { name: streetName, url: `/${lang}/streets/${slug}` },
  ];

  return (
    <>
      <JsonLdScript data={[
        streetJsonLd({
          germanName: streetName,
          polishNames: street.fields.polishNames,
          previousNames: street.fields.previousNames,
          description,
          locale: lang,
          slug,
          lat: location?.lat,
          lon: location?.lon,
          imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
          districtName,
        }),
        breadcrumbJsonLd(breadcrumbItems),
      ]} />
      <section>
        <div className="max-w-screen-2xl mx-auto px-8 py-12">
          <Breadcrumbs items={breadcrumbItems.map(b => ({
            label: b.name,
            href: b.url === `/${lang}/streets/${slug}` ? undefined : b.url,
          }))} />
          <article>
            <StreetDetail street={street} locale={lang} />
          </article>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  const loader = getContentfulLoader();
  const allStreets = await loader.getAllStreets();

  return (allStreets ?? [])
    .filter((street: any) => street?.slug)
    .flatMap((street: any) => [
      { lang: 'de', slug: String(street.slug) },
      { lang: 'en', slug: String(street.slug) }
    ]);
}