import { Locale } from '../../../i18n-config';
import { I18N } from '../../../lib/i18n';
import { Metadata } from 'next';
import SearchPageClient from './searchPageClient';
import { hreflangAlternates } from '../../../lib/hreflang';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = new I18N(lang).getTranslator();
  return {
    title: t('search.title'),
    description: t('search.description'),
    alternates: hreflangAlternates(lang, '/search'),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  return <SearchPageClient lang={lang} />;
}
