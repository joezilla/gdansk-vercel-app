module.exports = {
  images: {
    loader: 'custom',    
    deviceSizes: [640, 1080, 1920],
    formats: ['image/webp'],
    minimumCacheTTL: 3600,
  },
  env: {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_ACCESS_TOKEN: process.env.ALGOLIA_ACCESS_TOKEN,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
  },
  compiler: {
    styledComponents: true // needed so that the dom manipulation of the darkmode icon works
  }
}