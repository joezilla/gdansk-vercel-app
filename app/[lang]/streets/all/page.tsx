export const dynamic = 'force-static'

import { ContentfulLoader } from '../../../../lib/contentful'
import { log } from 'next-axiom'
import { Locale } from "../../../../i18n-config";
import { StreetOverview } from '../streetoverview'
import { I18N } from '../../../../lib/i18n'

export default async function Page({ params: { lang }, }: { params: { lang: Locale }; }) {

    const i18n = new I18N(lang).getTranslator();
    let loader = new ContentfulLoader(3600, lang);
    let allStreets = await loader.getAllStreets();

    return (
        <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
            <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter md:pr-8 dark:text-white">
                    {i18n("allstreets.header")}
                </h1>
                <span className="text-sm">{i18n("allstreets.subhead", { "count": allStreets.length })}</span>
                <StreetOverview streets={allStreets} />
            </div>
        </section>

    );

}