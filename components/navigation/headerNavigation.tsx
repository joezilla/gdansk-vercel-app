import { push as Menu } from 'react-burger-menu'
import { DarkmodeToggle } from './darkmodeToggle'
import { IPost } from '../../src/@types/contentful'
import Script from 'next/script'
import { Navbar } from 'flowbite-react';

type HeaderNaviProps = {
  currentPage?: string,
  navigationPosts: Partial<IPost>[]
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {
  return (
    <div className="border-b-1 border-slate-100">
      <Navbar
        fluid={true}
        rounded={true}
      >
        <Navbar.Brand href="/">
          <img
            src="/favicon/android-chrome-512x512.png"
            className="mr-3 h-6 sm:h-9"
            alt="Danzig Coat Of Arms"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Danzig
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>

          <Navbar.Link
            href="/"
            active={true}>
            Home
          </Navbar.Link>

          <Navbar.Link href="/allstreets">
            All Streets
          </Navbar.Link>

          <Navbar.Link href="/search">
            Search
          </Navbar.Link>

          {props.navigationPosts?.map(post =>
            <Navbar.Link href={`/posts/${post.fields?.slug}`}>
              {post.fields?.title}
            </Navbar.Link>
          )}

          <Navbar.Link>
            <DarkmodeToggle/>         
          </Navbar.Link>

        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}