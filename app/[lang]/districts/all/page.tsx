export const dynamic = 'force-static'

import { Metadata } from 'next'
import { getContentfulLoader } from '../../../../lib/contentful'
import { Locale } from "../../../../i18n-config";
import { I18N } from '../../../../lib/i18n'
import { createDistrictURL } from '../../../../lib/urlutil'
import Image from 'next/image'
import { normalizeContentfulImageUrl } from '../../../../lib/imageUrl'
import { hreflangAlternates } from '../../../../lib/hreflang'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const i18n = new I18N(lang).getTranslator();
  return {
    title: i18n('alldistricts.header'),
    alternates: hreflangAlternates(lang, '/districts/all'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;

  const loader = getContentfulLoader(3600, lang);
  const i18n = new I18N(lang).getTranslator();
  const allDistricts = await loader.getAllDistricts();

  return (
    <section>
      <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-24">
        {/* Editorial Hero Header */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-end">
          <div className="lg:col-span-7">
            <p className="text-tertiary font-medium tracking-widest text-xs uppercase mb-4">
              {i18n("alldistricts.subhead", { "count": allDistricts.length })}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight text-on-surface font-headline">
              {i18n("alldistricts.header")}
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-on-surface/60 max-w-2xl">
              <p>{i18n("alldistricts.intro1")}</p>
              <p>{i18n("alldistricts.intro2")}</p>
            </div>
          </div>
        </header>

        {/* District Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {allDistricts.map((district, index) => (
            <a
              href={createDistrictURL(district.slug, lang)}
              key={district.slug}
              className={`group flex flex-col bg-surface-container-low cursor-pointer ${index % 3 === 1 ? 'md:mt-12' : ''}`}
            >
              {/* District image from Contentful, or placeholder */}
              <div className="aspect-[3/2] overflow-hidden relative bg-surface-container-high">
                {district.imageUrl ? (
                  <Image
                    src={normalizeContentfulImageUrl(district.imageUrl)}
                    alt={district.name}
                    width={800}
                    height={533}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-on-surface/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-headline mb-4 group-hover:text-primary transition-colors">
                    {district.name}
                  </h2>
                  {district.polishName && (
                    <p className="text-on-surface/60 leading-relaxed mb-6">
                      {district.polishName}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
                  <span className="text-xs font-bold text-tertiary uppercase tracking-tighter">
                    {i18n("alldistricts.explore")}
                  </span>
                  <span className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
