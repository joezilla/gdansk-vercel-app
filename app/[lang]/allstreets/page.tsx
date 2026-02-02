import { permanentRedirect } from 'next/navigation'
import { Locale } from '../../../i18n-config';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang: langParam } = await params;
    const lang = langParam as Locale;
    permanentRedirect(`/${lang}/streets/all`);
}