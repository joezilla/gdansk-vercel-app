//
// Re-index entire list of acontent type
// 
// endpoint to re-index. /api/reindex/<content-type-name>
//
import { log } from 'next-axiom'
import { NextResponse, type NextRequest } from 'next/server'
import { headers } from 'next/headers'

export function GET(req: NextRequest) {
    return Response.json({"result": "ok - api level"});
}
