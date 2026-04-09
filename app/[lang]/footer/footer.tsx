'use client';

import { DarkmodeToggle } from '../navigation/darkmodeToggle'
import { usePathname } from 'next/navigation'
import { I18N } from '../../../lib/i18n';

type FooterProps = {
  locale: string
}

export default function Footer(props: FooterProps) {
  const pathname = usePathname();
  const switchLocalePath = (newLocale: string) => {
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    return pathParts.join('/');
  };
  const i18n = new I18N(props.locale).getTranslator();

  return (
    <footer className="bg-surface-container-high mt-auto py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-screen-2xl mx-auto">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className="text-xl font-headline italic text-on-surface">
            {i18n("homepage.title")}
          </div>
          <p className="text-on-surface/50 text-sm leading-relaxed max-w-xs">
            {i18n("homepage.description")}
          </p>
          <div className="flex items-center gap-4">
            <DarkmodeToggle />
            <a
              rel="noopener noreferrer"
              href="https://github.com/joezilla/gdansk-vercel-app"
              className="text-on-surface/40 hover:text-on-surface/70 transition-colors"
              aria-label="Source on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Links */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-primary font-label font-bold text-xs uppercase tracking-widest mb-2">
              Explore
            </h4>
            <a href={`/${props.locale}/streets/all`} className="text-on-surface/50 hover:text-on-surface hover:translate-x-1 transition-all duration-200 text-sm">
              {i18n("nav.allstreets")}
            </a>
            <a href={`/${props.locale}/districts/all`} className="text-on-surface/50 hover:text-on-surface hover:translate-x-1 transition-all duration-200 text-sm">
              {i18n("nav.alldistricts")}
            </a>
            <a href={`/${props.locale}/search`} className="text-on-surface/50 hover:text-on-surface hover:translate-x-1 transition-all duration-200 text-sm">
              {i18n("nav.search")}
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-primary font-label font-bold text-xs uppercase tracking-widest mb-2">
              Project
            </h4>
            <a href="#" id="open_preferences_center" className="text-on-surface/50 hover:text-on-surface hover:translate-x-1 transition-all duration-200 text-sm">
              Cookie Preferences
            </a>
          </div>
        </nav>

        {/* Column 3: Language + Copyright */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-primary font-label font-bold text-xs uppercase tracking-widest">
              Language
            </h4>
            <div className="flex gap-4">
              <a
                href={switchLocalePath('en')}
                className={`text-sm transition-colors ${props.locale === 'en' ? 'text-on-surface font-bold' : 'text-on-surface/50 hover:text-on-surface'}`}
              >
                English
              </a>
              <a
                href={switchLocalePath('de')}
                className={`text-sm transition-colors ${props.locale === 'de' ? 'text-on-surface font-bold' : 'text-on-surface/50 hover:text-on-surface'}`}
              >
                Deutsch
              </a>
            </div>
          </div>
          <p className="mt-8 text-on-surface/30 text-xs font-label">
            &copy; {new Date().getFullYear()} {i18n("homepage.title")}. An Archival Project.
          </p>
        </div>
      </div>
    </footer>
  )
}
