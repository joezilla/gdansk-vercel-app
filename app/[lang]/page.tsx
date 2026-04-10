export const dynamic = 'force-static'

import { Metadata } from 'next'
import { getContentfulLoader } from '../../lib/contentful'
import { hreflangAlternates } from '../../lib/hreflang'
import { Locale } from "../../i18n-config";
import { I18N } from '../../lib/i18n'
import { websiteJsonLd, JsonLdScript } from '../../lib/jsonld'
import Image from 'next/image'
import Link from 'next/link'
import { normalizeContentfulImageUrl } from '../../lib/imageUrl'
import { RichtextComponent } from './contentful'
import { Carousel } from './layout/carousel'
import { HeroSearchBar } from './layout/heroSearchBar'
import { createStreetURL, createPostURL, createDistrictURL } from '../../lib/urlutil'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const i18n = new I18N(lang).getTranslator();
  return {
    title: { absolute: i18n('homepage.title') },
    description: i18n('homepage.description'),
    alternates: hreflangAlternates(lang),
    openGraph: {
      title: i18n('homepage.title'), description: i18n('homepage.description'), url: `/${lang}`,
      images: [{ url: 'https://www.streetsofdanzig.com/resources/images/site-screenshot.png', width: 1200, height: 630, alt: i18n('homepage.title') }],
      locale: lang, type: 'website',
    },
    twitter: { card: 'summary_large_image', title: i18n('homepage.title'), description: i18n('homepage.description'), images: ['https://www.streetsofdanzig.com/resources/images/site-screenshot.png'] },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const loader = getContentfulLoader(3600, lang);
  const i18n = new I18N(lang).getTranslator();
  const homepage = await loader.getHomepageContent(lang);

  const heroHeadline = homepage?.fields?.heroHeadline ?? i18n('homepage.title');
  const heroSubtitle = homepage?.fields?.heroSubtitle ?? '';
  const heroImageUrl = homepage?.fields?.heroImage?.fields?.file?.url as string | undefined;
  const seoHeadline = homepage?.fields?.seoHeadline ?? i18n('homepage.seoHeadlineFallback');
  const seoText = homepage?.fields?.seoText;
  const seoQuote = homepage?.fields?.seoQuote;
  const featuredStreets = homepage?.fields?.featuredStreets ?? [];
  const featuredDistricts = homepage?.fields?.featuredDistricts ?? [];
  const featuredPosts = homepage?.fields?.featuredPosts ?? [];

  return (
    <>
      <JsonLdScript data={websiteJsonLd(lang)} />
      <h1 className="sr-only">{i18n('homepage.title')}</h1>

      {/* === Section 1: Hero === */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          {heroImageUrl ? (
            <Image src={normalizeContentfulImageUrl(heroImageUrl)} alt={heroHeadline} fill sizes="100vw" priority className="object-cover sepia-[0.2] brightness-[0.5]" />
          ) : (
            <div className="w-full h-full bg-surface-container-highest" />
          )}
        </div>
        <div className="relative z-10 w-full max-w-4xl px-8 text-center drop-shadow-lg">
          <h2 className="text-5xl md:text-7xl font-headline text-white mb-8 leading-tight tracking-tight">{heroHeadline}</h2>
          <div className="relative mt-8 max-w-2xl mx-auto">
            <HeroSearchBar locale={lang} placeholder={`${i18n('search.title')}...`} buttonLabel={i18n('nav.search')} />
            {heroSubtitle && <p className="text-stone-100 mt-4 font-body text-sm italic drop-shadow-md">{heroSubtitle}</p>}
          </div>
        </div>
      </section>

      {/* === Section 2: SEO Content === */}
      <section className="py-16 px-8 max-w-4xl mx-auto">
        <div className="border-t border-outline-variant pt-12">
          <span className="text-primary font-label font-bold uppercase tracking-[0.3em] text-xs block mb-6">{i18n('homepage.seoLabel')}</span>
          <h2 className="text-5xl font-headline mb-10 leading-tight">{seoHeadline}</h2>
          {seoText ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6 font-body text-lg text-on-surface/60 leading-relaxed">
                <RichtextComponent content={seoText} locale={lang} />
              </div>
              {seoQuote && (
                <div className="space-y-6">
                  <div className="bg-surface-container-high p-8 rounded-lg italic font-headline text-primary">&ldquo;{seoQuote}&rdquo;</div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6 text-lg text-on-surface/60 leading-relaxed"><p>{i18n('homepage.seoTextFallback1')}</p></div>
              <div className="space-y-6 text-lg text-on-surface/60 leading-relaxed"><p>{i18n('homepage.seoTextFallback2')}</p></div>
            </div>
          )}
        </div>
      </section>

      {/* === Section 3: Streets of Interest === */}
      {featuredStreets.length > 0 && (
        <section className="py-16 px-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <h2 className="text-4xl font-headline text-primary border-l-4 border-primary pl-6">{i18n('homepage.streetsOfInterest')}</h2>
          </div>
          <Carousel itemsPerPage={3}>
            {[...featuredStreets.map(street => {
              const imageUrl = street.fields.media?.[0]?.fields?.image?.fields?.file?.url as string | undefined;
              return (
                <a key={street.fields.slug} href={createStreetURL(street.fields.slug, lang)} className="group bg-surface-container-lowest editorial-shadow overflow-hidden flex flex-col">
                  <div className="relative aspect-[3/2] bg-surface-container-high overflow-hidden">
                    {imageUrl ? (
                      <Image src={normalizeContentfulImageUrl(imageUrl)} alt={street.fields.germanName} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-on-surface/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-headline font-bold mb-2 group-hover:text-primary transition-colors">{street.fields.germanName}</h3>
                    {street.fields.polishNames?.[0] && <p className="text-sm text-on-surface/50">{street.fields.polishNames[0]}</p>}
                  </div>
                </a>
              );
            }),
              <Link key="view-all-streets" href={`/${lang}/streets/all`} className="group bg-surface-container-low flex flex-col items-center justify-center text-center p-8 hover:bg-surface-container-high transition-colors">
                <svg className="w-10 h-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <h3 className="text-xl font-headline font-bold text-primary mb-2">{i18n('nav.allstreets')}</h3>
                <p className="text-sm text-on-surface/50">{i18n('allstreets.subhead', { count: '' }).replace(/\s+$/, '')}</p>
              </Link>
            ]}
          </Carousel>
        </section>
      )}

      {/* === Section 4: Historical Districts === */}
      {featuredDistricts.length > 0 && (
        <section className="bg-surface-container-low py-20 overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-headline mb-6">{i18n('homepage.historicalDistricts')}</h2>
              <p className="text-on-surface/60 font-body">{i18n('homepage.districtsSubtitle')}</p>
            </div>
            <Carousel itemsPerPage={3}>
              {[...featuredDistricts.map(district => {
                const imageUrl = (district.fields as any).image?.fields?.file?.url as string | undefined;
                return (
                  <a key={district.fields.slug} href={createDistrictURL(district.fields.slug, lang)} className="group bg-surface-container-lowest editorial-shadow overflow-hidden flex flex-col">
                    <div className="relative h-64 bg-surface-container-high overflow-hidden">
                      {imageUrl ? (
                        <Image src={normalizeContentfulImageUrl(imageUrl)} alt={district.fields.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg className="w-12 h-12 text-on-surface/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-headline mb-4 group-hover:text-primary transition-colors">{district.fields.name}</h3>
                        {district.fields.polishName && <p className="text-on-surface/60 font-body mb-6">{district.fields.polishName}</p>}
                      </div>
                      <span className="w-full py-3 border border-outline hover:bg-surface-container-high transition-colors font-label uppercase tracking-widest text-xs text-center block">{i18n('homepage.enterArchive')}</span>
                    </div>
                  </a>
                );
              }),
                <Link key="view-all-districts" href={`/${lang}/districts/all`} className="group bg-surface-container-lowest flex flex-col items-center justify-center text-center p-8 hover:bg-surface-container-high transition-colors editorial-shadow">
                  <svg className="w-10 h-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <h3 className="text-xl font-headline font-bold text-primary mb-2">{i18n('nav.alldistricts')}</h3>
                  <p className="text-sm text-on-surface/50">{i18n('alldistricts.explore')}</p>
                </Link>
              ]}
            </Carousel>
          </div>
        </section>
      )}

      {/* === Section 5: Archival Insights === */}
      {featuredPosts.length > 0 && (
        <section className="py-24 px-8 max-w-screen-2xl mx-auto border-t border-outline-variant/30">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <h2 className="text-4xl font-headline text-primary border-l-4 border-primary pl-6">{i18n('homepage.archivalInsights')}</h2>
          </div>
          <Carousel itemsPerPage={3}>
            {featuredPosts.map(post => {
              const postImageUrl = post.fields?.coverImage?.fields?.file?.url as string | undefined;
              return (
                <Link key={post.fields.slug} href={createPostURL(post.fields.slug, lang)} className="group">
                  <div className="overflow-hidden mb-8 aspect-[4/3] bg-surface-container-high">
                    {postImageUrl ? (
                      <Image src={normalizeContentfulImageUrl(postImageUrl)} alt={post.fields.title} width={400} height={300} sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-on-surface/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {post.metadata?.tags?.[0] && <span className="text-primary font-label font-bold uppercase tracking-widest text-[10px]">{post.metadata.tags[0].sys.id}</span>}
                    <h3 className="text-2xl font-headline group-hover:text-primary transition-colors">{post.fields.title}</h3>
                    {post.fields.excerpt && <p className="text-on-surface/60 font-body leading-relaxed text-sm line-clamp-3">{post.fields.excerpt}</p>}
                  </div>
                </Link>
              );
            })}
          </Carousel>
        </section>
      )}
    </>
  );
}
