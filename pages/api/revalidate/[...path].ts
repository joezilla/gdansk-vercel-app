//
// Re-index entire list of acontent type
// 
// endpoint to re-index. /api/reindex/<content-type-name>
//

import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { ObjectCache } from '../../../lib/objectcache';
import { IndexingController } from '../../../lib/indexer';
import { isEmptyString } from "../../../lib/util";
import { StreetFeeder, PostFeeder } from "../../../lib/customfeeders";

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

                const {
                    query: { path },
                    method,
                } = req;

                const ft = Array.isArray(path) ? path.join('/') : path;

                const fullPath = '/' + ft;
                console.log(`Revalidating path ${fullPath}`);
                res.revalidate(fullPath);

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