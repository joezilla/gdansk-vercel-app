//
// Contentful hook to revalidate pages. Expects contentful hook json structure and API key in header.
//
import { log } from 'next-axiom'
import { type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET() {
    return Response.json({ result: 'Unauthorized' }, { status: 403 })
}

export async function POST(req: NextRequest) {
    const API_KEY = process.env.API_KEY;

    const headersList = await headers();
    const secret = headersList.get("apisecret");

    if (secret === API_KEY) {
        const fromHook = await req.json()
        const slug = fromHook.fields.slug['en-US'];
        const type = fromHook.sys.contentType.sys.id;
        log.info(`Revalidating type ${type} and slug ${slug}`);

        // Per-entry tag invalidation (fine-grained)
        // Plus list/homepage tags since changes may affect aggregate queries.
        if (type === 'street') {
            revalidateTag(`street:${slug}`);
            revalidateTag('streets-list');
            revalidateTag('homepage'); // featured streets reference
        } else if (type === 'post') {
            revalidateTag(`post:${slug}`);
            revalidateTag('posts-list');
            revalidateTag('navigation'); // navigation posts
            revalidateTag('homepage');   // featured posts reference
        } else if (type === 'district') {
            revalidateTag(`district:${slug}`);
            revalidateTag('districts-list');
            revalidateTag('homepage');   // featured districts reference
        } else if (type === 'homepage') {
            revalidateTag('homepage');
        }

        // re-validate paths (homepage, list pages, detail pages)
        doRevalidate(type, slug);

        return Response.json({ result: `Revalidated ${type} with slug ${slug}. Thank you.` }, { status: 200 });
    } else {
        log.warn(`Unauthorized API call with secret ${secret}`);
        return Response.json({ result: 'Unauthorized' }, { status: 403 })
    }
}

function doRevalidate(type: string, slug: string) {
    // Homepage is affected by any content change (featured references)
    revalidatePath('/en');
    revalidatePath('/de');

    if (type === "street") {
        revalidatePath(`/en/streets/${slug}`);
        revalidatePath(`/de/streets/${slug}`);
        revalidatePath('/en/streets/all');
        revalidatePath('/de/streets/all');
    } else if (type === "post") {
        revalidatePath(`/en/posts/${slug}`);
        revalidatePath(`/de/posts/${slug}`);
    } else if (type === "district") {
        revalidatePath(`/en/districts/${slug}`);
        revalidatePath(`/de/districts/${slug}`);
        revalidatePath('/en/districts/all');
        revalidatePath('/de/districts/all');
    } else if (type === "homepage") {
        // Homepage paths already revalidated above
    } else {
        log.error(`Cannot handle type ${type}`);
    }
}
