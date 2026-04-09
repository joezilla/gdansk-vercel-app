export const dynamic = 'force-static'

// import { useRouter } from 'next/router'
import { ContentfulLoader } from '../../../../lib/contentful'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { notFound } from 'next/navigation'
import { StreetsByDistrict } from '../streetsByDistrict'
import { Metadata } from 'next'
import { I18N } from '../../../../lib/i18n';
import { RichtextComponent } from '../../contentful';
import { districtJsonLd, breadcrumbJsonLd, JsonLdScript } from '../../../../lib/jsonld'
import { Breadcrumbs } from '../../layout/breadcrumbs'

async function getDistrictData(lang: Locale, slug: string) {
  const loader = new ContentfulLoader(3600, lang);
  const district = await loader.getDistrictBySlug(slug);
  if (!district) {
    log.error(`Cannot find district ${slug}`);
    return null;
  }
  return district;
}


export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }):
  Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;
  //
  const district = await getDistrictData(lang, slug);
  if (!district) return notFound();

  const districtName = district.fields?.name;
  let image = "";
  if (district.fields.media && district.fields.media.length > 0) {
    image = district.fields.media[0].fields?.image?.fields?.file?.url as string ?? "";
  }
  //
  const i18n = new I18N(lang).getTranslator();

  // You can fetch data here if needed for dynamic metadata
  const title = i18n('districtdetail.title', { name: districtName });
  const description = i18n('districtdetail.description', { name: districtName, polishName: districtName });

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/districts/${slug}`,
      languages: { en: `/en/districts/${slug}`, de: `/de/districts/${slug}` },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/districts/${slug}`,
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

export default async function Page({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;

  const district = await getDistrictData(lang, slug);
  if (!district) return notFound();

  const loader = new ContentfulLoader(3600, lang);
  const allStreets = await loader.getAllStreets();

  const i18n = new I18N(lang).getTranslator();
  const districtName = district.fields.name;
  const description = i18n('districtdetail.description', { name: districtName, polishName: districtName });

  const breadcrumbItems = [
    { name: i18n('homepage.title'), url: `/${lang}` },
    { name: i18n('alldistricts.header'), url: `/${lang}/districts/all` },
    { name: districtName, url: `/${lang}/districts/${slug}` },
  ];

  return (
    <>
      <JsonLdScript data={[
        districtJsonLd({
          name: districtName,
          polishName: district.fields.polishName,
          description,
          locale: lang,
          slug,
        }),
        breadcrumbJsonLd(breadcrumbItems),
      ]} />
      <section>
        <div className="max-w-screen-2xl mx-auto px-8 py-12">
          <Breadcrumbs items={breadcrumbItems.map(b => ({
            label: b.name,
            href: b.url === `/${lang}/districts/${slug}` ? undefined : b.url,
          }))} />
          <header className="mb-20">
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-on-surface leading-none tracking-tighter mb-4">
              {districtName}
            </h1>
            {district.fields.polishName && (
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-primary"></div>
                <p className="text-2xl font-headline italic text-on-surface/60">
                  {district.fields.polishName}
                </p>
              </div>
            )}
          </header>
          {district.fields.description && (
            <div className="prose prose-lg max-w-3xl text-on-surface leading-relaxed mb-24">
              <RichtextComponent content={district.fields.description} locale={lang}/>
            </div>
          )}
          <StreetsByDistrict streets={allStreets} district={district} locale={lang} />
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const loader = new ContentfulLoader();
  const allDistricts = await loader.getAllDistricts();

  return (allDistricts ?? [])
    .filter((district: any) => district?.slug)
    .flatMap((district: any) => [
      { lang: 'de', slug: String(district.slug) },
      { lang: 'en', slug: String(district.slug) }
    ]);
}