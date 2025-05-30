import Footer from './footer'
import HeaderNavigationModule from './navigation'
// import Head from 'next/head';
import { ContentfulLoader } from '../../lib/contentful';
import { i18n, type Locale } from "../../i18n-config";
// 3rd party
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
// css
import '../styles/global.css'
// consnet
import ConsentBanner from './consent/consentBanner';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  // load static navigation posts
  const { lang } = await params;
  const loader = new ContentfulLoader(3600, lang);
  const navigationPosts = await loader.getNavigationPosts();
  //
  return (
    <html lang={lang}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark')
                            }`,
        }} />
        <Script src='/resources/scripts/freshworks.js' strategy="afterInteractive" />
        <Script src='https://widget.freshworks.com/widgets/151000001120.js' strategy="afterInteractive" />
        <link href="/resources/lb2/css/lightbox.css" rel="stylesheet" />
        {/* styles etc */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/resources/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/resources/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/resources/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/resources/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/resources/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/resources/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/resources/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body>
        <ConsentBanner locale={lang} />
        <GoogleTagManager gtmId='GTM-W6NVS67' />
        <div className="flex flex-col h-full dark:bg-mybg-dark h-screen dark:text-mytxt-dark">
          <HeaderNavigationModule navigationPosts={navigationPosts} locale={lang} />
          <main className="py-0">{children}</main>
          <Footer locale={lang} />
        </div>
        <Script src='/resources/lb2/js/lightbox-plus-jquery.js' strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
