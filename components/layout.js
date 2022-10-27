import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'
import { slide as Menu } from 'react-burger-menu'

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen" id="outer-container">
        <Menu right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
          <a id="home" className="menu-item" href="/">Home</a>
          <a id="about" className="menu-item" href="/posts/about">About</a>
        </Menu>
        <main id="page-wrap">{children}</main>
      </div>
      <Alert preview={preview} />
      <Footer />
    </>
  )
}
