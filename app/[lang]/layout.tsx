import Footer from './footer'
import HeaderNavigationModule from './navigation'
// import Head from 'next/head';
import { ContentfulLoader } from '../../lib/contentful';
import { i18n, type Locale } from "../../i18n-config";
// 3rd party
import { GoogleTagManager } from '@next/third-parties/google';
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
  params: { lang: Locale };
}) {
  // load static navigation posts
  const loader = new ContentfulLoader(3600, params.lang);
  const navigationPosts = await loader.getNavigationPosts();
  //
  return (
    <html lang={params.lang}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark')
                            }`,
        }} />
        <script type='text/javascript' src='/resources/scripts/freshworks.js' />
        <script type='text/javascript' src='https://widget.freshworks.com/widgets/151000001120.js' />
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
        <ConsentBanner locale={params.lang} />
        <GoogleTagManager gtmId='GTM-W6NVS67' />
        <div className="flex flex-col h-full dark:bg-mybg-dark h-screen dark:text-mytxt-dark">
          <HeaderNavigationModule navigationPosts={navigationPosts} locale={params.lang} />
          <main className="py-0">{children}</main>
          <Footer locale={params.lang} />
        </div>
        <script type='text/javascript' src='/resources/lb2/js/lightbox-plus-jquery.js' />
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"></script>
      </body>
    </html>
  )
}
