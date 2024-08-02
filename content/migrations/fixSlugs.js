// remove umlauts and sz from street slugs
module.exports = function (migration) {

    // turn string until url
    function slugify(str) {
        return str ? str.replaceAll(/ /g, '-').replaceAll('ö', 'oe').replaceAll('ä', 'ae').replaceAll('ü', 'ue').replaceAll('ß', 'ss') : undefined;
    }

    // Derives categories based on tags and links these back to blog post entries.
    migration.transformEntries({
        // Start from blog post's tags field
        contentType: 'street',
        from: ['slug'],
        // We'll only create a category using a name for now.
        to: ['slug'],
        transformEntryForLocale: async (from, locale) => {
            if (locale !== 'en-US') {
                return;
            }

            var newSlug = slugify(from.slug['en-US']);
            var oldSlug = from.slug['en-US'];

            if(newSlug !== oldSlug) {
               console.log(`${oldSlug} => ${newSlug}`);
            }            
            return {
                slug: newSlug
            }
        }
    })
}