
import { ContentfulLoader, StreetSummary, PostSummary } from '../lib/contentful'
import { createPostURL, createStreetURL } from '../lib/urlutil';

type SitemapProps = {
    allStreets: StreetSummary[],
    allPosts: PostSummary[]
}
//pages/sitemap.xml.js
const EXTERNAL_DATA_URL = 'https://jsonplaceholder.typicode.com/posts';


export default function generateSitemap(props: SitemapProps) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>/allstreets</loc>
     </url>
     ${props.allStreets
            .map(({ germanName }) => {
                return `
       <url>
           <loc>${createStreetURL(germanName)}</loc>
       </url>
     `;
            })
            .join('')}
        ${props.allPosts
            .map(({ slug }) => {
                return `
                    <url>
                        <loc>${createPostURL(slug)}</loc>
                    </url>
                    `;
            })
            .join('')}
   </urlset>
 `;
}

// export async function getStaticProps({ preview = false }) {

export async function getServerSideProps({ res }: { res: any }) {

    let loader = new ContentfulLoader();
    const allStreets = (await loader.getAllStreets()) ?? []
    const allPosts = (await loader.getAllPosts()) ?? []
    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(generateSitemap({ allStreets, allPosts }));
    res.end();

    return {
        props: {
        },

    };

}

