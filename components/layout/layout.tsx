import Footer from '../footer'
import Meta from './meta'
import Navi from '../navigation'
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
      <div className="min-h-screen" id="outer-container">
        <Navi navigationPosts={props.navigationPosts}/>
        <main id="page-wrap" className="pt-0.5">{props.children}</main>
      </div>
      <Footer />
    </>
  )
}
