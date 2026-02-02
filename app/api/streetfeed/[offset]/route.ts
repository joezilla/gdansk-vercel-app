// To stream responses you must use Route Handlers in the App Router, even if the rest of your app uses the Pages Router.

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import { log } from 'next-axiom'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlgoliaApi } from '../../../../lib/search';
import { NextRequest } from 'next/server';

import { StreetAPIResponse, StreetSummary } from '../../../../types/streetApi'

export async function GET(req: NextRequest, {params} : {params: Promise<{ offset: string}>}) {

    try {
        const { offset } = await params;
        const locale = "en-US";

        //console.log(`Calling with locale ${locale} and offset ${offset}`);

        const loader = new AlgoliaApi(locale);

        const apiResult = await loader.getStreetsWithImages(Number(offset));

        const data: StreetSummary[]  = [];

        apiResult.forEach((e) =>
            data.push({
                germanName: e.germanName,
                imageUrl: e.imageUrl,
                polishNames: e.polishNames,
                slug: e.slug
            })
        );

        const response: StreetAPIResponse = {
            success: true,
            message: "ok",
            total_streets: data.length,
            offset: Number(offset),
            streets: data
        }

        return Response.json(response);

    } catch (err) {
        log.error("Error in handler", (err as Error));
        const errorResponse: StreetAPIResponse = {
            success: false,
            message: "Error in handler: " + err,
            total_streets: -1,
            offset: -1,
            streets: []
        }
        return Response.json(errorResponse);
    }


}