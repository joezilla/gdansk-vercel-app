/**
 * Return all streets as a CSV
 * 
 * slug, street_name, german_name, district, polish_name_1, polish_name_2, polish_name_3, polish_name_5, , polish_name_5
 * 
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { ContentfulLoader } from '../../../lib/contentful';

type ServiceResponse = {
    result: any
}

// 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const API_KEY = process.env.API_KEY;
    const SECRET = req?.headers?.apisecret ?? "";

    let loader = new ContentfulLoader(3600, "en-US");

    try {
        if (/* SECRET === API_KEY */ true) {
            // Process the POST request
            try {
                let streets = await loader.getAllStreets();
                let result = "slug, german_name, district, district_1, district_2, district_3, polish_name_1, polish_name_2, polish_name_3, polish_name_5, , polish_name_5\n";
                streets.map(street => {
                    result = result.concat(`${street.slug}, ${street.germanName}, ,,,,,,\n`);
                });
                res
                    .setHeader("Content-Type", "text/csv")
                    .setHeader("Content-Disposition", `attachment; filename=streets.csv`)
                    .send(result);
            } catch (e) {
                console.log(e);
                res.status(500).send(`error: ${e}`);
            }
        } else {
            res.status(401).json("unauthenticated");
        }
    } catch (err) {
        log.error("Error in handler", (err as Error));
        res.status(500).json(`error: ${err}`);
    }
}