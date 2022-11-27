module.exports = {
  images: {
    loader: 'custom',
  },
  env: {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_ACCESS_TOKEN: process.env.ALGOLIA_ACCESS_TOKEN,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
  },
}