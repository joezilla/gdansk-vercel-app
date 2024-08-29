/* search api request */

/**
 * Generic Algolia Indexer
 */
// logging
import { log } from 'next-axiom'
import { StreetSummary } from '../types/streetApi'
// util

// //// algolia
import algoliasearch from 'algoliasearch';
const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID ?? "",
    process.env.ALGOLIA_ACCESS_TOKEN ?? "");

const algoliaIndexEn = searchClient.initIndex(process.env.ALGOLIA_INDEX_NAME + "-en-US" ?? "");
const algoliaIndexDe = searchClient.initIndex(process.env.ALGOLIA_INDEX_NAME + "-de" ?? "");

type AlgoliaHits = {
    hits: AlgoliaHit[];
};

type AlgoliaHit = {
    identifier: string;
    germanName: string;
    polishNames: string[];
    images: {
        url: string
    }[],
    district: string;
    slug: string;
    hasImages: boolean;
    type: string;
};


type SimpleStreetHit = {
    germanName: string;
    polishNames: string[];
    mainImage: string;
    slug: string;
}

export class AlgoliaApi {
    constructor(private locale: string = "en-US") { }

    public getIndex() {
        console.log(`Locale is ${this.locale}`);
        if (this.locale === "en-US" || this.locale === "en")
            return algoliaIndexEn;
        if (this.locale === "de")
            return algoliaIndexDe;
        throw `Locale ${this.locale} not defined or supported for algolia indexing.`;
    }

    /**
     * 
     * @param offset returns IStreet objects in an array
     */
    public async getStreetsWithImages(offset: number = 0, count: number = 6) {

        const content: AlgoliaHits = await this.getIndex().search("",
            {
                offset: offset,
                length: count,
                filters: 'hasImages = 1',
                facetFilters: 'type:street'
            });

        // content.hits.forEach((x) =>
        //     console.log(x.images[0])
        // );

        var data: StreetSummary[] = [];

        content.hits.forEach((e) => {

            console.debug(e);

            var imageUrl;
            if (/^(https?:).*/.test(e.images[0].url)) {
                imageUrl = e.images[0].url;
            } else {
                imageUrl = `https:${e.images[0].url}`;
            }

            data.push({
                germanName: e.germanName,
                imageUrl: imageUrl,
                polishNames: e.polishNames,
                slug: e.slug
            })
        }
        );
        return data;

    }
}
