'use client';
import { createPostURL, createStreetURL } from '../../../lib/urlutil';
import { FancyCard } from "../cards/fancycard";
import Image from 'next/image'

function renderImageUrl(hit: any, locale: string) {
  var url = hit.images && hit.images.length > 0 ? hit.images[0].url : "/resources/images/No-Image-Placeholder.png"
  var imageUrl = url;
  if (/^\/\/.*/.test(url)) {
    imageUrl = `https:${url}`;
  }
  return (imageUrl);
}

export  function OldHit({ hit }: { hit: any }) {
  let lang = "en"; // todo - fix, prob just get from url
  return (
    <>
      {/* STREET */}
      {hit.type === 'street' &&
        <FancyCard skipImage={true} key={hit.germanName} headline={hit.germanName} locale={lang}
          excerpt={hit.polishNames[0]} targetLink={createStreetURL(hit.slug, lang)} imageUrl={renderImageUrl(hit, lang)} />
      }
      {/* POST */}
      {hit.type === 'post' &&
        <>Post</>
      }
    </>
  );
}

export default function CustomHit({ hit }: { hit: any }) {
  let lang = "en";
  return (<>
    <div className="bg-gray-900 p-4 rounded-md shadow-md w-full">
      <div className="flex items-center space-x-3">
        <Image src={renderImageUrl(hit, lang)} alt="Icon" width={30} height={30} className="w-6 h-6"/>
        <a href="#" className="text-pink-500 text-sm font-semibold">{hit.germanName}</a>
      </div>
     {/* <a href={createStreetURL(hit.slug, lang)} className="text-lg font-bold text-white mt-2 block">
        {hit.germanName}
      </a>*/}
      <p className="text-gray-400 text-sm mt-1">
      Todya's name is <strong className="text-white">{hit?.polishNames[0]}</strong>
      </p>
    </div>
  </>);
}

// import { getServerState } from 'react-instantsearch';
// import { useInstantSearch } from 'react-instantsearch';
// import { createPostURL, createStreetURL } from '../../../lib/urlutil';
// import { FancyCard } from "../cards/fancycard";
// import { I18N } from "../../../lib/i18n";


// function AlgoliaHitRenderer({ searchState, searchResults, locale }: { searchState: any, searchResults: any, locale: string }) {
//   const validQuery = true; // searchState.query?.length >= 3;
//   let t = new I18N(locale).getTranslator();
//   return (
//     <>
//       {searchResults?.hits.length === 0 && validQuery && (
//         <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
//           <p>Aw snap! No search results were found.</p>
//         </div>
//       )}
//       {searchResults?.hits.length > 0 && validQuery && (
//         <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
//           <h2 className="text-center text-xl font-bold">{t("cardGrid.headline")}</h2>
//           <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {searchResults.hits.map((hit: any) => (
//               <>
//                 {/* STREET */}
//                 {hit.type === 'street' &&
//                   <FancyCard key={hit.germanName} headline={hit.germanName} locale={locale}
//                     excerpt={hit.polishNames.flat()} targetLink={createStreetURL(hit.slug, locale)} imageUrl={renderImageUrl(hit, locale)} />
//                 }
//                 {/* POST */}
//                 {hit.type === 'post' &&
//                   <>Post</>
//                 }
//               </>
//             ))}
//           </div>
//         </section>
//       )}
//     </>
//   );
// }




