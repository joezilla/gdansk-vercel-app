import { push as Menu } from 'react-burger-menu'
import { DarkmodeToggle } from './darkmodeToggle'
import { IPost } from '../../src/@types/contentful'


type HeaderNaviProps = {
  currentPage?: string, 
  navigationPosts: Partial<IPost>[]
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {

  return (

    <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-header-dark fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="/" className="flex items-center">
          <img src="/favicon/android-chrome-512x512.png" className="h-6 mr-3 sm:h-9" alt="Danzig Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Danzig</span>
        </a>
        <div className="flex md:order-2">
          <DarkmodeToggle />
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
            </li>
            <li key="allstreets" className="flex">
              <a rel="noopener noreferrer" id="allstreets" key="allstreets" href="/allstreets" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">Strassenverzeichnis</a>
            </li>
            <li key="search" className="flex">
              <a rel="noopener noreferrer" id="search" key="search" href="/search" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">Suche</a>
            </li>
            {props.navigationPosts?.map(post =>
              <li>
                <a id={post.fields?.slug} key={post.fields?.slug} className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" href={`/posts/${post.fields?.slug}`}>{post.fields?.title}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>

  );
}