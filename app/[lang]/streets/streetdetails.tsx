import { IStreet } from '../../../lib/contentmodel/wrappertypes';
import { RichtextComponent } from '../contentful'
import { DistrictNames } from './districtNames'
import dynamic from 'next/dynamic';
import React from "react";
import { I18N } from "../../../lib/i18n";
import Lightbox2 from './lightbox';

const GoogleMap = dynamic(() => import('./googleMap').then(mod => mod.GoogleMap), {
  loading: () => <div style={{ height: '30vh', width: '100%' }} className="bg-surface-container-high animate-pulse rounded" />,
});

type StreetDetailProps = {
  street: IStreet,
  locale: string
}

export function StreetDetail(props: StreetDetailProps) {
  const street = props.street;
  const i18n = new I18N(props.locale).getTranslator();
  const polishName = street.fields.polishNames?.[0] ?? '';

  return (
    <>
      {/* Hero Header */}
      <header className="mb-20">
        <h1 className="text-6xl md:text-8xl font-headline font-bold text-on-surface leading-none tracking-tighter mb-4">
          {street.fields.germanName}
        </h1>
        {polishName && (
          <div className="flex items-center space-x-4">
            <div className="h-px w-12 bg-primary"></div>
            <p className="text-2xl font-headline italic text-on-surface/60">
              {polishName}
            </p>
          </div>
        )}
        {street.fields.previousNames && (
          <p className="mt-4 text-sm text-on-surface/50 font-label italic">
            {street.fields.previousNames}
          </p>
        )}
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main content (left) */}
        <div className="lg:col-span-8 space-y-24">
          {/* Historical Overview */}
          <section>
            <h2 className="text-4xl font-headline font-bold mb-8 text-primary">
              {i18n("streetdetail.history")}
            </h2>
            {street.fields.history ? (
              <div className="prose prose-lg max-w-none text-on-surface leading-relaxed space-y-6">
                <RichtextComponent content={street.fields.history} locale={props.locale} />
              </div>
            ) : (
              <p className="text-on-surface/50 italic">{i18n("streetdetail.noHistory")}</p>
            )}
          </section>

          {/* Historical Gallery */}
          {street.fields?.media && street.fields.media.length > 0 && (
            <section>
              <h2 className="text-4xl font-headline font-bold mb-12">
                {i18n("streetdetail.pictures")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Lightbox2
                  slides={street.fields.media.map(item => ({
                    src: item.fields.image.fields.file?.url as string,
                    title: item.fields.title,
                    source: item.fields.source,
                    id: item.sys.id,
                    description: item.fields.description,
                  }))}
                />
              </div>
            </section>
          )}

          {/* Source attribution */}
          {street.fields.source && (
            <div className="pt-8 border-t border-outline-variant/20">
              <span className="text-sm text-on-surface/50 font-label">
                Source(s): {street.fields.source}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar (right) */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Quick Facts */}
          <div className="bg-primary p-8 text-on-primary rounded-lg editorial-shadow">
            <h3 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {i18n("streetdetail.quickFacts")}
            </h3>
            <ul className="space-y-4">
              {polishName && (
                <li className="pb-4 border-b border-on-primary/20">
                  <span className="block text-xs uppercase tracking-widest opacity-70">{i18n("streetdetail.polishNames")}</span>
                  <span className="font-bold">{street.fields.polishNames?.join(', ')}</span>
                </li>
              )}
              <li className="pb-4 border-b border-on-primary/20">
                <span className="block text-xs uppercase tracking-widest opacity-70">{i18n("streetdetail.district")}</span>
                <span className="font-bold">
                  <DistrictNames street={street} locale={props.locale} linkable={false} />
                </span>
              </li>
              {street.fields.previousNames && (
                <li>
                  <span className="block text-xs uppercase tracking-widest opacity-70">{i18n("streetdetail.previousNames")}</span>
                  <span className="font-bold">{street.fields.previousNames}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Map */}
          <div className="bg-surface-container-high rounded-lg overflow-hidden">
            <GoogleMap street={street} />
          </div>
        </aside>
      </div>
    </>
  );
}
