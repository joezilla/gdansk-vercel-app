import { ContentfulLoader } from '../../lib/contentful';
import { createPostURL } from '../../lib/urlutil';

const SITE_URL = 'https://www.streetsofdanzig.com';

export async function GET() {
  const loader = new ContentfulLoader();
  const allPosts = ((await loader.getAllPosts()) ?? []).filter(Boolean);

  const items = allPosts.map(post => {
    const url = `${SITE_URL}${createPostURL(post.slug, 'en')}`;
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
    </item>`;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Streets of Danzig</title>
    <link>${SITE_URL}</link>
    <description>Explore the rich history and culture of Danzig through its streets, people, and stories.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(feed, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
