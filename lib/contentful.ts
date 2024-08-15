/**
 * Contentful API wrapper and content access.
 * 
 */
import { IStreet, IPost, StreetSummary, PostSummary, DistrictSummary } from './contentmodel/wrappertypes';
import { ObjectCache } from './objectcache';


// REDIS cache
const cache = new ObjectCache();
// logging
import { log } from 'next-axiom'
// contentful client
import { createClient } from "contentful";
export const contentfulClient = createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
    space: process.env.CONTENTFUL_SPACE_ID ?? "",
    host: process.env.CONTENTFUL_HOST as string,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "",
});

abstract class AbstractContentfulLoader {

    public async fetchGraphQL(query: string, preview = false) {
        return fetch(
            `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${preview
                        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                        : process.env.CONTENTFUL_ACCESS_TOKEN
                        }`,
                },
                body: JSON.stringify({ query }),
            }
        ).then((response) => response.json())
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////// 
// 
//////////////////////////////////////////////////////////////////////////////////////////////// 

////// 
export class ContentfulLoader extends AbstractContentfulLoader {

    private cacheTimeout: number;
    private locale: string;

    constructor(cacheTimeout: number = 60 * 60, locale: string = "en-US") {
        super();
        this.cacheTimeout = cacheTimeout;
        this.locale = locale;
    }


    /** return the contentful client */
    public getClient() {
        return contentfulClient;
    }


    /**
     * Return all streets
     * @param preview 
     * @param limit up to how many to return, defaults to 2000
     * @returns StreetSummary[]
     * @todo: add city name at some point
     */
    public async getAllStreets(preview = false) {
        const cacheKey = "all-streets";
        const entries = await cache.getCachedEntry(cacheKey, () => {
            return this.doGetStreets();
        }, this.cacheTimeout);
        return entries as StreetSummary[];
    }

    /**
     * Get the streets in batches since there's an annoying query limit of 1000 results
     * in contentful's graphql api.
     * 
     * Uncached.
     * 
     * @param limit 
     * @param preview 
     */
    private async doGetStreets(batchSize: number = 100, preview: boolean = false) {
        let currentBatchSize = 0;
        let offset = 0;
        let result = [] as StreetSummary[];
        do {
            let currentResult = await this.fetchGraphQL(
                `query {
                    streetCollection(limit: ${batchSize}, skip: ${offset} preview: ${preview ? 'true' : 'false'}) {
                        items {
                            germanName    
                            polishNames
                            slug
                            districtRefCollection {
                                items {
                                    slug
                                }
                            }
                            sys {
                                id
                            }
                        }
                    }
                    }`
            )
            currentBatchSize = currentResult?.data?.streetCollection?.items?.length ?? 0;
            offset += currentBatchSize;
            result = result.concat(currentResult?.data?.streetCollection?.items);
        } while (currentBatchSize > 0);
        log.debug(`Loaded ${result.length} streets in batches of ${batchSize}`);
        return result;
    }


    /**
    * Return all posts
    * @param preview 
    * @param limit up to how many to return, defaults to 2000
    * @returns PostSummary[]
    * @todo: add city name at some point
    */
    public async getAllPosts(preview = false, limit = 1000) {
        const cacheKey = "all-posts";

        const entries = await cache.getCachedEntry(cacheKey, () => {
            return this.fetchGraphQL(
                `query {
                    postCollection(limit: ${limit}, preview: ${preview ? 'true' : 'false'}) {
                    items {
                        title    
                        slug
                        sys {
                            id
                        }
                    }
                }
                }`
            )
        }, this.cacheTimeout);
        return entries?.data?.postCollection?.items as PostSummary[];
    }

    /**
     * get a street object from contentful by name
     */
    public async getStreetBySlug(slug: string, locale: string = this.locale) {

        // query by name
        const query = {
            content_type: 'street',
            'fields.slug': slug,
            'locale': locale,
        };
        const cacheKey = "street-by-name-" + slug + "-" + locale;

        const entry = await cache.getCachedEntry(cacheKey, () => {
            //const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items.length == 0 ? null : entries.items[0];
            });

        }, this.cacheTimeout) as IStreet;
        return entry;
    }

    /**
     * 
     * @returns get the posts for the homepage
     */
    public async getHomepagePosts(locale: string = this.locale) {
        const query = {
            content_type: 'post',
            order: '-sys.createdAt',
            'fields.showIn': "Homepage",
            'fields.showIn[nin]': "Hero",
            'locale': locale,
            // 'fields.showIn[nin]': "Hero",
            limit: 10
        };
        const cacheKey = "homepage-posts-3-" + locale;
        const entries = await cache.getCachedEntry(cacheKey, () => {
            //const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items;
            });

        }, 60 * 60 /* cache for an hour */);

        console.log("homepage posts", entries as IPost[]);

        return entries as IPost[];
    }

    /** Homepage Hero */
    public async getHomepageHeroPost(locale: string = this.locale) {
        const query = {
            content_type: 'post',
            'fields.showIn': "Hero",
            'locale': locale,
            limit: 1,
            'include': 2
        };
        const cacheKey = "homepage-hero-post-" + locale;
        const entry = await cache.getCachedEntry(cacheKey, () => {
            //const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items.length == 0 ? null : entries.items[0];
            });

        }, 60 * 60 /* cache for an hour */);
        // ok

        if (!entry || entry.length == 0) return [];
        // just fetched one

        return entry;
    }


    /** Get the posts to put into the navigation */
    public async getNavigationPosts(locale: string = this.locale) {
        const query = {
            content_type: 'post',
            order: '-sys.createdAt',
            'fields.showIn': "Navigation",
            'locale': locale,
            limit: 10
        };
        const cacheKey = "navigation-posts-" + locale;
        const entries = await cache.getCachedEntry(cacheKey, () => {
            //const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items;
            });

        }, this.cacheTimeout);
        return entries as IPost[];
    }

    // get a post by slug
    public async getPostBySlug(slug: string, locale: string = this.locale) {
        const query = {
            content_type: 'post',
            'fields.slug': slug,
            'locale': locale,
        };
        const cacheKey = "post-by-slug-" + slug + "-" + locale;
        const entry = await cache.getCachedEntry(cacheKey, () => {
            // const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items.length == 0 ? null : entries.items[0];
            });
        }, this.cacheTimeout) as IPost;
        return entry;
    }

    /**
     * 
     * @param locale 
     * @returns array of DistrictSummary
     */
    public async getAllDistricts(locale: string = this.locale) {
        let result = [] as DistrictSummary[];
        let currentResult = await this.fetchGraphQL(
            `query {
                    districtCollection(limit: 50) {
                        items {
                            slug    
                            name
                            polishName
                            sys {
                                id
                            }
                        }
                    }
                    }`
        )
        result = result.concat(currentResult?.data?.districtCollection?.items);
        return result;
    }


    /**
     * Retrieve a district by slug
     * @param slug 
     * @param locale 
     * @returns 
     */
    public async getDistrictBySlug(slug: string, locale: string = this.locale) {
        const query = {
            content_type: 'district',
            'fields.slug': slug,
            'locale': locale,
        };
        const cacheKey = "district-by-slug-" + slug + "-" + locale;
        const entry = await cache.getCachedEntry(cacheKey, () => {
            // const queryString = JSON.stringify(query);
            return contentfulClient.getEntries(query).then((entries) => {
                // check if we got a result
                return entries.items.length == 0 ? null : entries.items[0];
            });
        }, this.cacheTimeout) as IPost;
        return entry;
    }

}
