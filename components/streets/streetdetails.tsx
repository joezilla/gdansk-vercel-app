
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { IStreet, IImageWithFocalPoint } from '../../src/@types/contentful'
import { RichtextComponent } from '../contentful'
import { GoogleMap } from './googleMap'
import React from "react";
import resources from './static.resources.json'
import { StreetSearch } from "../search";


// uses https://www.npmjs.com/package/react-responsive-carousel

function renderImage(image: IImageWithFocalPoint) {
  return (
    <div>
      <img alt="" key={image.sys.id} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square" src={image.fields.image.fields.file.url} />
    </div>
  )
}

type StreetDetailProps = {
  street: IStreet
}
export function StreetDetail(props: StreetDetailProps) {
  let street = props.street;

  return (
    <>
      <section className="dark:bg-gray-800 dark:text-gray-100">
        <div className="container max-w-xl p-6 mx-auto space-y-12 lg:px-8 lg:max-w-7xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-5xl dark:text-gray-50">{street.fields.germanName}</h2>
            <p className="max-w-3xl mx-auto mt-4 text-l text-center dark:text-gray-400">{street.fields.previousNames ?? ""}</p>
          </div>
          <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="text-2xl py-2 font-bold tracking-tight sm:text-3xl dark:text-gray-50">{resources.en.headlines.history}</h3>
              <RichtextComponent content={street.fields.history} />
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
                    <h4 className="text-lg font-medium leading-6 dark:text-gray-50">{resources.en.headlines.district}</h4>
                    <p className="mt-2 dark:text-gray-400">{street.fields.district}</p>
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
                    <h4 className="text-lg font-medium leading-6 dark:text-gray-50">{resources.en.headlines.polishNames}</h4>
                    <p className="mt-2 dark:text-gray-400">{street.fields.polishNames}</p>
                  </div>
                </div>
                {street.fields.previousNames &&
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-400 dark:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium leading-6 dark:text-gray-50 mb-2">{resources.en.headlines.previousNames}</h4>
                      {street.fields.previousNames?.split(",").map(name => <p className="mt-1 dark:text-gray-400">{name}</p>)}
                    </div>
                  </div>}
              </div>
            </div>
            <div aria-hidden="true" className="mt-10 lg:mt-0 top-0">
              <h3 className="text-2xl py-2 font-bold tracking-tight sm:text-3xl dark:text-gray-50">Map</h3>
              <GoogleMap street={street} />
            </div>
          </div>
        </div>
        <div className="container max-w-xl p-6 mx-auto space-y-6 lg:px-8 lg:max-w-7xl">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-gray-50">{resources.en.headlines.pictures}</h3>
          <div className="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
            {street.fields?.media?.map(item =>
              renderImage(item)
            )}
          </div>
        </div>

      </section>



    </>


  );
}
