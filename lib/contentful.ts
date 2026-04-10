/**
 * Contentful API wrapper and content access.
 *
 * Uses contentful graphql and cf's javascript sdk to do the heavy lifting.
 * Non-fetch calls (SDK/axios) are cached via Next.js unstable_cache.
 * GraphQL fetch() calls use native Next.js fetch cache with tags.
 *
 * Caching strategy:
 * - Long safety-net TTLs (days/weeks) — cache persists until webhook invalidates.
 * - Fine-grained tags: per-entry (`street:${slug}`) + list (`streets-list`).
 * - Request-scoped deduplication via React.cache().
 */
import { cache as reactCache } from 'react';
import { IStreet, IPost, IDistrict, IHomepage, StreetSummary, PostSummary, DistrictSummary } from './contentmodel/wrappertypes';
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

// Safety-net TTLs. Real invalidation happens via Contentful webhooks
// calling revalidateTag() on the tags below. These long TTLs exist only
// to recover if a webhook is ever missed.
const TTL_DAY = 60 * 60 * 24;
const TTL_WEEK = TTL_DAY * 7;
const TTL_MONTH = TTL_DAY * 30;

abstract class AbstractContentfulLoader {

    /**
     * Fetch via contentful graphql query.
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

export class ContentfulLoader extends AbstractContentfulLoader {

    private locale: string;

    // cacheTimeout retained only for backward-compatibility with existing callers.
    // It is no longer used — per-method TTLs are now defined below as constants.
    constructor(_cacheTimeout: number = 60 * 60, locale: string = "en-US") {
        super();
        if (locale == "en")
            this.locale = "en-US";
        else
            this.locale = locale;
    }

    public getClient() {
        return contentfulClient;
    }

    /**
     * Return all streets.
     * Cached: 7 days + invalidated by `streets-list` tag.
     */
    public getAllStreets = reactCache(async (preview = false) => {
        const entries = await cached(
            () => this.doGetStreets(100, preview),
            ['all-streets'],
            ['streets', 'streets-list'],
            TTL_WEEK
        );
        return entries as StreetSummary[];
    });

    /**
     * Get the streets in batches. Contentful's graphql api has a 1000 result limit.
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
                    [ 'streets', 'streets-list' ]
            )
            const items = currentResult?.data?.streetCollection?.items;
            currentBatchSize = items?.length ?? 0;
            offset += currentBatchSize;
            if (items) result = result.concat(items.filter(Boolean));
        } while (currentBatchSize > 0);
        log.debug(`Loaded ${result.length} streets in batches of ${batchSize}`);
        return result;
    }

    /**
     * Return all posts.
     * Cached: 7 days + invalidated by `posts-list` tag.
     */
    public getAllPosts = reactCache(async (preview = false, limit = 1000) => {
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
                ['posts', 'posts-list']
            ),
            ['all-posts'],
            ['posts', 'posts-list'],
            TTL_WEEK
        );
        return ((entries?.data?.postCollection?.items ?? []).filter(Boolean)) as PostSummary[];
    });

    /**
     * Get a street by slug.
     * Cached: 1 month + invalidated by `street:${slug}` tag.
     */
    public getStreetBySlug = reactCache(async (slug: string, locale: string = this.locale) => {
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
            ['streets', `street:${slug}`],
            TTL_MONTH
        ) as IStreet;
        return entry;
    });

    /**
     * Get homepage posts.
     * Cached: 7 days + invalidated by `posts-list` tag.
     */
    public getHomepagePosts = reactCache(async (locale: string = this.locale) => {
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
            ['posts', 'posts-list', 'homepage'],
            TTL_WEEK
        );

        return entries as IPost[];
    });

    /**
     * Homepage Hero post.
     * Cached: 7 days + invalidated by `posts-list` or `homepage` tag.
     */
    public getHomepageHeroPost = reactCache(async (locale: string = this.locale) => {
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
            ['posts', 'posts-list', 'homepage'],
            TTL_WEEK
        );

        if (!entry) return null;
        return entry as IPost;
    });

    /**
     * Navigation posts — shown in header on every page.
     * Cached: 1 month + invalidated by `navigation` or `posts-list` tag.
     * Navigation almost never changes; this runs on every page request so
     * long TTL is critical for API call reduction.
     */
    public getNavigationPosts = reactCache(async (locale: string = this.locale) => {
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
            ['posts', 'posts-list', 'navigation'],
            TTL_MONTH
        );
        return entries as IPost[];
    });

    /**
     * Get a post by slug.
     * Cached: 1 month + invalidated by `post:${slug}` tag.
     */
    public getPostBySlug = reactCache(async (slug: string, locale: string = this.locale) => {
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
            ['posts', `post:${slug}`],
            TTL_MONTH
        ) as IPost;
        return entry;
    });

    /**
     * Return all districts.
     * Cached: 7 days + invalidated by `districts-list` tag.
     */
    public getAllDistricts = reactCache(async (locale: string = this.locale, preview: boolean = false) => {
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
                                    image {
                                        url
                                    }
                                    sys {
                                        id
                                    }
                                }
                            }
                            }`,
                            preview,
                            ['districts', 'districts-list']
                )
                const items = currentResult?.data?.districtCollection?.items;
                if (items) result = result.concat(
                    items.filter(Boolean).map((d: any) => ({
                        ...d,
                        imageUrl: d.image?.url ? (d.image.url.startsWith('//') ? `https:${d.image.url}` : d.image.url) : undefined,
                    }))
                );
                return result;
            },
            ['all-districts', locale, String(preview)],
            ['districts', 'districts-list'],
            TTL_WEEK
        ) as DistrictSummary[];
    });

    /**
     * Get a district by slug.
     * Cached: 1 month + invalidated by `district:${slug}` tag.
     */
    public getDistrictBySlug = reactCache(async (slug: string, locale: string = this.locale) => {
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
            ['districts', `district:${slug}`],
            TTL_MONTH
        ) as IDistrict;
        return entry;
    });

    /**
     * Homepage content (hero, featured refs, SEO text).
     * Cached: 1 month + invalidated by `homepage` tag.
     */
    public getHomepageContent = reactCache(async (locale: string = this.locale) => {
        const cfLocale = locale === 'de' ? 'de' : 'en-US';
        const query = {
            content_type: 'homepage',
            'fields.locale': locale === 'en-US' ? 'en' : (locale === 'de' ? 'de' : 'en'),
            locale: cfLocale,
            include: 3,
            limit: 1,
        };

        const entry = await cached(
            () => contentfulClient.getEntries(query).then((entries) => {
                return entries.items.length === 0 ? null : entries.items[0];
            }),
            ['homepage-content', locale],
            ['homepage'],
            TTL_MONTH
        ) as IHomepage | null;
        return entry;
    });

}

// ---------------------------------------------------------------------------
// Backend factory — switch between Contentful API and local file export
// ---------------------------------------------------------------------------

import { FileContentfulLoader } from './contentfulFile';

/**
 * Common interface for API-backed and file-backed loaders.
 * Both expose the same methods so callers don't care which backend is active.
 */
export type IContentfulLoader = {
    getClient: () => any;
    getAllStreets: (preview?: boolean) => Promise<StreetSummary[]>;
    getAllPosts: (preview?: boolean, limit?: number) => Promise<PostSummary[]>;
    getStreetBySlug: (slug: string, locale?: string) => Promise<IStreet | null>;
    getPostBySlug: (slug: string, locale?: string) => Promise<IPost | null>;
    getDistrictBySlug: (slug: string, locale?: string) => Promise<IDistrict | null>;
    getHomepagePosts: (locale?: string) => Promise<IPost[]>;
    getHomepageHeroPost: (locale?: string) => Promise<IPost | null>;
    getNavigationPosts: (locale?: string) => Promise<IPost[]>;
    getAllDistricts: (locale?: string, preview?: boolean) => Promise<DistrictSummary[]>;
    getHomepageContent: (locale?: string) => Promise<IHomepage | null>;
};

/**
 * Returns the configured Contentful loader.
 *
 * Set CONTENTFUL_BACKEND=file in .env to use the local JSON export
 * (content/2026-04-10/contentful-export-*.json) instead of Contentful's API.
 * Any other value (or unset) uses the live Contentful API.
 */
export function getContentfulLoader(cacheTimeout: number = 60 * 60, locale: string = 'en-US'): IContentfulLoader {
    const backend = (process.env.CONTENTFUL_BACKEND ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase();
    if (backend === 'file') {
        return new FileContentfulLoader(cacheTimeout, locale) as unknown as IContentfulLoader;
    }
    return new ContentfulLoader(cacheTimeout, locale) as unknown as IContentfulLoader;
}
