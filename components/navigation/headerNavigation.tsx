import Head from 'next/head'
import Script from 'next/script'
import { push as Menu } from 'react-burger-menu'
import { IPost } from '../../src/@types/contentful'


type HeaderNaviProps = {
  navigationPosts: IPost[]
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {

  return (
    <header className="p-4 dark:bg-gray-800 dark:text-gray-100 sticky top-0">
      <div className="container flex justify-between h-16 mx-auto">
        <ul className="items-stretch hidden space-x-3 md:flex">
          <li key="home" className="flex">
            <a rel="noopener noreferrer" id="home" key="home" href="/" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Home</a>
          </li>
          <li key="allstreets" className="flex">
            <a rel="noopener noreferrer" id="allstreets" key="allstreets" href="/allstreets" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Strassenverzeichnis</a>
          </li>
          <li key="search" className="flex">
            <a rel="noopener noreferrer" id="search" key="search" href="/search" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Suche</a>
          </li>
          {props.navigationPosts?.map(post =>
            <li key={post.fields.slug} className="flex">
              <a rel="noopener noreferrer" id={post.fields.slug} key={post.fields.slug} href={`/posts/${post.fields.slug}`} className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">{post.fields.title}</a>
            </li>
          )}
        </ul>
        {/*
        <div className="hidden md:flex items-center w-96">
          <div className="relative">
                    
            <form action="/search" method="GET">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" title="Search" className="p-1 focus:outline-none focus:ring">
                  <svg fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4 dark:text-gray-100">
                    <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                  </svg>
                </button>
              </span>
  
              <div className="w-full">
                <input type="search" name="query" placeholder="Search..." className="focus:w-full py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-800 dark:text-gray-100 focus:dark:bg-gray-900" />
              </div>
         
            </form>
          </div>
          {<button type="button" className="hidden px-6 py-2 font-semibold rounded lg:block dark:bg-violet-400 dark:text-gray-900">Log in</button>
        </div>
      */}
        {/* Hamburger menu */}
        <div className="md:invisible p-4">
          <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"} width="50%">
            <a id="home" className="menu-item dark:text-white" href="/">Home</a>
            <a id="allstreets" className="menu-item dark:text-white" href="/allstreets">Strassenverzeichnis</a>
            <a id="search" className="menu-item dark:text-white" href="/search">Suche</a>
            {props.navigationPosts.map(post =>
              <a id={post.fields.slug} key={post.fields.slug} className="menu-item dark:text-white" href={`/posts/${post.fields.slug}`}>{post.fields.title}</a>
            )}
          </Menu>
        </div>
        {/*}
        <button title="Open menu" type="button" className="p-4 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 dark:text-gray-100">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
          */}
      </div>
    </header>
  );
}