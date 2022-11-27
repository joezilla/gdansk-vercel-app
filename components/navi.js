import Head from 'next/head'
import { CMS_NAME, HOME_OG_IMAGE_URL } from '../lib/constants'
import Script from 'next/script'
import { slide as Menu } from 'react-burger-menu'

import { SearchBox } from 'react-instantsearch-dom';

/*
export default function Navi(navigationPosts) {
  return (
    <div className="menu-container relative flex container mx-auto px-5">
      <div className="list-menu invisible lg:visible place-content-center w-2/3">
         <ul>
          <li><a id="home" className="menu-item" href="/">Home</a></li>
          <li><a id="allstreets" className="menu-item" href="/allstreets">Alle Strassen</a></li>
          {navigationPosts?.navigationPosts?.map(post => 
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
*/

export default function Navi(navigationPosts) {
  return (
    <header className="p-4 dark:bg-gray-800 dark:text-gray-100 sticky top-0">
      <div className="container flex justify-between h-16 mx-auto">
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li key="home" className="flex">
            <a rel="noopener noreferrer" id="home" key="home" href="/" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Home</a>
          </li>
          <li key="allstreets" className="flex">
            <a rel="noopener noreferrer" id="allstreets" key="allstreets" href="/allstreets" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Strassenverzeichnis  </a>
          </li>
          {navigationPosts?.navigationPosts?.map(post =>
            <li key={post.slug} className="flex">
              <a rel="noopener noreferrer" id={post.slug} key={post.slug} href={`/posts/${post.slug}`} className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">{post.title}</a>
            </li>
          )}
        </ul>
        <div className="flex items-center w-96">
          <div className="relative">
            <form action="/search" method="GET">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="submit" title="Search" className="p-1 focus:outline-none focus:ring">
                <svg fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4 dark:text-gray-100">
                  <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                </svg>
              </button>
            </span>
              <div className="w-96 ">
                <input type="search" name="query" placeholder="Search..." className="focus:w-full py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-800 dark:text-gray-100 focus:dark:bg-gray-900" />
              </div>
            </form>
          </div>
          {/*<button type="button" className="hidden px-6 py-2 font-semibold rounded lg:block dark:bg-violet-400 dark:text-gray-900">Log in</button>*/}
        </div>
        <button title="Open menu" type="button" className="p-4 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 dark:text-gray-100">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}