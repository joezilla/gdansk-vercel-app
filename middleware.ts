//
// This middleware redirects all requests to slugified lowercase paths for streets.
//
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { slugify } from './lib/urlutil';
import { log } from 'next-axiom';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    let pathName = new URL(request.url).pathname;

    let slugified = slugify(pathName);

    // wtf!? the config at the bottom is not working on vercel...

    let sampleRegEx: RegExp = /^\/streets\/([A-Z].*)$/;
    let match = sampleRegEx.exec(pathName);

    if (match) {
        log.debug(`Redirecting ${pathName} to ${slugified}`);
        return NextResponse.redirect(new URL(slugified, request.url))
    } 
    
}

// See "Matching Paths" below to learn more
export const config = {
     matcher: '/streets/:name([A-Z].*)',
}
