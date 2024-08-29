export const dynamic = 'force-static'

import { Metadata } from 'next'
import { ContentfulLoader } from '../../lib/contentful'
import { HeroPost } from './posts/heroPost'
import { MoreStories } from './posts/moreStories'
import { AlgoliaApi } from '../../lib/search'
import { CardGrid } from './streets/cardGrid'
import { Locale } from "../../i18n-config";
import { I18N } from '../../lib/i18n'

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const i18n = new I18N(lang).getTranslator();
  // You can fetch data here if needed for dynamic metadata
  return {
    title: i18n('homepage.title'),
    description: i18n('homepage.description'),
    openGraph: {
      title: i18n('homepage.title'),
      description: i18n('homepage.description'),
      url: 'https://www.streetsofdanzig.com',
      siteName: i18n('homepage.title'),
      images: [
        {
          url: 'https://www.streetsofdanzig.com/resources/images/site-screenshot.png', 
          width: 1200,
          height: 630,
          alt: i18n('homepage.title'),
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',  
      title: i18n('homepage.title'),
      description: i18n('homepage.description'),
      images: ['https://www.streetsofdanzig.com/resources/images/site-screenshot.png'],
    },
  }
}

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) { 
  let loader = new ContentfulLoader(3600, lang);

  const allPosts = await loader.getHomepagePosts() ?? []
  const heroPost = await loader.getHomepageHeroPost();
  const cards = await new AlgoliaApi(lang).getStreetsWithImages(0,12);  

  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
          {heroPost &&
            <HeroPost locale={lang} content={heroPost} />
          }
          <MoreStories content={allPosts} locale={lang} />
          <CardGrid initialStreets={cards} locale={lang}/>
        </div>
      </section>
    </>
  );
}