// To stream responses you must use Route Handlers in the App Router, even if the rest of your app uses the Pages Router.

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import { log } from 'next-axiom'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlgoliaApi } from '../../../../lib/search';

import { StreetAPIResponse, StreetSummary } from '../../../../types/streetApi'

// 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StreetAPIResponse>
) {

    try {            
        const {
            query: { offset }, 
            method,
        } = req;
        // can be array or single string


        // todo: fixx the parameters


        var o = Array.isArray(offset) ? offset[0] : offset;       
        // var l = Array.isArray(locale) ?locale[0] : locale;       

        var locale = "en-US";
    
        console.log(`Calling with locale ${locale} and offset ${offset}`);

        let loader = new AlgoliaApi(locale);
        
        var apiResult = await loader.getStreetsWithImages(Number(offset));
    
        var data: StreetSummary[]  = [];

        apiResult.forEach((e) =>
            data.push({
                germanName: e.germanName,
                imageUrl: e.imageUrl,
                polishNames: e.polishNames,
                slug: e.slug
            })
        );

        var response: StreetAPIResponse = {
            success: true,
            message: "ok",
            total_streets: data.length,
            offset: Number(offset),
            streets: data
        }

        res.status(200).json(response);        

    } catch (err) {
        log.error("Error in handler", (err as Error));
        var response: StreetAPIResponse = {
            success: false,
            message: "Error in handler: " + err,
            total_streets: -1,
            offset: -1,
            streets: []

        }
        res.status(500).json(response);
    }


}