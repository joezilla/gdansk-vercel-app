module.exports = function (migration) {

    // turn string until url
    function slugify(str) {
        return str ? str.toLowerCase().replace(/ /g, '-') : undefined;
        }

    // Derives categories based on tags and links these back to blog post entries.
    migration.transformEntries({
        // Start from blog post's tags field
        contentType: 'street',
        from: ['germanName'],
        // We'll only create a category using a name for now.
        to: ['slug'],
        transformEntryForLocale: async (from, locale) => {
            var newName = slugify(from.germanName[locale]);
            console.log(`${from.germanName[locale], locale} => ${newName}`);
            return {
                slug: newName
            }
        }
    })
}