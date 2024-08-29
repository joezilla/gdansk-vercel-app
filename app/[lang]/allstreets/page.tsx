import { permanentRedirect } from 'next/navigation'
import { Locale } from '../../../i18n-config';

export default async function Page({ params: { lang }, }: { params: { lang: Locale }; }) { 
    permanentRedirect(`/${lang}/streets/all`);
}