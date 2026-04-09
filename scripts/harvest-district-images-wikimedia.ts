/**
 * Source district images from Wikimedia Commons for districts that
 * don't have images yet. Searches by Polish name then German name,
 * downloads, applies the same sepia-archival style, and uploads to Contentful.
 *
 * Usage:
 *   npx tsx scripts/harvest-district-images-wikimedia.ts              # dry-run (local only)
 *   npx tsx scripts/harvest-district-images-wikimedia.ts --upload      # upload to Contentful
 *   npx tsx scripts/harvest-district-images-wikimedia.ts --upload --publish  # upload + publish
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

const USER_AGENT = 'StreetsOfDanzigBot/1.0 (https://www.streetsofdanzig.com)';

// Hand-tuned search terms for districts where the automatic name won't work well
const SEARCH_OVERRIDES: Record<string, string[]> = {
  'langgarten': ['Gdańsk Śródmieście', 'Danzig Langgarten'],
  'krakau': ['Krakowiec Gdańsk', 'Krakau Danzig'],
  'petershagen': ['Gdańsk Siedlce', 'Petershagen Danzig'],
  'schellmuehl': ['Gdańsk Młyniska', 'Schellmühl Danzig'],
  'west-neufaehr': ['Górki Zachodnie Gdańsk', 'Neufähr Danzig'],
  'bohnsacker-insel': ['Wyspa Sobieszewska', 'Sobieszewo Gdańsk'],
  'buergerwiesen': ['Rudniki Gdańsk', 'Bürgerwiesen Danzig'],
  'ohra': ['Orunia Gdańsk', 'Ohra Danzig'],
  'stolzenberg': ['Chełm Gdańsk district', 'Stolzenberg Danzig'],
  'heubude': ['Stogi Gdańsk', 'Heubude Danzig'],
  'lauental': ['Letnica Gdańsk', 'Lauental Danzig'],
  'brentau': ['Brętowo Gdańsk', 'Brentau Danzig'],
  'broesen': ['Brzeźno Gdańsk', 'Brösen Danzig'],
  'saspe': ['Zaspa Gdańsk', 'Saspe Danzig'],
  'oliva': ['Oliwa Gdańsk', 'Oliva Danzig cathedral'],
  'zoppot': ['Sopot', 'Zoppot pier'],
  'walddorf': ['Olszynka Gdańsk', 'Walddorf Danzig'],
  'neufahrwasser': ['Nowy Port Gdańsk', 'Neufahrwasser Danzig lighthouse'],
  'stadtteil': ['Gdańsk panorama', 'Danzig cityscape'],
  'westerplatte': ['Westerplatte monument Gdańsk', 'Westerplatte'],
  'schwarzes_meer': ['Gdańsk old town', 'Danzig Schwarzes Meer'],
  'altschottland': ['Stare Szkoty Gdańsk', 'Altschottland Danzig'],
  'neuschottland': ['Nowe Szkoty Gdańsk', 'Neuschottland Danzig'],
  'emaus': ['Gdańsk Emaus', 'Danzig Emaus'],
  'zigankenberg': ['Suchanino Gdańsk', 'Zigankenberg Danzig'],
  'vorstadt': ['Gdańsk Stare Przedmieście', 'Vorstadt Danzig'],
  'glettkau': ['Jelitkowo Gdańsk beach', 'Glettkau Danzig'],
  'weichselmuende': ['Wisłoujście fortress Gdańsk', 'Weichselmünde Danzig'],
  'troyl': ['Gdańsk Przeróbka', 'Troyl Danzig'],
};

// ---------------------------------------------------------------------------
// Contentful GraphQL (read-only)
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

type DistrictInfo = { slug: string; name: string; polishName: string; sysId: string; hasImage: boolean };

async function getDistrictsWithoutImages(): Promise<DistrictInfo[]> {
  const result = await fetchGraphQL(`
    query {
      districtCollection(limit: 50) {
        items { slug, name, polishName, image { url }, sys { id } }
      }
    }
  `);
  return (result?.data?.districtCollection?.items ?? [])
    .filter((d: any) => !d.image?.url)
    .map((d: any) => ({
      slug: d.slug,
      name: d.name,
      polishName: d.polishName || '',
      sysId: d.sys.id,
      hasImage: false,
    }));
}

// ---------------------------------------------------------------------------
// Wikimedia Commons API
// ---------------------------------------------------------------------------

async function wikimediaSearch(searchTerm: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(searchTerm)}&srwhat=text&srlimit=10&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();

  const results = data?.query?.search ?? [];
  for (const result of results) {
    const title = result.title as string;
    // Only accept actual image files
    if (/\.(jpg|jpeg|png|webp|tif|tiff)$/i.test(title)) {
      return title;
    }
  }
  return null;
}

async function getWikimediaImageUrl(fileTitle: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();

  const pages = data?.query?.pages ?? {};
  for (const page of Object.values(pages) as any[]) {
    const thumbUrl = page?.imageinfo?.[0]?.thumburl;
    const originalUrl = page?.imageinfo?.[0]?.url;
    return thumbUrl || originalUrl || null;
  }
  return null;
}

async function findWikimediaImage(district: DistrictInfo): Promise<{ url: string; source: string } | null> {
  const searchTerms = SEARCH_OVERRIDES[district.slug] || [
    district.polishName ? `${district.polishName} Gdańsk` : '',
    `${district.name} Danzig`,
    `${district.name} Gdańsk`,
  ].filter(Boolean);

  for (const term of searchTerms) {
    const fileTitle = await wikimediaSearch(term);
    if (fileTitle) {
      const imageUrl = await getWikimediaImageUrl(fileTitle);
      if (imageUrl) {
        return { url: imageUrl, source: `Wikimedia Commons: ${fileTitle}` };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Image processing (same pipeline as street harvester)
// ---------------------------------------------------------------------------

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
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
    .toFile(outputPath)
    .then(() => fs.readFileSync(outputPath));

  return processed;
}

// ---------------------------------------------------------------------------
// Contentful upload (same pattern as street harvester)
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

  console.log(`  Uploading asset to Contentful...`);
  const upload = await environment.createUpload({ file: imageBuffer });

  const asset = await environment.createAsset({
    fields: {
      title: { 'en-US': `${districtName} — District Image` },
      description: { 'en-US': `Archival-style image for the ${districtName} district (source: Wikimedia Commons)` },
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

  const processedAsset = await asset.processForAllLocales();
  await sleep(CONTENTFUL_DELAY_MS);

  let readyAsset = processedAsset;
  for (let i = 0; i < 10; i++) {
    readyAsset = await environment.getAsset(asset.sys.id);
    if (readyAsset.fields.file['en-US']?.url) break;
    await sleep(1000);
  }

  const publishedAsset = await readyAsset.publish();
  console.log(`  Asset published: ${publishedAsset.sys.id}`);
  await sleep(CONTENTFUL_DELAY_MS);

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
    console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN');
    process.exit(1);
  }
  if (UPLOAD_MODE && !MANAGEMENT_TOKEN) {
    console.error('Missing CONTENTFUL_MANAGEMENT_TOKEN (required for --upload)');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Mode: ${UPLOAD_MODE ? (PUBLISH_MODE ? 'upload + publish' : 'upload (draft)') : 'local only'}`);
  console.log('');

  const districts = await getDistrictsWithoutImages();
  console.log(`Found ${districts.length} districts without images\n`);

  if (districts.length === 0) {
    console.log('All districts have images. Nothing to do.');
    return;
  }

  const results: { district: string; status: string }[] = [];

  for (const district of districts) {
    const outputPath = path.join(OUTPUT_DIR, `${district.slug}.webp`);

    // Skip if local file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`[${district.name}] Local image exists, uploading...`);
      if (UPLOAD_MODE) {
        try {
          const imageBuffer = fs.readFileSync(outputPath);
          await uploadToContentful(district.name, district.sysId, imageBuffer, district.slug);
          results.push({ district: district.name, status: 'OK (uploaded existing)' });
        } catch (err: any) {
          console.error(`  ✗ ${err.message}`);
          results.push({ district: district.name, status: `ERROR: ${err.message}` });
        }
      } else {
        results.push({ district: district.name, status: 'skipped (exists locally)' });
      }
      continue;
    }

    console.log(`[${district.name}] Searching Wikimedia Commons...`);
    const found = await findWikimediaImage(district);

    if (!found) {
      console.log(`  ⚠ No image found on Wikimedia`);
      results.push({ district: district.name, status: 'NO IMAGE FOUND' });
      continue;
    }

    try {
      console.log(`  Found: ${found.source}`);
      console.log(`  Downloading...`);
      const rawImage = await downloadImage(found.url);

      console.log(`  Stylizing...`);
      const imageBuffer = await stylizeImage(rawImage, outputPath);
      console.log(`  ✓ Saved ${district.slug}.webp locally`);

      if (UPLOAD_MODE) {
        await uploadToContentful(district.name, district.sysId, imageBuffer, district.slug);
        console.log(`  ✓ Uploaded to Contentful`);
      }

      results.push({ district: district.name, status: UPLOAD_MODE ? 'OK (uploaded)' : 'OK (local)' });
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
      results.push({ district: district.name, status: `ERROR: ${err.message}` });
    }

    // Rate limit Wikimedia
    await sleep(500);
  }

  console.log('\n=== Summary ===');
  const ok = results.filter(r => r.status.startsWith('OK')).length;
  const missing = results.filter(r => r.status === 'NO IMAGE FOUND');
  const errors = results.filter(r => r.status.startsWith('ERROR'));
  console.log(`  ${ok} processed, ${missing.length} not found, ${errors.length} errors`);

  if (missing.length > 0) {
    console.log('\nStill need manual sourcing:');
    for (const m of missing) console.log(`  - ${m.district}`);
  }
}

main().catch(console.error);
