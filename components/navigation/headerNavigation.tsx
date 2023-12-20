import { DarkmodeToggle } from './darkmodeToggle'
import { IPost } from '../../lib/contentmodel/wrappertypes';
import { Navbar } from 'flowbite-react';

type HeaderNaviProps = {
  currentPage?: string,
  navigationPosts: Partial<IPost>[],
  locale: string
}

function addLocale(link: string, locale: string) {
  let r = link;
  if(locale == "de") {
    r = "/de" + r;
  }
  return r;
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
          <Navbar.Brand href={addLocale("/", props.locale)}>
            <img
              src="/favicon/android-chrome-512x512.png"
              className="mr-3 h-6 sm:h-9"
              alt="Danzig Coat Of Arms"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              SITE TITLE HERE TODO
            </span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>

            <Navbar.Link
              key="home"
              href={addLocale("/", props.locale)}
              active={true}>
              Home
            </Navbar.Link>

            <Navbar.Link key="allstreets" href={addLocale("/allstreets", props.locale)}>
              All Streets
            </Navbar.Link>

            <Navbar.Link key="search" href={addLocale("/search", props.locale)}>
              Search
            </Navbar.Link>

            {props.navigationPosts?.map(post =>
              <Navbar.Link key={post.fields?.slug} href={addLocale(`/posts/${post.fields?.slug}`, props.locale)}>
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