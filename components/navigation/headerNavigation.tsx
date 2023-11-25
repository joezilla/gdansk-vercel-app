import { push as Menu } from 'react-burger-menu'
import { DarkmodeToggle } from './darkmodeToggle'
import { IPost } from '../../lib/contentmodel/wrappertypes';
import Script from 'next/script'
import { Navbar } from 'flowbite-react';

type HeaderNaviProps = {
  currentPage?: string,
  navigationPosts: Partial<IPost>[]
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {
  return (
    <>
      <div className="border-b-1 border-slate-100">
        <Navbar
          fluid={true}
          rounded={true}
          className="dark:bg-black dark:text-white"
        >
          <Navbar.Brand href="/">
            <img
              src="/favicon/android-chrome-512x512.png"
              className="mr-3 h-6 sm:h-9"
              alt="Danzig Coat Of Arms"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              The Streets of Danzig
            </span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>

            <Navbar.Link
              key="home"
              href="/"
              active={true}>
              Home
            </Navbar.Link>

            <Navbar.Link key="allstreets" href="/allstreets">
              All Streets
            </Navbar.Link>

            <Navbar.Link key="search" href="/search">
              Search
            </Navbar.Link>

            {props.navigationPosts?.map(post =>
              <Navbar.Link key={post.fields?.slug} href={`/posts/${post.fields?.slug}`}>
                {post.fields?.title}
              </Navbar.Link>
            )}

            {
          <Navbar.Link key="darkmode">
            <DarkmodeToggle/>         
          </Navbar.Link>
            }
          </Navbar.Collapse>
        </Navbar>
      

      </div>

    </>
  );
}