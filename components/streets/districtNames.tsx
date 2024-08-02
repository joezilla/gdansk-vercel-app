/**
 * Summary module that shows all available streets in 3 columns
 * and links to the individual street pages.
 */
import { IDistrict, IStreet } from '../../lib/contentmodel/wrappertypes';
import { createDistrictURL, createStreetURL } from '../../lib/urlutil';
// import { I18N } from "../../lib/i18n";

type DistrictProps = {
  street: IStreet,
  locale: string,
  linkable: boolean
}

export function DistrictNames(props: DistrictProps) {
  return (
    <>
    <ul>
      {props.street.fields.district_ref.map(d =>
        <>
          <li key={d.fields.slug}><a className="hover:underline" href={createDistrictURL(d.fields.slug, props.locale)}>{d.fields.name}</a></li>
        </>
      )}
      </ul>

    </>
  )
}
