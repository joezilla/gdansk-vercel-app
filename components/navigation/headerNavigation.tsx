import { DarkmodeToggle } from './darkmodeToggle'
import { IPost } from '../../lib/contentmodel/wrappertypes';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { useRouter } from 'next/router'
import { I18N } from "../../lib/i18n";

type HeaderNaviProps = {
  currentPage?: string,
  navigationPosts: Partial<IPost>[],
  locale: string
}

function addLocale(link: string, locale: string) {
  let r = link;
  if (locale == "de") {
    r = "/de" + r;
  }
  return r;
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {
  const i18n = new I18N(props.locale).getTranslator();
  const router = useRouter()
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
              {i18n("homepage.title")}
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

<div className="flex items-center gap-4">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <img src={`/locales/${props.locale}.svg`} alt={props.locale} className="mr-3 h-6 sm:h-3" />
              }
            >
              <Dropdown.Item className="w-28"><div
                onClick={() => {
                  router.push(router.asPath, router.asPath, { locale: 'en-US' });
                }}
              >English</div>
              </Dropdown.Item>
              <Dropdown.Item className="w-28"> <div
                onClick={() => {
                  router.push(router.asPath, router.asPath, { locale: 'de' });
                }}
              >German</div></Dropdown.Item>

            </Dropdown>
          </div>



          </Navbar.Collapse>
        </Navbar>


      </div>

    </>
  );
}