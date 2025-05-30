import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { IStreet, IDistrict } from '../../../lib/contentmodel/wrappertypes';
import { RichtextComponent } from '../contentful'
import { DistrictNames } from './districtNames'
import { GoogleMap } from './googleMap'
import React from "react";
import { I18N } from "../../../lib/i18n";
import Lightbox2 from './lightbox';


type StreetDetailProps = {
  street: IStreet,
  locale: string
}
export function StreetDetail(props: StreetDetailProps) {
  const { street, locale } = props;
  const i18n = new I18N(locale).getTranslator();
  const hasHeroImage = street.fields?.media?.[0]?.fields.image.fields.file?.url;

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - Adaptive Height */}
      <header className={`relative w-full flex items-end 
        ${hasHeroImage ? 'h-[30vh]' : 'h-[30vh]'}
        bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700`}
      >
        {/* Conditional Hero Image */}
        {hasHeroImage && (
          <div className="absolute inset-0">
            <img
              src={street.fields.media[0]?.fields.image.fields.file?.url?.toString()}
              alt=""
              className="w-full h-full object-cover opacity-80 dark:opacity-40"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Decorative Background Pattern when no image */}
        {!hasHeroImage && (
          <div className="absolute inset-0 opacity-90 brightness-50">
           <img
              src="/resources/images/generated-danzig.png"
              alt=""
              className="w-full h-full object-cover opacity-160"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative w-full max-w-screen-xl mx-auto px-6 pb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">
              {street.fields.germanName}
            </h1>
            {street.fields.previousNames && (
              <div className="flex flex-col gap-2">
                <p className="text-lg text-white/80">
                  {street.fields.previousNames}
                </p>
                <div className="flex gap-2">
                  {street.fields.district_ref?.map((district: IDistrict, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full 
                               bg-white/10 backdrop-blur-sm text-white/90 text-sm"
                    >
                      {district.fields.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative -mt-8 bg-white dark:bg-black rounded-t-3xl shadow-xl">
        <div className="max-w-screen-xl mx-auto px-6 pt-12 pb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - History */}
            <section className="space-y-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-medium mb-6 text-gray-900 dark:text-white">
                  {i18n("streetdetail.history")}
                </h2>
                <RichtextComponent content={street.fields.history} locale={locale} />
              </div>

              {/* Info Cards */}
              <div className="space-y-6">
                {/* District Card */}
                <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 
                              backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 
                                    flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-300" 
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {i18n("streetdetail.district")}
                      </h3>
                      <div className="mt-2 text-gray-600 dark:text-gray-300">
                        <DistrictNames street={street} locale={locale} linkable={false} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Polish Names Card */}
                {street.fields.polishNames && (
                  <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 
                                backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 
                                      flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-300" 
                               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {i18n("streetdetail.polishNames")}
                        </h3>
                        <div className="mt-2 space-y-1">
                          {street.fields.polishNames?.map((name, index) => (
                            <p key={`pn-${index}`} className="text-gray-600 dark:text-gray-300">{name}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right Column - Map */}
            <section className="lg:sticky lg:top-6 h-fit">
              <h2 className="text-3xl font-medium mb-6 text-gray-900 dark:text-white">
                {i18n("streetdetail.map")}
              </h2>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <GoogleMap street={street} />
              </div>
            </section>
          </div>

          {/* Image Gallery */}
          {street.fields?.media && street.fields.media.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-medium mb-8 text-gray-900 dark:text-white">
                {i18n("streetdetail.pictures")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Lightbox2 
                  slides={street.fields.media.map(item => ({
                    src: item.fields.image.fields.file?.url as string,
                    title: item.fields.title,
                    source: item.fields.source,
                    id: item.sys.id,
                    description: item.fields.description
                  }))} 
                />
              </div>
            </section>
          )}

          {/* Sources */}
          {street.fields.source && (
            <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Source(s): {street.fields.source}
              </p>
            </footer>
          )}
        </div>
      </main>
    </article>
  );
}
