/**
 * Harvest representative images for each district from street photos,
 * stylize them, save locally, and upload to Contentful.
 *
 * For each district:
 *   1. Find a street in that district that has media
 *   2. Download the first image
 *   3. Apply sepia-archival style via sharp
 *   4. Save locally to public/resources/images/districts/{slug}.webp
 *   5. Upload the asset to Contentful and link it to the district's "image" field
 *
 * Usage:
 *   npx tsx scripts/harvest-district-images.ts              # dry-run (local only)
 *   npx tsx scripts/harvest-district-images.ts --upload      # upload to Contentful
 *   npx tsx scripts/harvest-district-images.ts --upload --publish  # upload + publish
 */

import 'dotenv/config';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from 'contentful-management';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN!;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const OUTPUT_DIR = path.join(process.cwd(), 'public/resources/images/districts');
const CONTENTFUL_DELAY_MS = 500;

const OUTPUT_WIDTH = 800;
const OUTPUT_HEIGHT = 533;

const args = process.argv.slice(2);
const UPLOAD_MODE = args.includes('--upload');
const PUBLISH_MODE = args.includes('--publish');

// ---------------------------------------------------------------------------
// GraphQL helpers (read-only, uses delivery API)
// ---------------------------------------------------------------------------

async function fetchGraphQL(query: string) {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  );
  return res.json();
}

type DistrictInfo = { slug: string; name: string; sysId: string };
type StreetWithImage = { germanName: string; districtSlug: string; imageUrl: string };

async function getAllDistricts(): Promise<DistrictInfo[]> {
  const result = await fetchGraphQL(`
    query {
      districtCollection(limit: 50) {
        items { slug, name, sys { id } }
      }
    }
  `);
  return (result?.data?.districtCollection?.items ?? []).map((d: any) => ({
    slug: d.slug,
    name: d.name,
    sysId: d.sys.id,
  }));
}

async function getStreetsWithMedia(batchSize = 100): Promise<StreetWithImage[]> {
  const streets: StreetWithImage[] = [];
  let offset = 0;
  let batchLen = 0;

  do {
    const result = await fetchGraphQL(`
      query {
        streetCollection(limit: ${batchSize}, skip: ${offset}) {
          items {
            germanName
            districtRefCollection(limit: 3) { items { slug } }
            mediaCollection(limit: 1) { items { image { url } } }
          }
        }
      }
    `);

    const items = result?.data?.streetCollection?.items ?? [];
    batchLen = items.length;
    offset += batchLen;

    for (const s of items) {
      const imageUrl = s?.mediaCollection?.items?.[0]?.image?.url;
      const districtSlug = s?.districtRefCollection?.items?.[0]?.slug;
      if (imageUrl && districtSlug) {
        streets.push({
          germanName: s.germanName,
          districtSlug,
          imageUrl: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
        });
      }
    }
  } while (batchLen > 0);

  return streets;
}

// ---------------------------------------------------------------------------
// Image processing
// ---------------------------------------------------------------------------

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function stylizeImage(inputBuffer: Buffer, outputPath: string): Promise<Buffer> {
  const vignetteSvg = `
    <svg width="${OUTPUT_WIDTH}" height="${OUTPUT_HEIGHT}">
      <defs>
        <radialGradient id="v" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="black" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.45"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>
  `;

  const processed = await sharp(inputBuffer)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'centre' })
    .grayscale()
    .tint({ r: 180, g: 160, b: 130 })
    .modulate({ brightness: 1.05, saturation: 0.3 })
    .composite([{
      input: Buffer.from(vignetteSvg),
      blend: 'over',
    }])
    .webp({ quality: 82 })
    .toBuffer();

  fs.writeFileSync(outputPath, processed);
  return processed;
}

// ---------------------------------------------------------------------------
// Contentful Management API — upload asset + link to district
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadToContentful(
  districtName: string,
  districtSysId: string,
  imageBuffer: Buffer,
  slug: string,
) {
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT);

  // 1. Create and upload the asset
  console.log(`  Uploading asset to Contentful...`);
  const upload = await environment.createUpload({ file: imageBuffer });

  const asset = await environment.createAsset({
    fields: {
      title: { 'en-US': `${districtName} — District Image` },
      description: { 'en-US': `Archival-style image for the ${districtName} district` },
      file: {
        'en-US': {
          contentType: 'image/webp',
          fileName: `${slug}.webp`,
          uploadFrom: {
            sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id },
          },
        },
      },
    },
  });

  // 2. Process and publish the asset
  const processedAsset = await asset.processForAllLocales();
  await sleep(CONTENTFUL_DELAY_MS);

  // Wait for processing to finish
  let attempts = 0;
  let readyAsset = processedAsset;
  while (attempts < 10) {
    readyAsset = await environment.getAsset(asset.sys.id);
    if (readyAsset.fields.file['en-US']?.url) break;
    await sleep(1000);
    attempts++;
  }

  const publishedAsset = await readyAsset.publish();
  console.log(`  Asset published: ${publishedAsset.sys.id}`);
  await sleep(CONTENTFUL_DELAY_MS);

  // 3. Link the asset to the district entry's "image" field
  console.log(`  Linking to district entry ${districtSysId}...`);
  const entry = await environment.getEntry(districtSysId);

  entry.fields.image = entry.fields.image || {};
  entry.fields.image['en-US'] = {
    sys: { type: 'Link', linkType: 'Asset', id: publishedAsset.sys.id },
  };

  const updatedEntry = await entry.update();
  await sleep(CONTENTFUL_DELAY_MS);

  if (PUBLISH_MODE) {
    await updatedEntry.publish();
    console.log(`  District entry published`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN in .env');
    process.exit(1);
  }
  if (UPLOAD_MODE && !MANAGEMENT_TOKEN) {
    console.error('Missing CONTENTFUL_MANAGEMENT_TOKEN in .env (required for --upload)');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Mode: ${UPLOAD_MODE ? (PUBLISH_MODE ? 'upload + publish' : 'upload (draft)') : 'local only'}`);
  console.log('');

  console.log('Fetching districts...');
  const districts = await getAllDistricts();
  console.log(`Found ${districts.length} districts`);

  console.log('Fetching all streets with media...');
  const streets = await getStreetsWithMedia();
  console.log(`Found ${streets.length} streets with images\n`);

  // Group first image per district
  const districtImageMap = new Map<string, StreetWithImage>();
  for (const s of streets) {
    if (!districtImageMap.has(s.districtSlug)) {
      districtImageMap.set(s.districtSlug, s);
    }
  }

  const results: { district: string; status: string }[] = [];

  for (const district of districts) {
    const outputPath = path.join(OUTPUT_DIR, `${district.slug}.webp`);

    const streetMatch = districtImageMap.get(district.slug);
    if (!streetMatch) {
      console.log(`[MISS] ${district.name} — no streets with images`);
      results.push({ district: district.name, status: 'NO IMAGE' });
      continue;
    }

    try {
      // Check if local file already exists
      let imageBuffer: Buffer;
      if (fs.existsSync(outputPath)) {
        console.log(`[${district.name}] Using existing local image`);
        imageBuffer = fs.readFileSync(outputPath);
      } else {
        console.log(`[${district.name}] Harvesting from "${streetMatch.germanName}"...`);
        const rawImage = await downloadImage(streetMatch.imageUrl);
        imageBuffer = await stylizeImage(rawImage, outputPath);
        console.log(`  ✓ Saved ${district.slug}.webp locally`);
      }

      // Upload to Contentful if requested
      if (UPLOAD_MODE) {
        await uploadToContentful(district.name, district.sysId, imageBuffer, district.slug);
        console.log(`  ✓ Uploaded to Contentful`);
      }

      results.push({ district: district.name, status: UPLOAD_MODE ? 'OK (uploaded)' : 'OK (local)' });
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
      results.push({ district: district.name, status: `ERROR: ${err.message}` });
    }
  }

  console.log('\n=== Summary ===');
  const ok = results.filter(r => r.status.startsWith('OK')).length;
  const missing = results.filter(r => r.status === 'NO IMAGE');
  const errors = results.filter(r => r.status.startsWith('ERROR'));
  console.log(`  ${ok} processed, ${missing.length} missing, ${errors.length} errors`);

  if (missing.length > 0) {
    console.log('\nDistricts needing manual images:');
    for (const m of missing) console.log(`  - ${m.district}`);
  }
  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const e of errors) console.log(`  - ${e.district}: ${e.status}`);
  }
}

main().catch(console.error);
