/**
 * File-based Contentful backend.
 *
 * Reads the Contentful export JSON once at module load and serves
 * content from memory. Mirrors the public API of ContentfulLoader.
 *
 * Use by setting CONTENTFUL_BACKEND=file in .env.
 *
 * The export file is a management-API-format dump with fields keyed
 * by locale and unresolved Link references. This module:
 *   1. Builds id/slug indexes for fast lookup
 *   2. Unwraps locale fields (picks the locale-specific value)
 *   3. Resolves Link references into nested entries/assets
 *   4. Returns objects shaped like the SDK's delivery API output
 *      (what existing page/component code expects)
 */
import * as fs from 'fs';
import * as path from 'path';
import {
    IStreet, IPost, IDistrict, IHomepage,
    StreetSummary, PostSummary, DistrictSummary,
} from './contentmodel/wrappertypes';

// ---------------------------------------------------------------------------
// Types for the export file
// ---------------------------------------------------------------------------

type LocaleMap<T = any> = { [locale: string]: T };

interface RawEntry {
    sys: {
        id: string;
        type: 'Entry';
        contentType: { sys: { id: string } };
        createdAt: string;
        updatedAt: string;
        publishedAt?: string;
    };
    metadata?: { tags: any[]; concepts?: any[] };
    fields: { [key: string]: LocaleMap };
}

interface RawAsset {
    sys: {
        id: string;
        type: 'Asset';
        createdAt: string;
        updatedAt: string;
    };
    metadata?: { tags: any[]; concepts?: any[] };
    fields: {
        title?: LocaleMap<string>;
        description?: LocaleMap<string>;
        file?: LocaleMap<{
            url: string;
            fileName: string;
            contentType: string;
            details?: any;
        }>;
    };
}

interface ExportFile {
    entries: RawEntry[];
    assets: RawAsset[];
}

// ---------------------------------------------------------------------------
// Loading and indexing
// ---------------------------------------------------------------------------

let cachedData: ExportFile | null = null;
let entryById: Map<string, RawEntry> | null = null;
let assetById: Map<string, RawAsset> | null = null;
let entriesByType: Map<string, RawEntry[]> | null = null;

const EXPORT_DIR = path.join(process.cwd(), 'content/2026-04-10');

function findExportFile(): string | null {
    // Look for a contentful-export-*.json file in the export dir.
    // Returns null (rather than throwing) if the directory is missing
    // so the app can render gracefully instead of crashing.
    try {
        const files = fs.readdirSync(EXPORT_DIR);
        const exportFile = files.find(f =>
            f.startsWith('contentful-export-') &&
            f.endsWith('.json') &&
            !f.includes('error-log')
        );
        return exportFile ? path.join(EXPORT_DIR, exportFile) : null;
    } catch (err: any) {
        console.error(`[FileContentfulLoader] Cannot access ${EXPORT_DIR}: ${err.message}`);
        return null;
    }
}

function loadExport(): ExportFile {
    if (cachedData) return cachedData;

    const filePath = findExportFile();
    if (!filePath) {
        // Fall back to an empty dataset so the rest of the app still renders.
        // A single error was already logged by findExportFile().
        cachedData = { entries: [], assets: [] };
        return cachedData;
    }

    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        cachedData = JSON.parse(raw) as ExportFile;
    } catch (err: any) {
        console.error(`[FileContentfulLoader] Failed to read ${filePath}: ${err.message}`);
        cachedData = { entries: [], assets: [] };
    }
    return cachedData;
}

function buildIndexes() {
    if (entryById && assetById && entriesByType) return;

    const data = loadExport();
    entryById = new Map();
    assetById = new Map();
    entriesByType = new Map();

    for (const entry of data.entries) {
        entryById.set(entry.sys.id, entry);
        const typeId = entry.sys.contentType.sys.id;
        if (!entriesByType.has(typeId)) entriesByType.set(typeId, []);
        entriesByType.get(typeId)!.push(entry);
    }
    for (const asset of data.assets) {
        assetById.set(asset.sys.id, asset);
    }
}

// ---------------------------------------------------------------------------
// Locale handling
// ---------------------------------------------------------------------------

function normalizeLocale(locale: string): string {
    // Export uses 'en-US' and 'de'
    if (locale === 'en') return 'en-US';
    return locale;
}

function fallbackLocale(locale: string): string {
    return locale === 'de' ? 'en-US' : 'de';
}

function unwrap<T = any>(localeMap: LocaleMap<T> | undefined, locale: string): T | undefined {
    if (!localeMap) return undefined;
    const cfLocale = normalizeLocale(locale);
    if (localeMap[cfLocale] !== undefined) return localeMap[cfLocale];
    // Fall back to other locale if value exists there
    const fb = fallbackLocale(cfLocale);
    if (localeMap[fb] !== undefined) return localeMap[fb];
    // Last-resort: first available value
    const firstKey = Object.keys(localeMap)[0];
    return firstKey ? localeMap[firstKey] : undefined;
}

// ---------------------------------------------------------------------------
// Resolution — convert raw entries/assets into SDK-shaped objects
// ---------------------------------------------------------------------------

/**
 * Resolve a raw entry into SDK-shaped form:
 * - Unwrap locale from every field
 * - Recursively resolve Link references into nested entries/assets
 * - Depth limits recursion to avoid cycles
 */
function resolveEntry(entry: RawEntry, locale: string, depth: number = 3): any {
    if (!entry) return null;

    const resolvedFields: any = {};
    for (const [fieldName, localeMap] of Object.entries(entry.fields)) {
        const value = unwrap(localeMap, locale);
        resolvedFields[fieldName] = resolveValue(value, locale, depth);
    }

    return {
        sys: { ...entry.sys },
        metadata: entry.metadata ?? { tags: [], concepts: [] },
        fields: resolvedFields,
        contentTypeId: entry.sys.contentType.sys.id,
    };
}

/**
 * Resolve a single value recursively. Handles:
 * - Link to Entry → nested resolved entry
 * - Link to Asset → nested resolved asset
 * - Array of links → array of resolved items
 * - Rich text documents (passed through)
 * - Primitives (passed through)
 */
function resolveValue(value: any, locale: string, depth: number): any {
    if (value === null || value === undefined) return value;

    // Arrays
    if (Array.isArray(value)) {
        return value.map(item => resolveValue(item, locale, depth)).filter(v => v !== null);
    }

    // Link reference
    if (typeof value === 'object' && value.sys?.type === 'Link') {
        if (depth <= 0) return null; // stop recursion
        if (value.sys.linkType === 'Entry') {
            const linked = entryById?.get(value.sys.id);
            return linked ? resolveEntry(linked, locale, depth - 1) : null;
        }
        if (value.sys.linkType === 'Asset') {
            const asset = assetById?.get(value.sys.id);
            return asset ? resolveAsset(asset, locale) : null;
        }
    }

    // Plain object (location, focal point, rich text, etc.) — return as-is
    return value;
}

function resolveAsset(asset: RawAsset, locale: string): any {
    const file = unwrap(asset.fields.file, locale);
    return {
        sys: { ...asset.sys },
        metadata: asset.metadata ?? { tags: [], concepts: [] },
        fields: {
            title: unwrap(asset.fields.title, locale),
            description: unwrap(asset.fields.description, locale),
            file: file,
        },
    };
}

// ---------------------------------------------------------------------------
// FileContentfulLoader — mirrors ContentfulLoader public API
// ---------------------------------------------------------------------------

export class FileContentfulLoader {
    private locale: string;

    // cacheTimeout param kept for API compatibility with ContentfulLoader
    constructor(_cacheTimeout: number = 60 * 60, locale: string = 'en-US') {
        this.locale = locale === 'en' ? 'en-US' : locale;
        buildIndexes();
    }

    public getClient(): any {
        return null; // no SDK client in file mode
    }

    // -- Streets ---------------------------------------------------------

    public async getAllStreets(_preview = false): Promise<StreetSummary[]> {
        const streets = entriesByType?.get('street') ?? [];
        return streets.map(entry => {
            const slug = unwrap<string>(entry.fields.slug, this.locale) ?? '';
            const germanName = unwrap<string>(entry.fields.germanName, this.locale) ?? '';
            const polishNames = unwrap<string[]>(entry.fields.polishNames, this.locale) ?? [];
            const districtLinks = unwrap<any[]>(entry.fields.district_ref, this.locale) ?? [];

            return {
                germanName,
                polishNames,
                slug,
                districtRefCollection: {
                    items: districtLinks.map(link => ({ slug: link.sys.id })),
                },
                sys: { id: entry.sys.id },
            };
        }).filter(s => s.slug);
    }

    public async getStreetBySlug(slug: string, locale: string = this.locale): Promise<IStreet | null> {
        const streets = entriesByType?.get('street') ?? [];
        const match = streets.find(e => unwrap<string>(e.fields.slug, locale) === slug);
        if (!match) return null;
        return resolveEntry(match, locale, 3) as IStreet;
    }

    // -- Posts -----------------------------------------------------------

    public async getAllPosts(_preview = false, _limit = 1000): Promise<PostSummary[]> {
        const posts = entriesByType?.get('post') ?? [];
        return posts.map(entry => ({
            title: unwrap<string>(entry.fields.title, this.locale) ?? '',
            slug: unwrap<string>(entry.fields.slug, this.locale) ?? '',
            sys: { id: entry.sys.id },
        })).filter(p => p.slug);
    }

    public async getPostBySlug(slug: string, locale: string = this.locale): Promise<IPost | null> {
        const posts = entriesByType?.get('post') ?? [];
        const match = posts.find(e => unwrap<string>(e.fields.slug, locale) === slug);
        if (!match) return null;
        return resolveEntry(match, locale, 3) as IPost;
    }

    public async getHomepagePosts(locale: string = this.locale): Promise<IPost[]> {
        const posts = entriesByType?.get('post') ?? [];
        const filtered = posts.filter(entry => {
            const showIn = unwrap<string[]>(entry.fields.showIn, locale);
            if (!showIn || !Array.isArray(showIn)) return false;
            return showIn.includes('Homepage') && !showIn.includes('Hero');
        });
        // Sort by createdAt desc
        filtered.sort((a, b) => b.sys.createdAt.localeCompare(a.sys.createdAt));
        return filtered.slice(0, 10).map(e => resolveEntry(e, locale, 2) as IPost);
    }

    public async getHomepageHeroPost(locale: string = this.locale): Promise<IPost | null> {
        const posts = entriesByType?.get('post') ?? [];
        const match = posts.find(entry => {
            const showIn = unwrap<string[]>(entry.fields.showIn, locale);
            return Array.isArray(showIn) && showIn.includes('Hero');
        });
        if (!match) return null;
        return resolveEntry(match, locale, 2) as IPost;
    }

    public async getNavigationPosts(locale: string = this.locale): Promise<IPost[]> {
        const posts = entriesByType?.get('post') ?? [];
        const filtered = posts.filter(entry => {
            const showIn = unwrap<string[]>(entry.fields.showIn, locale);
            return Array.isArray(showIn) && showIn.includes('Navigation');
        });
        filtered.sort((a, b) => b.sys.createdAt.localeCompare(a.sys.createdAt));
        return filtered.slice(0, 10).map(e => resolveEntry(e, locale, 2) as IPost);
    }

    // -- Districts -------------------------------------------------------

    public async getAllDistricts(locale: string = this.locale, _preview = false): Promise<DistrictSummary[]> {
        const districts = entriesByType?.get('district') ?? [];
        return districts.map(entry => {
            const slug = unwrap<string>(entry.fields.slug, locale) ?? '';
            const name = unwrap<string>(entry.fields.name, locale) ?? '';
            const polishName = unwrap<string>(entry.fields.polishName, locale) ?? '';

            // Resolve image link → asset → url
            const imageLink = unwrap<any>(entry.fields.image, locale);
            let imageUrl: string | undefined;
            if (imageLink?.sys?.linkType === 'Asset') {
                const asset = assetById?.get(imageLink.sys.id);
                const fileUrl = asset && unwrap(asset.fields.file, locale)?.url;
                if (fileUrl) {
                    imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
                }
            }

            return {
                name,
                slug,
                polishName,
                imageUrl,
                sys: { id: entry.sys.id },
            };
        }).filter(d => d.slug);
    }

    public async getDistrictBySlug(slug: string, locale: string = this.locale): Promise<IDistrict | null> {
        const districts = entriesByType?.get('district') ?? [];
        const match = districts.find(e => unwrap<string>(e.fields.slug, locale) === slug);
        if (!match) return null;
        return resolveEntry(match, locale, 3) as IDistrict;
    }

    // -- Homepage --------------------------------------------------------

    public async getHomepageContent(locale: string = this.locale): Promise<IHomepage | null> {
        const homepages = entriesByType?.get('homepage') ?? [];
        // The homepage locale field stores 'en' or 'de' (not 'en-US')
        const targetLocale = locale === 'en-US' ? 'en' : locale;
        const match = homepages.find(e => {
            const entryLocale = unwrap<string>(e.fields.locale, locale);
            return entryLocale === targetLocale;
        });
        if (!match) return null;
        return resolveEntry(match, locale, 3) as IHomepage;
    }
}
