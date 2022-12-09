import '../styles/index.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
///

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// logging
export { reportWebVitals } from 'next-axiom';
