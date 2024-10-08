
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { IStreet, IImageWithFocalPoint } from '../../../lib/contentmodel/wrappertypes';
import { RichtextComponent } from '../contentful'
import { DistrictNames } from './districtNames'
import { GoogleMap } from './googleMap'
import React from "react";
import { I18N } from "../../../lib/i18n";
import Lightbox2 from './lightbox';

// image for carousel
function renderImage(image: IImageWithFocalPoint) {
  return (
    <div className="mb-4" key={image.sys.id}>
      <a className="example-image-link" href={image.fields.image.fields.file?.url as string} data-lightbox="street-pics" data-title={`${image.fields.title}, Source: ${image.fields.source ?? "-"}`}>
        <img alt={image.fields.title} key={image.sys.id} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square" src={image.fields.image.fields.file?.url as string} />
        <span className="text-xs">Source: {image.fields.source}</span>
      </a>
    </div>
  )
}

type StreetDetailProps = {
  street: IStreet,
  locale: string
}
export function StreetDetail(props: StreetDetailProps) {
  let street = props.street;
  const i18n = new I18N(props.locale).getTranslator();

  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <div className="container max-w-xl p-6 mx-auto space-y-12 lg:px-8 lg:max-w-7xl">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-center sm:text-5xl dark:text-gray-50">{street.fields.germanName}</h1>
            <p className="max-w-3xl mx-auto mt-4 text-l text-center dark:text-gray-400">{street.fields.previousNames ?? ""}</p>
          </div>
          <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl py-2 font-bold tracking-tight sm:text-3xl dark:text-gray-50">{i18n("streetdetail.history")}</h2>
              <RichtextComponent content={street.fields.history} locale={props.locale} />
              <div className="mt-12 space-y-12">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-400 dark:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 dark:text-gray-50">{i18n("streetdetail.district")}</h3>
                    <div className="mt-2 dark:text-gray-400"><DistrictNames street={street} locale={props.locale} linkable={false} /></div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-400 dark:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 dark:text-gray-50">{i18n("streetdetail.polishNames")}</h3>
                    {street.fields.polishNames?.map((name, index) => <p className="mt-1 dark:text-gray-400" key={`pn-${index}`}>{name}</p>)}
                  </div>
                </div>
                {street.fields.previousNames &&
                  <div className="flex">
                    <div className="flex- shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-400 dark:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium leading-6 dark:text-gray-50 mb-2">{i18n("streetdetail.previousNames")}</h3>
                      {street.fields.previousNames?.split(",").map((name, index) => <p className="mt-1 dark:text-gray-400" key={`pn-${index}`}>{name}</p>)}
                    </div>
                  </div>}
              </div>
            </div>
            <div aria-hidden="true" className="mt-4 lg:mt-0 top-0">
              <h2 className="text-2xl py-2 font-bold tracking-tight sm:text-3xl dark:text-gray-50">{i18n("streetdetail.map")}</h2>
              <GoogleMap street={street} />
            </div>
          </div>
        </div>
        {street.fields.source &&
          <div className="container max-w-xl p-6 mx-auto space-y-6 lg:px-8 lg:max-w-7xl">
            <span className="text-sm">Source(s): {street.fields.source}</span>
          </div>
        }
        {street.fields?.media &&
          <div className="container max-w-xl p-6 mx-auto space-y-6 lg:px-8 lg:max-w-7xl">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-gray-50">{i18n("streetdetail.pictures")}</h3>
            <div className="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
              <Lightbox2 slides={street.fields?.media?.map(item => ({ src: item.fields.image.fields.file?.url as string, title: item.fields.title, source: item.fields.source, id: item.sys.id, description: item.fields.description })) ?? []} />
            </div>
          </div>
        }

      </section>



    </>


  );
}
