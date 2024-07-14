/**
 * URL utils
 */
export function createStreetURL( slug: string, locale: string = "" ) {
    return locale == "de" ? `/de/streets/${slug}` : `/streets/${slug}`;
}

export function parseStreetURL( url: string, locale: string = "" ) {
    return url.replace('/streets/', '');
}

export function createPostURL(  slug: string, locale: string = "" ) {
    return locale == "de" ?  `/de/posts/${slugify(slug)}` : `/posts/${slugify(slug)}`;
}

export function parsePostURL( url: string ) {
    return unslugify(url.replace('/posts/', ''));
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