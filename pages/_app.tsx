import '../styles/index.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { Locales, Translation } from '../src/i18n/i18n-types'
import { loadedLocales } from '../src/i18n/i18n-util'
import { loadFormatters } from '../src/i18n/i18n-util.sync'
import TypesafeI18n from '../src/i18n/i18n-react'


///
export default function App({ Component, pageProps }: AppProps) {
  if (!pageProps.i18n) {
		// probably an Error page
		return <Component {...pageProps} />
	}

	const locale: Locales = pageProps.i18n.locale
	const dictionary: Translation = pageProps.i18n.dictionary

	loadedLocales[locale] = dictionary as Translation
	loadFormatters(locale)

	return (
		<TypesafeI18n locale={locale}>
			<div className="App">
				<Component {...pageProps} />
			</div>
		</TypesafeI18n>
	)
}


// logging
export { useReportWebVitals } from 'next-axiom';
