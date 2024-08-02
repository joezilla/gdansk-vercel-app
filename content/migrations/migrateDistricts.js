

module.exports = function (migration) {

    var lookup = new Map([
        ['Altschottland/Stolzenberg', [{ name: 'Altschottland', slug: 'altschottland' }, { name: 'Stolzenberg', slug: 'stolzenberg' }]],
        ['Altstadt', [{ name: 'Altstadt', slug: 'altstadt' }]],
        ['Brentau', { name: 'Brentau', slug: 'brentau' }],
        ['Brösen', [{ name: 'Brösen', slug: 'broesen' }]],
        ['Bürgerwiesen', [{ name: 'Bürgerwiesen', slug: 'buergerwiesen' }]],
        ['Emaus', [{ name: 'Emaus', slug: 'emaus' }]],
        ['Glettkau', [{ name: 'Glettkau', slug: 'glettkau' }]],
        ['Heubude', [{ name: 'Heubude', slug: 'heubude' }]],
        ['Krakau', [{ name: 'Krakau', slug: 'krakau' }]],
        ['Krakau/West. Neufähr', [{ name: 'Krakau', slug: 'krakau' }, { name: 'Westlich Neufähr', slug: 'westlich_neufaehr' }]],
        ['Krakau/Westl. Neufähr', [{ name: 'Krakau', slug: 'krakau' }, { name: 'Westlich Neufähr', slug: 'westlich_neufaehr' }]],
        ['Langfuhr', [{ name: 'Langfuhr', slug: 'langfuhr' }]],
        ['Langführ', [{ name: 'Langfuhr', slug: 'langfuhr' }]],
        ['Langfuhr/Brentau', [{ name: 'Langfuhr', slug: 'langfuhr' }, { name: 'Brentau', slug: 'brentau' }]],
        ['Langfuhr/Neufahrwasser', [{ name: 'Langfuhr', slug: 'langfuhr' }, { name: 'Neufahrwasser', slug: 'neufahrwasser' }]],
        ['Langgarten', [{ name: 'Langgarten', slug: 'langgarten' }]],
        ['Lauental', [{ name: 'Lauental', slug: 'lauental' }]],
        ['Neufahrwasse', [{ name: 'Neufahrwasser', slug: 'neufahrwasser' }]],
        ['Neufahrwasser', [{ name: 'Neufahrwasser', slug: 'neufahrwasser' }]],
        ['Neugarten', [{ name: 'Neugarten', slug: 'neugarten' }]],
        ['Neuschottland', [{ name: 'Neuschottland', slug: 'neuschottland' }]],
        ['Niederstadt', [{ name: 'Niederstadt', slug: 'niederstadt' }]],
        ['Niederstadtt', [{ name: 'Niederstadt', slug: 'niederstadt' }]],
        ['Ohra', [{ name: 'Ohra', slug: 'ohra' }]],
        ['Oliva', [{ name: 'Oliva', slug: 'oliva' }]],
        ['Olszynka', [{ name: 'Walddorf', slug: 'walddorf' }]],
        ['Petershagen', [{ name: 'Petershagen', slug: 'petershagen' }]],
        ['Rechtstadt', [{ name: 'Rechtstadt', slug: 'rechtstadt' }]],
        ['Saspe', [{ name: 'Saspe', slug: 'saspe' }]],
        ['Schellmühl', [{ name: 'Schellmühl', slug: 'schellmuehl' }]],
        ['Schidlitz', [{ name: 'Schidlitz', slug: 'schidlitz' }]],
        ['Schidlitz/Altschottland', [{ name: 'Schidlitz', slug: 'schidlitz' }, { name: 'Altschottland', slug: 'altschottland' }]],
        ['Schwarzes Meer', [{ name: 'Schwarzes Meer', slug: 'schwarzes_meer' }]],
        ['Speicherinsel', [{ name: 'Speicherinsel', slug: 'speicherinsel' }]],
        ['Stadtgebiet', [{ name: 'Stadtgebiet', slug: 'stadtgebiet' }]],
        ['Stadtgebiet/Rechtstadt', [{ name: 'Stadtgebiet', slug: 'stadtgebiet' }, { name: 'Rechtstadt', slug: 'rechtstadt' }]],
        ['Stadtteil', [{ name: 'Stadtteil', slug: 'stadtteil' }]],
        ['Stolzenberg', [{ name: 'Stolzenberg', slug: 'stolzenberg' }]],
        ['Troyl', [{ name: 'Troyl', slug: 'troyl' }]],
        ['Vorstadt', [{ name: 'Vorstadt', slug: 'vorstadt' }]],
        ['Walddorf', [{ name: 'Walddorf', slug: 'walddorf' }]],
        ['Weichselmünde', [{ name: 'Weichselmünde', slug: 'weichselmuende' }]],
        ['Westerplatte', [{ name: 'Westerplatte', slug: 'westerplatte' }]],
        ['Zigankenberg', [{ name: 'Zigankenberg', slug: 'zigankenberg' }]],
        ['Zoppot', [{ name: 'Zoppot', slug: 'zoppot' }]],
        
    ])

    // Derives categories based on tags and links these back to blog post entries.
    migration.deriveLinkedEntries({
        // Start with street's district 
        contentType: 'street',
        //  derivedContentType: 'district',
        from: ['district'],
        // This is the field we created above, which will hold the link to the derived category entries.
        toReferenceField: 'district_ref',
        // The new entries to create are of type 'category'.
        derivedContentType: 'district',
        // We'll only create a category using a name and a slug for now.
        derivedFields: ['slug', 'name'],
        // We'll only create a category using a name for now.
        // toReferenceField: ['district_ref'],
        identityKey: async (from) => {
            // The category name will be used as an identity key.
            var orig = from.district['en-US'];
            var target = lookup.get(orig);
            if (target && target.length > 0) {
                return target[0].slug;
             }
            else
                return;
        },
        deriveEntryForLocale: async (from, locale) => {
            if (locale !== 'en-US') {
                return;
            }
            var orig = from.district['en-US'];
            var target = lookup.get(orig);
            if (target && target.length > 0) {
                console.log(`${orig} =>`); console.log(target);
                return target[0];
            } else return
        }
    })
}