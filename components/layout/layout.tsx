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
      <div className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <Navi navigationPosts={props.navigationPosts}/>
        <main className="py-0">{props.children}</main>
      </div>
      <Footer />
      <Script src="/scripts/darkmode.js" strategy="lazyOnload" />
    </>
  )
}
