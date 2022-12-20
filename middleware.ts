//
// This middleware redirects all requests to slugified lowercase paths for streets.
//
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { slugify } from './lib/urlutil';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
   
    console.log("**************");
    console.log(request.url);

    let path = slugify(new URL(request.url).pathname);

    console.log("Redirecting to: " + path);

    return NextResponse.redirect(new URL(path, request.url))


}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/streets/:name([A-Z].*)',
}
