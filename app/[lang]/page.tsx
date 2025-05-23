export const dynamic = 'force-static'

import { Metadata } from 'next'
import { ContentfulLoader } from '../../lib/contentful'
import { HeroPost } from './posts/heroPost'
import { MoreStories } from './posts/moreStories'
import { AlgoliaApi } from '../../lib/search'
import { CardGrid } from './streets/cardGrid'
import { Locale } from "../../i18n-config";
import { I18N } from '../../lib/i18n'
import { IPost } from '../../lib/contentmodel/wrappertypes'

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
  const validHeroPost = Array.isArray(heroPost) ? null : (heroPost as IPost);
  const cards = await new AlgoliaApi(lang).getStreetsWithImages(0,12);  

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-mybg-dark dark:to-gray-900 dark:text-mytxt-dark">
      {validHeroPost && (
        <HeroPost locale={lang} content={validHeroPost} />
      )}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-12">
          <div className="shadow-sm rounded-lg overflow-hidden">
            <MoreStories content={allPosts} locale={lang} />
          </div>
          <div className="shadow-sm rounded-lg overflow-hidden">
            <CardGrid initialStreets={cards} locale={lang}/>
          </div>
        </div>
      </div>
    </main>
  );
}