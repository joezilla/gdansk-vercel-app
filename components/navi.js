import Head from 'next/head'
import { CMS_NAME, HOME_OG_IMAGE_URL } from '../lib/constants'
import Script from 'next/script'
import { slide as Menu } from 'react-burger-menu'


export default function Navi(navigationPosts) {
  return (
    <div className="menu-container relative flex container mx-auto px-5">
      <div className="list-menu invisible lg:visible place-content-center w-2/3">
         <ul>
          <li><a id="home" className="menu-item" href="/">Home</a></li>
          <li><a id="allstreets" className="menu-item" href="/allstreets">Alle Strassen</a></li>
          {navigationPosts.navigationPosts.map(post => 
            <li><a id={post.slug} key={post.slug} className="menu-item" href={`/posts/${post.slug}`}>{post.title}</a></li>
          )}
        </ul>
      </div>
      <div className="lg:invisible">
        <Menu right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } width="50%">
          <a id="home" className="menu-item" href="/">Home</a>
          <a id="allstreets" className="menu-item" href="/allstreets">Alle Strassen</a>
          {navigationPosts.navigationPosts.map(post => 
            <a id={post.slug} key={post.slug} className="menu-item" href={`/posts/${post.slug}`}>{post.title}</a>
          )}
        </Menu>
      </div>
    </div>
    );
}

