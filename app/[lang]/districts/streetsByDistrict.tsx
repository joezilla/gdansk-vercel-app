export const dynamic = 'force-dynamic'

import { StreetSummary, IDistrict } from '../../../lib/contentmodel/wrappertypes';
import Link from 'next/link'
import { createStreetURL } from '../../../lib/urlutil';
import { I18N } from "../../../lib/i18n";

function filter(streets: StreetSummary[], districtSlug: string) {
  const filtered = [] as StreetSummary[];
  streets.map(street => {
    (street.districtRefCollection?.items ?? []).map(item =>
      (item?.slug === districtSlug) && filtered.push(street)
    );
  });
  return filtered;
}

type AllDistrictProps = {
  streets: StreetSummary[],
  district: IDistrict,
  locale: string
}

export function StreetsByDistrict(props: AllDistrictProps) {
  const streets = filter(props.streets, props.district.fields.slug);
  const t = new I18N(props.locale).getTranslator();

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
        <h2 className="text-4xl font-headline border-l-4 border-primary pl-6">
          {t("streetsByDistrict.headline", { "district": props.district.fields.name })}
        </h2>
        <span className="text-xs font-label uppercase tracking-widest text-on-surface/40">
          {streets.length} streets
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {streets.sort((a, b) => a.germanName.localeCompare(b.germanName)).map(street => (
          <Link
            href={createStreetURL(street.slug, props.locale)}
            key={street.slug}
            className="group grid grid-cols-1 md:grid-cols-12 items-center px-6 py-5 bg-surface-container-lowest hover:bg-surface-container-high transition-all duration-300 border-l-4 border-transparent hover:border-primary"
          >
            <div className="col-span-6 mb-1 md:mb-0">
              <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                {street.germanName}
              </h3>
            </div>
            <div className="col-span-5 mb-1 md:mb-0">
              {street.polishNames?.[0] && (
                <span className="text-base text-tertiary underline underline-offset-4 decoration-tertiary/20">
                  {street.polishNames[0]}
                </span>
              )}
            </div>
            <div className="col-span-1 text-right hidden md:block">
              <svg className="w-4 h-4 text-on-surface/40 group-hover:text-primary transition-colors inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
