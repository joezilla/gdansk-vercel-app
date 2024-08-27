'use client';

import { DarkmodeToggle } from '../navigation/darkmodeToggle'
import { useRouter, usePathname } from 'next/navigation'


type FooterProps = {
  locale: string
}

/**
 * Footer.
 * @returns 
 */
export default function Footer(props: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }
  return (
    <footer className="py-8 mt-auto dark:bg-mybg-dark dark:text-mytxt-dark border-t border-gray-200 dark:border-gray-600">
      <div className="container flex flex-wrap items-center justify-center mx-auto space-y-4 sm:justify-between sm:space-y-0">
        <div className="flex flex-row pr-3 space-x-4 sm:space-x-8">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5 rounded-full text-black dark:text-gray-100">
              <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
            </svg>
          </div>
          <ul className="flex flex-wrap items-center space-x-4 sm:space-x-8">
            <li>
              Built with Contentful, NextJS, and Algolia.
            </li>
          </ul>
        </div>
        <ul className="flex flex-wrap pl-3 space-x-4 sm:space-x-8">
            <div
              onClick={() => {
                switchLocale('en');
              }}
            >English</div>
            <div
              onClick={() => {
                switchLocale('de');
              }}
            >German</div>
            <li><DarkmodeToggle/></li>
          <li>
            <a rel="noopener noreferrer" href="https://github.com/joezilla/gdansk-vercel-app">Source on Github</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}