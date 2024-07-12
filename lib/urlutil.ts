/**
 * URL utils
 */


/**
 * Add locale and encode
 * @param slug 
 * @param locale 
 * @returns 
 */
export function createStreetURL( slug: string, locale: string = "" ) {
    return locale == "de" ? `/de/streets/${slug}` : `/streets/${slug}`;
}

export function parseStreetURL( url: string, locale: string = "" ) {
    return url.replace('/streets/', '');
}

/**
 * Add locale and encode
 * @param slug 
 * @param locale 
 * @returns 
 */
export function createPostURL(  slug: string, locale: string = "" ) {
    return locale == "de" ?  `/de/posts/${slugify(slug)}` : `/posts/${slugify(slug)}`;
}

export function parsePostURL( url: string ) {
    return unslugify(url.replace('/posts/', ''));
}

/**
 * Encode
 * @param url 
 * @returns 
 */
export function encodeUrl (url: string ) {
    return encodeUrl(url);
}

// turn string until url
export function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/ /g, '-');
//        .replace(/[^\w-]+/g, '');
}

// turn url into string
export function unslugify(str: string) {
    return str
        .replace(/-/g, ' ');
       // .replace(/[^a-zA-Z ]/g, '');
}