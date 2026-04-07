'use client'
/**
 * Cookie consent banner
 */
import Script from 'next/script';

declare const cookieconsent: any;
export default function ConsentBanner({ locale }: { locale: string }) {
    return (
        <Script
            src="https://www.termsfeed.com/public/cookie-consent/4.1.0/cookie-consent.js"
            strategy="lazyOnload"
            onLoad={() => {
                if (typeof cookieconsent === 'undefined') return;
                const palette = (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)) ? "dark" : "light";
                cookieconsent.run({
                    "notice_banner_type": "simple",
                    "consent_type": "express",
                    "palette": palette,
                    "language": "en",
                    "page_load_consent_levels": ["strictly-necessary"],
                    "notice_banner_reject_button_hide": false,
                    "preferences_center_close_button_hide": false,
                    "page_refresh_confirmation_buttons": false
                });
            }}
        />
    );
}
