//
// Re-index entire list of acontent type
// 
// endpoint to re-index. /api/reindex/<content-type-name>
//

import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { revalidatePath } from 'next/cache';
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type ServiceResponse = {
    result: any
}


// 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ServiceResponse>
) {
    const API_KEY = process.env.API_KEY;
    const SECRET = req?.headers?.apisecret ?? "";

    try {
        if (SECRET === API_KEY) {
            // Process the POST request
            try {
                const fromHook = req.body as any;

                var slug = fromHook.fields.slug;
                var id = fromHook.sys.id;
                var type = fromHook.sys.type;

                log.info(`Revalidating type ${type} and slug ${slug}`);
                if(type === "street") {
                    revalidatePath(`/streets/${slug}`);
                    revalidatePath(`/de/streets/${slug}`);
                } 
                else if(type === "street") { 
                    revalidatePath(`/posts/${slug}`);
                    revalidatePath(`/de/posts/${slug}`);
                }
                else if(type === "district") { 
                    revalidatePath(`/districts/${slug}`);
                    revalidatePath(`/de/districts/${slug}`);                
                } else {
                    log.error(`Cannot handle type ${type}`);
                }

                res.status(200).json({ result: "ok" })

            } catch (e) {
                console.log(e);
                res.status(500).json({ result: `error: ${e}` });
            }
        } else {
            res.status(401).json({ result: "unauthenticated." });
        }
    } catch (err) {
        log.error("Error in handler", (err as Error));
        res.status(500).json({ result: `error: ${err}` });
    }
}