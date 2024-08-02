/**
 * Summary module that shows all available streets in 3 columns
 * and links to the individual street pages.
 */
import { StreetSummary, IDistrict } from '../../lib/contentmodel/wrappertypes';
import Link from 'next/link'
import { createStreetURL } from '../../lib/urlutil';
import resources from './static.resources.json'
import { I18N } from "../../lib/i18n";


// sort out the wrong ones
function filter(streets: StreetSummary[], districtSlug: string) {
  let filtered = [] as StreetSummary[];
  streets.map(street => {
    street.districtRefCollection.items.map(item =>
     (item.slug === districtSlug) && filtered.push(street)
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
  let streets = filter(props.streets, props.district.fields.slug);
  const t = new I18N(props.locale).getTranslator();
  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <h1 className="text-center text-xl font-bold">{t("streetsByDistrict.headline", {"district": props.district.fields.name })}</h1>
        <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {streets.sort((a, b) => a.germanName.localeCompare(b.germanName)).map(street =>
            <a href={createStreetURL(street.slug, props.locale)} key={street.slug}>
              <div>
                <h3 className="font-semibold hover:underline">{street.germanName}</h3>
                <span className="text-sm">
                  <ul>
                  {street.polishNames.map(p =>
                    <li>{p}</li>
                  )}
                  </ul>
                </span>
              </div>
            </a>
          )}
        </div>
        {/* <button onClick={loadMoreStreets} className="text-center">Load more</button> */}
      </section>
    </>
  )
}
