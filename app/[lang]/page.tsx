import { ContentfulLoader } from '../../lib/contentful'
import { HeroPost } from './posts/heroPost'
import { MoreStories } from './posts/moreStories'
import { DefaultSocialTags } from '../../components/socialtags'
import { AlgoliaApi } from '../../lib/search'
import { CardGrid } from './streets/cardGrid'
import { Locale } from "../../i18n-config";

export default async function Page({ params: { lang }, }: { params: { lang: Locale }; }) { 

  console.log(`HOMEPAGE WITH LOCALE ${lang}`);

  let loader = new ContentfulLoader(3600, lang);

  const allPosts = await loader.getHomepagePosts() ?? []
  // const navigationPosts = await loader.getNavigationPosts() ?? []
  const heroPost = await loader.getHomepageHeroPost();
  const cards = await new AlgoliaApi(lang).getStreetsWithImages(0,12);  
  
  return (
    <>
     {/* <Layout navigationPosts={navigationPosts} locale={locale}> */}
       {/* <Head>
        <DefaultSocialTags title="The Streets of Danzig" description="Danzig | Streets, People, History." />
  </Head> */}
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
          <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
          {heroPost &&
              <HeroPost locale={lang} content={heroPost} />
            }
            <MoreStories content={allPosts} locale={lang} />
            <CardGrid initialStreets={cards} locale={lang}/>
          </div>
        </section>
     {/* </Layout> */}
    </>
  );
}
// }

// export const getStaticProps: GetStaticProps = async (context) => {
//   let locale = context.locale;
//   let loader = new ContentfulLoader(3600, locale);
//   const allPosts = await loader.getHomepagePosts() ?? []
//   const navigationPosts = await loader.getNavigationPosts() ?? []
//   const heroPost = await loader.getHomepageHeroPost();
//   const cards = await new AlgoliaApi(locale).getStreetsWithImages(0,12);  
//   const preview = true;
//   return {
//     props: { preview, allPosts, navigationPosts, heroPost, locale, cards },
//     // refresh content weekly
//     revalidate: 60 * 60 * 24 * 7,
//   }
// }

