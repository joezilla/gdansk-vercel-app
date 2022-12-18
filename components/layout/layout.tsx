import Footer from '../footer'
import Meta from './meta'
import Navi from '../navigation'
import Script from 'next/script'
import { IPost } from '../../src/@types/contentful'

type LayoutProps = {
    children: React.ReactNode,
    preview?: boolean
    navigationPosts: IPost[]
  }

export function Layout(props: LayoutProps) {
  return (
    <>
      <Meta />
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W6NVS67"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
      `}
      </Script>
      <div className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <Navi navigationPosts={props.navigationPosts}/>
        <main className="py-0">{props.children}</main>
      </div>
      <Footer />
      <Script src="/scripts/darkmode.js" strategy="lazyOnload" />

    </>
  )
}
