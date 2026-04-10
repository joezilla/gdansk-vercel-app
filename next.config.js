module.exports = {
  images: {
    // loader: 'custom',    
    deviceSizes: [640, 1080, 1920],
    formats: ['image/webp'],
    minimumCacheTTL: 2592000, // 30 days — Contentful asset URLs are content-addressed/immutable
    // Allow SVG for placeholder image served by /cached-assets route when
    // a cached file is missing. Safe because we only serve our own SVG,
    // never user-supplied content.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // loaderFile: ''
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.ctfassets.net',
          port: '',
          pathname: '/9ieso0n2yz5w/**',
        },
      ],
  },
  
  env: {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_ACCESS_TOKEN: process.env.ALGOLIA_ACCESS_TOKEN,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME
  },
  compiler: {
    styledComponents: true // needed so that the dom manipulation of the darkmode icon works
  }
}