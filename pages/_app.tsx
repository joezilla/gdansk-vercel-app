import '../styles/index.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
///

export default function App({ Component, pageProps }: AppProps) {
  return (<>
    <Component {...pageProps} />
  </>);
}

// logging
export { useReportWebVitals } from 'next-axiom';
