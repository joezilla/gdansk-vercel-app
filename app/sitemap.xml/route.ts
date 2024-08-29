import { ContentfulLoader } from '../../lib/contentful'
import { createPostURL, createStreetURL } from '../../lib/urlutil';

export async function GET() {
  // Generate the sitemap
  const sitemap = await generateSitemap();

  // Set the response headers
  const headers = new Headers();
  headers.set('Content-Type', 'application/xml');

  // Return the response with the sitemap and headers
  return new Response(sitemap, {
    status: 200,
    headers: headers,
  });
}

async function generateSitemap() {
  let loader = new ContentfulLoader();
  const allStreets = (await loader.getAllStreets()) ?? []
  const allPosts = (await loader.getAllPosts()) ?? []


    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.streetsofdanzig.com/en</loc>
     </url>
     <url>
       <loc>https://www.streetsofdanzig.com/de</loc>
     </url>
     <url>
       <loc>https://www.streetsofdanzig.com/en/streets/all</loc>
     </url>
     <url>
       <loc>https://www.streetsofdanzig.com/de/streets/all</loc>
     </url>
     <url>
       <loc>https://www.streetsofdanzig.com/en/districts/all</loc>
     </url>
     <url>
       <loc>https://www.streetsofdanzig.com/de/districts/all</loc>
     </url>
     ${allStreets
            .map(({ slug }) => {
                return `
       <url>
           <loc>https://www.streetsofdanzig.com${createStreetURL(slug, "en")}</loc>
       </url>
     `;
            })
            .join('')}
        ${allPosts
            .map(({ slug }) => {
                return `
                    <url>
                        <loc>https://www.streetsofdanzig.com${createPostURL(slug, "en")}</loc>
                    </url>
                    `;
            })
            .join('')}
   </urlset>
 `;
}