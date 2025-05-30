//
// Contentful hook to reindex object in Algolia. Expects contentful hook json structure and API key in header.
//
import { log } from 'next-axiom'
import { type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache';
import { ObjectCache } from '../../../../../lib/objectcache';
import { IndexingController } from '../../../../../lib/indexer';
import { StreetFeeder, PostFeeder } from '../../../../../lib/customfeeders';

export async function GET() {
    return Response.json({ result: 'Unauthorized' }, { status: 403 })
}



export async function POST(req: NextRequest) {
    const API_KEY = process.env.API_KEY;

    const headersList = await headers();
    const secret = headersList.get("apisecret");

    if (secret === API_KEY) {
        const fromHook = await req.json()
        var slug = fromHook.fields.slug['en-US'];
        var type = fromHook.sys.contentType.sys.id;
        log.info(`Reindex type ${type} and slug ${slug}`);
        
        // re-validate paths 
        doReindex(type, slug);
        
        return Response.json({ result: `Reindexed ${type} with slug ${slug}. Thank you.` }, { status: 200 });
    } else {
        log.warn(`Unauthorized API call with secret ${secret}`);
        return Response.json({ result: 'Unauthorized' }, { status: 403 })
    }
}

function doReindex(type: string, slug: string) {
    

    let ic = new IndexingController();
    // register the two feeders available
    ic.addFeeder("street", new StreetFeeder());
    ic.addFeeder("post", new PostFeeder());

    log.info(`Re-Indexing all of type >${type}<`);

    // prob should make this parameterized
   //  ic.indexAll(ft as string, "en-US");
   //  ic.indexAll(ft as string, "de");
}
