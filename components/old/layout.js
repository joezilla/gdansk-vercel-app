import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'
import Navi from './naviOLD'
import { slide as Menu } from 'react-burger-menu'

export default function Layout({ preview, children, navigationPosts }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen" id="outer-container">
        <Navi navigationPosts={navigationPosts}/>
        <main id="page-wrap" className="pt-0.5">{children}</main>
      </div>
      {/*<Alert preview={preview} />*/}
      <Footer />
    </>
  )
}
