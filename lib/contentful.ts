/**
 * Contentful API wrapper and content access.
 *
 * Uses contentful graphql and cf's javascript sdk to do the heavy lifting.
 * Non-fetch calls (SDK/axios) are cached via Next.js unstable_cache.
 * GraphQL fetch() calls use native Next.js fetch cache with tags.
 */
import { IStreet, IPost, IDistrict, StreetSummary, PostSummary, DistrictSummary } from './contentmodel/wrappertypes';
import { cached } from './contentful-cache';

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

    /**
     * Fetch via contentful graphql query.
     *
     * @param query   - graphql query
     * @param preview -
     * @param tags    - cache invalidationTag
     * @returns
     */
    public async fetchGraphQL(query: string, preview = false, tags: string[] = []) {
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
                next: { tags: [...tags, 'cf'] }
            },
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
        if (locale == "en")
            this.locale = "en-US";
        else
            this.locale = locale;
    }

    /** return the contentful client */
    public getClient() {
        return contentfulClient;
    }

    /**
     * Return all streets
     * @param preview
     * @returns StreetSummary[]
     */
    public async getAllStreets(preview = false) {
        const entries = await cached(
            () => this.doGetStreets(100, preview),
            ['all-streets'],
            ['streets'],
            this.cacheTimeout
        );
        return entries as StreetSummary[];
    }

    /**
     * Get the streets in batches since there's an annoying query limit of 1000 results
     * in contentful's graphql api.
     *
     * @param batchSize
     * @param preview
     */
    private async doGetStreets(batchSize: number = 100, preview: boolean = false) {
        let currentBatchSize = 0;
        let offset = 0;
        let result = [] as StreetSummary[];
        do {
            const currentResult = await this.fetchGraphQL(
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
                    }`,
                    preview,
                    [ 'streets' ]

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
    * @param limit up to how many to return, defaults to 1000
    * @returns PostSummary[]
    */
    public async getAllPosts(preview = false, limit = 1000) {
        const entries = await cached(
            () => this.fetchGraphQL(
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
                }`,
                preview,
                ['posts']
            ),
            ['all-posts'],
            ['posts'],
            this.cacheTimeout
        );
        return entries?.data?.postCollection?.items as PostSummary[];
    }

    /**
     * get a street object from contentful by name
     */
    public async getStreetBySlug(slug: string, locale: string = this.locale) {
        const query = {
            content_type: 'street',
            'fields.slug': slug,
            'locale': locale,
        };

        const entry = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items.length == 0 ? null : entries.items[0];
            }),
            ['street-by-name', slug, locale],
            ['streets'],
            this.cacheTimeout
        ) as IStreet;
        return entry;
    }


    /**
     * @returns get the posts for the homepage
     */
    public async getHomepagePosts(locale: string = this.locale) {
        const query = {
            content_type: 'post',
            order: '-sys.createdAt',
            'fields.showIn': "Homepage",
            'fields.showIn[nin]': "Hero",
            'locale': locale,
            limit: 10
        };

        const entries = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items;
            }),
            ['homepage-posts', locale],
            ['posts'],
            3600
        );

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

        const entry = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items.length == 0 ? null : entries.items[0];
            }),
            ['homepage-hero-post', locale],
            ['posts'],
            3600
        );

        if (!entry) return null;
        return entry as IPost;
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

        const entries = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items;
            }),
            ['navigation-posts', locale],
            ['posts'],
            this.cacheTimeout
        );
        return entries as IPost[];
    }

    // get a post by slug
    public async getPostBySlug(slug: string, locale: string = this.locale) {
        const query = {
            content_type: 'post',
            'fields.slug': slug,
            'locale': locale,
        };

        const entry = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items.length == 0 ? null : entries.items[0];
            }),
            ['post-by-slug', slug, locale],
            ['posts'],
            this.cacheTimeout
        ) as IPost;
        return entry;
    }

    /**
     * @param locale
     * @returns array of DistrictSummary
     */
    public async getAllDistricts(locale: string = this.locale, preview: boolean = false) {
        return await cached(
            async () => {
                let result = [] as DistrictSummary[];
                const currentResult = await this.fetchGraphQL(
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
                            }`,
                            preview,
                            ['districts']
                )
                result = result.concat(currentResult?.data?.districtCollection?.items);
                return result;
            },
            ['all-districts', locale, String(preview)],
            ['districts'],
            this.cacheTimeout
        ) as DistrictSummary[];
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

        const entry = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items.length == 0 ? null : entries.items[0];
            }),
            ['district-by-slug', slug, locale],
            ['districts'],
            this.cacheTimeout
        ) as IDistrict;
        return entry;
    }

}
