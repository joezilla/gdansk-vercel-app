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

async function getDistrictData(lang: Locale, slug: string) {
  const loader = new ContentfulLoader(3600, lang);
  const district = await loader.getDistrictBySlug(slug);
  if (!district) {
    log.error(`Cannot find district ${slug}`);
    return null;
  }
  return district;
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale, slug: string }> }):
  Promise<Metadata> {
  const { lang, slug } = await params;
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
  return {
    title: i18n('districtdetail.title', { name: districtName }),
    description: i18n('districtdetail.description', { name: districtName, polishName: districtName }),
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
          alt: i18n('districtdetail.title', { name: districtName }),
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: i18n('districtdetail.title', { name: districtName }),
      description: i18n('districtdetail.description', { name: districtName, polishName: districtName }),
      images: [image],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: Locale, slug: string }>; }) {
  const { lang, slug } = await params;

  const district = await getDistrictData(lang, slug);
  if (!district) return notFound();

  const loader = new ContentfulLoader(3600, lang);
  const allStreets = await loader.getAllStreets();

  return (
    <section className="dark:bg-mybg-dark dark:text-gray-100">
      <div className="container p-6 mx-auto space-y-6 sm:space-y-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{district.fields.name}</h1>
          {district.fields.description && (
            <div className="prose dark:prose-invert">
              <RichtextComponent content={district.fields.description} locale={lang}/>
            </div>
          )}
        </div>
        <StreetsByDistrict streets={allStreets} district={district} locale={lang} />
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const loader = new ContentfulLoader();
  const allDistricts = await loader.getAllDistricts();
  
  return allDistricts?.flatMap((district: { slug: string }) => [
    { lang: 'de', slug: String(district.slug) },
    { lang: 'en', slug: String(district.slug) }
  ]) ?? [];
}