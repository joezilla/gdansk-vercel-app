import '../styles/index.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'


///
export default function App({ Component, pageProps }: AppProps) {
	if (!pageProps.i18n) {
		// probably an Error page
		return <Component {...pageProps} />
	}

	return (
		<div className="App">
			<Component {...pageProps} />
		</div>
	)
}


// logging
export { useReportWebVitals } from 'next-axiom';
