//
// This middleware redirects all requests to slugified lowercase paths for streets.
//


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { slugify } from './lib/urlutil';
import { log } from 'next-axiom';

// This function can be marked `async` if using `await` inside
/* export function middleware(request: NextRequest) {

    let pathName = new URL(request.url).pathname;
    let slugified = slugify(pathName);


    // wtf!? the config at the bottom is not working on vercel...

    let sampleRegEx: RegExp = /^\/streets\/([A-Z].*)$/;
    let match = sampleRegEx.exec(pathName);

    if (match) {
        log.debug(`Redirecting ${pathName} to ${slugified}`);
        return NextResponse.redirect(new URL(slugified, request.url))
    } 

    return; 
      
}
*/
// See "Matching Paths" below to learn more
/* export const config = {
  // matcher: [ '/streets/:name([A-Z].*)', '/(de|en)/streets/:name([A-Z].*)', ]  
}*/


const PUBLIC_FILE = /\.(.*)$/

export async function middleware(request: NextRequest) {
  /*
    const localeCookie = request.cookies.get("NEXT_LOCALE");
    // console.log("Local cookie is " + localeCookie.value);
    // console.log("curent locale is " + request.nextUrl.locale);
    // redirect if there's a mismatch
    if (localeCookie !== undefined && request.nextUrl.locale !== localeCookie.value) {
      console.debug("redirecting to " + {localeCookie});
      return NextResponse.redirect(new URL(`/${localeCookie}${request.nextUrl.pathname}`, request.url));
    }
    */
}
export const config = {
  // matcher: ["/", "/about"], // paths on which middleware will work
};