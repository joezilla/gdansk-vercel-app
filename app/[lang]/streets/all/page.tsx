export const dynamic = 'force-static'

import { Metadata } from 'next'
import { getContentfulLoader } from '../../../../lib/contentful'
import { Locale } from "../../../../i18n-config";
import { StreetOverview } from '../streetoverview'
import { I18N } from '../../../../lib/i18n'
import { hreflangAlternates } from '../../../../lib/hreflang'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang: langParam } = await params;
    const lang = langParam as Locale;
    const i18n = new I18N(lang).getTranslator();
    return {
        title: i18n('allstreets.header'),
        alternates: hreflangAlternates(lang, '/streets/all'),
    };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang: langParam } = await params;
    const lang = langParam as Locale;

    const i18n = new I18N(lang).getTranslator();
    const loader = getContentfulLoader(3600, lang);
    const allStreets = await loader.getAllStreets();

    return (
        <section>
            <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-24">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-6">
                                {i18n("allstreets.header")}
                            </h1>
                            <p className="text-lg text-on-surface/60 font-body leading-relaxed max-w-xl">
                                {i18n("allstreets.subhead", { "count": allStreets.length })}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 pb-2">
                            <span className="text-xs font-label uppercase tracking-widest text-on-surface/40 border-b border-outline-variant/30 pb-1">
                                Total Entries: {allStreets.length.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </header>
                <StreetOverview streets={allStreets} />
            </div>
        </section>
    );
}
