'use client';

import { useState } from 'react';
import { IPost } from '../../../lib/contentmodel/wrappertypes';
import { I18N } from "../../../lib/i18n";
import { usePathname } from 'next/navigation'

type HeaderNaviProps = {
  currentPage?: string,
  navigationPosts: Partial<IPost>[],
  locale: string
}

export default function HeaderNavigationModule(props: HeaderNaviProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();

  const switchLocalePath = (newLocale: string) => {
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    return pathParts.join('/');
  };

  const i18n = new I18N(props.locale).getTranslator();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinkClass = (path: string) =>
    isActive(path)
      ? "text-primary font-bold border-b-2 border-primary pb-1 font-label transition-colors"
      : "text-on-surface/60 hover:text-primary font-label transition-colors";

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/10">
      <nav aria-label="Main navigation" className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <a
          href={`/${props.locale}`}
          className="text-2xl font-headline italic text-primary tracking-tighter hover:opacity-80 transition-opacity"
        >
          {i18n("homepage.title")}
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-8">
          <a href={`/${props.locale}/streets/all`} className={navLinkClass(`/${props.locale}/streets`)}>
            {i18n("nav.allstreets")}
          </a>
          <a href={`/${props.locale}/districts/all`} className={navLinkClass(`/${props.locale}/districts`)}>
            {i18n("nav.alldistricts")}
          </a>
          <a href={`/${props.locale}/search`} className={navLinkClass(`/${props.locale}/search`)}>
            {i18n("nav.search")}
          </a>
          {props.navigationPosts?.map(post => (
            <a
              key={post.fields?.slug}
              href={`/${props.locale}/posts/${post.fields?.slug}`}
              className={navLinkClass(`/${props.locale}/posts/${post.fields?.slug}`)}
            >
              {post.fields?.title}
            </a>
          ))}
        </div>

        {/* Right side: Language toggle + mobile menu */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              onBlur={() => setTimeout(() => setLangDropdownOpen(false), 150)}
              className="text-primary font-label font-bold text-sm tracking-widest hover:bg-surface-container-high/50 px-3 py-2 rounded transition-all"
              aria-label="Change language"
            >
              {props.locale === 'en' ? 'EN' : 'DE'}
              <svg className="w-2.5 h-2.5 ms-1.5 inline-block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-surface-container-lowest shadow-lg rounded-md py-2 z-50 min-w-[120px] border border-outline-variant/10">
                <a
                  href={switchLocalePath('en')}
                  className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  English
                </a>
                <a
                  href={switchLocalePath('de')}
                  className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Deutsch
                </a>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/10 px-8 py-6 space-y-4">
          <a href={`/${props.locale}`} className="block py-2 text-on-surface font-label hover:text-primary transition-colors">
            {i18n("nav.home") ?? 'Home'}
          </a>
          <a href={`/${props.locale}/streets/all`} className="block py-2 text-on-surface font-label hover:text-primary transition-colors">
            {i18n("nav.allstreets")}
          </a>
          <a href={`/${props.locale}/districts/all`} className="block py-2 text-on-surface font-label hover:text-primary transition-colors">
            {i18n("nav.alldistricts")}
          </a>
          <a href={`/${props.locale}/search`} className="block py-2 text-on-surface font-label hover:text-primary transition-colors">
            {i18n("nav.search")}
          </a>
          {props.navigationPosts?.map(post => (
            <a
              key={post.fields?.slug}
              href={`/${props.locale}/posts/${post.fields?.slug}`}
              className="block py-2 text-on-surface font-label hover:text-primary transition-colors"
            >
              {post.fields?.title}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
