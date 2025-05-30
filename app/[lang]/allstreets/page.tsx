import { permanentRedirect } from 'next/navigation'
import { Locale } from '../../../i18n-config';

export default async function Page({ params }: { params: Promise<{ lang: Locale }>; }) {
    const { lang } = await params; 
    permanentRedirect(`/${lang}/streets/all`);
}