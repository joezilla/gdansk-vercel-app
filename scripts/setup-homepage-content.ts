/**
 * Create the "homepage" content type in Contentful and seed initial entries.
 *
 * Usage:
 *   npx tsx scripts/setup-homepage-content.ts              # dry-run
 *   npx tsx scripts/setup-homepage-content.ts --execute     # create + seed
 *   npx tsx scripts/setup-homepage-content.ts --execute --publish  # create + seed + publish
 */

import 'dotenv/config';
import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const args = process.argv.slice(2);
const EXECUTE = args.includes('--execute');
const PUBLISH = args.includes('--publish');

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!MANAGEMENT_TOKEN) {
    console.error('Missing CONTENTFUL_MANAGEMENT_TOKEN');
    process.exit(1);
  }

  console.log(`Mode: ${EXECUTE ? (PUBLISH ? 'execute + publish' : 'execute') : 'dry-run'}\n`);

  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENVIRONMENT_ID);

  // Step 1: Create content type
  console.log('Step 1: Creating "homepage" content type...');

  const contentTypeFields = [
    { id: 'title', name: 'Title', type: 'Symbol', required: true },
    { id: 'locale', name: 'Locale', type: 'Symbol', required: true,
      validations: [{ in: ['en', 'de'] }] },
    { id: 'heroHeadline', name: 'Hero Headline', type: 'Symbol' },
    { id: 'heroSubtitle', name: 'Hero Subtitle', type: 'Symbol' },
    { id: 'heroImage', name: 'Hero Image', type: 'Link', linkType: 'Asset' },
    { id: 'seoHeadline', name: 'SEO Headline', type: 'Symbol' },
    { id: 'seoText', name: 'SEO Text', type: 'RichText' },
    { id: 'seoQuote', name: 'SEO Quote', type: 'Symbol' },
    {
      id: 'featuredStreets', name: 'Featured Streets', type: 'Array',
      items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['street'] }] },
    },
    {
      id: 'featuredDistricts', name: 'Featured Districts', type: 'Array',
      items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['district'] }] },
    },
    {
      id: 'featuredPosts', name: 'Featured Posts', type: 'Array',
      items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['post'] }] },
    },
  ];

  if (!EXECUTE) {
    console.log('  [DRY RUN] Would create content type with fields:');
    for (const f of contentTypeFields) console.log(`    - ${f.id} (${f.type})`);
  } else {
    try {
      // Check if it already exists
      const existing = await env.getContentType('homepage').catch(() => null);
      if (existing) {
        console.log('  Content type "homepage" already exists, skipping creation.');
      } else {
        const ct = await env.createContentTypeWithId('homepage', {
          name: 'Homepage',
          description: 'Manages the homepage layout, hero, featured content',
          displayField: 'title',
          fields: contentTypeFields,
        });
        await ct.publish();
        console.log('  ✓ Content type created and published');
        await sleep(1000);
      }
    } catch (err: any) {
      console.error('  ✗ Error:', err.message);
    }
  }

  // Step 2: Seed entries
  console.log('\nStep 2: Seeding homepage entries...');

  // Known entry IDs from the space
  const streetIds = [
    '55dYMtquyCXqZkEjq4pzlN', // Rossmarkt
    '1sFETYzDPFRXDaWe9HRUXM', // Promenade
    '4NCNLSx0eV253KH0RQ5zfa', // Schichaugasse
    't5yhfObocX6WvkvS4KmcD',  // Am Spendhaus
    '1lniBoiWvd0YSpw1NkgD5f', // Spendhaussche Neugasse
  ];
  const districtIds = [
    'stadtgebiet',     // Stadtgebiet
    'rechtstadt',      // Rechtstadt
    'altstadt',        // Altstadt
    'speicherinsel',   // Speicherinsel
  ];
  const postIds = [
    '64otR5hPDfuP0xYYvaODSG', // The Streets of Danzig
    '6KGXAv4RR7onUWPb96WdwI', // About
    '1LOYWM4nwtsx8Z2U3heihY', // Genealogy Resources
  ];

  const makeEntryLink = (id: string) => ({ sys: { type: 'Link' as const, linkType: 'Entry' as const, id } });

  const entries = [
    {
      locale: 'en',
      title: 'Homepage EN',
      heroHeadline: 'Discover the Forgotten Names of Danzig',
      heroSubtitle: 'Accessing over 4,500 historical street records and maps.',
      seoHeadline: 'Documenting a Lost Era',
      seoQuote: 'To name a place is to claim its history. To remember its old name is to honor its soul.',
      seoText: {
        nodeType: 'document' as const,
        data: {},
        content: [
          { nodeType: 'paragraph' as const, data: {}, content: [{ nodeType: 'text' as const, value: 'The Streets of Danzig project is a digital attempt to reconcile the layered history of a city that has existed under multiple identities. Before 1945, Danzig was a complex tapestry of German and Polish influences, a free city-state with a unique legal and social structure.', marks: [], data: {} }] },
          { nodeType: 'paragraph' as const, data: {}, content: [{ nodeType: 'text' as const, value: 'Our archival goals focus on the preservation of toponymy\u2014the names of places. By cataloging the transition from German street names to their modern Polish equivalents, we provide a bridge for historians and genealogists.', marks: [], data: {} }] },
          { nodeType: 'paragraph' as const, data: {}, content: [{ nodeType: 'text' as const, value: 'This initiative utilizes high-resolution scans of cadastral maps from the 1880s, address books from the 1920s, and post-war reconstruction surveys. We treat each street not just as a location, but as a vessel of memory.', marks: [], data: {} }] },
        ],
      },
    },
    {
      locale: 'de',
      title: 'Homepage DE',
      heroHeadline: 'Entdecken Sie die vergessenen Namen Danzigs',
      heroSubtitle: 'Zugang zu über 4.500 historischen Straßenverzeichnissen und Karten.',
      seoHeadline: 'Eine verlorene Ära dokumentieren',
      seoQuote: 'Einen Ort zu benennen heißt, seine Geschichte zu beanspruchen. Sich an seinen alten Namen zu erinnern heißt, seine Seele zu ehren.',
      seoText: {
        nodeType: 'document' as const,
        data: {},
        content: [
          { nodeType: 'paragraph' as const, data: {}, content: [{ nodeType: 'text' as const, value: 'Das Projekt "Die Straßen von Danzig" ist ein digitaler Versuch, die vielschichtige Geschichte einer Stadt zu versöhnen, die unter mehreren Identitäten existiert hat. Vor 1945 war Danzig ein komplexes Geflecht deutscher und polnischer Einflüsse, ein Freistaat mit einer einzigartigen rechtlichen und sozialen Struktur.', marks: [], data: {} }] },
          { nodeType: 'paragraph' as const, data: {}, content: [{ nodeType: 'text' as const, value: 'Unsere archivarischen Ziele konzentrieren sich auf die Bewahrung der Toponymie\u2014der Namen von Orten. Durch die Katalogisierung des Übergangs von deutschen Straßennamen zu ihren modernen polnischen Entsprechungen schaffen wir eine Brücke für Historiker und Genealogen.', marks: [], data: {} }] },
        ],
      },
    },
  ];

  for (const entry of entries) {
    if (!EXECUTE) {
      console.log(`  [DRY RUN] Would create entry "${entry.title}" with ${streetIds.length} streets, ${districtIds.length} districts, ${postIds.length} posts`);
      continue;
    }

    try {
      const created = await env.createEntry('homepage', {
        fields: {
          title: { 'en-US': entry.title },
          locale: { 'en-US': entry.locale },
          heroHeadline: { 'en-US': entry.heroHeadline },
          heroSubtitle: { 'en-US': entry.heroSubtitle },
          seoHeadline: { 'en-US': entry.seoHeadline },
          seoQuote: { 'en-US': entry.seoQuote },
          seoText: { 'en-US': entry.seoText },
          featuredStreets: { 'en-US': streetIds.map(makeEntryLink) },
          featuredDistricts: { 'en-US': districtIds.map(makeEntryLink) },
          featuredPosts: { 'en-US': postIds.map(makeEntryLink) },
        },
      });
      console.log(`  ✓ Created "${entry.title}" (${created.sys.id})`);

      if (PUBLISH) {
        await sleep(500);
        await created.publish();
        console.log(`    Published`);
      }
    } catch (err: any) {
      console.error(`  ✗ Error creating "${entry.title}":`, err.message);
    }
  }

  console.log('\nDone.');
}

main().catch(console.error);
