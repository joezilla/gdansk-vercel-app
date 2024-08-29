//
// Contentful hook to revalidate pages. Expects contentful hook json structure and API key in header.
//
import { log } from 'next-axiom'
import { type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache';
import { ObjectCache } from '../../../../lib/objectcache';

export async function GET() {
    return Response.json({ result: 'Unauthorized' }, { status: 403 })
}

export async function POST(req: NextRequest) {
    const API_KEY = process.env.API_KEY;

    const headersList = headers();
    const secret = headersList.get("apisecret");

    if (secret === API_KEY) {
        const fromHook = await req.json()
        var slug = fromHook.fields.slug['en-US'];
        var type = fromHook.sys.contentType.sys.id;
        log.info(`Revalidating type ${type} and slug ${slug}`);
        
        // clear object cache, nuclear option
        new ObjectCache().clearCache();

        // re-validate paths 
        doRevalidate(type, slug);
        
        return Response.json({ result: `Revalidated ${type} with slug ${slug}. Thank you.` }, { status: 200 });
    } else {
        log.warn(`Unauthorized API call with secret ${secret}`);
        return Response.json({ result: 'Unauthorized' }, { status: 403 })
    }
}

function doRevalidate(type: string, slug: string) {
    if(type === "street") {
        revalidatePath(`/en/streets/${slug}`);
        revalidatePath(`/de/streets/${slug}`);
    } 
    else if(type === "post") { 
        revalidatePath(`/en/posts/${slug}`);
        revalidatePath(`/de/posts/${slug}`);
    }
    else if(type === "district") { 
        revalidatePath(`/en/districts/${slug}`);
        revalidatePath(`/de/districts/${slug}`);                
    } else {
        log.error(`Cannot handle type ${type}`);
    }
}
