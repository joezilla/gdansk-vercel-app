'use client'
/**
 * Cookie consent banner
 */
import { useEffect } from 'react';
import Script from 'next/script';

declare const cookieconsent: {
    run: (config: Record<string, unknown>) => void;
};

type ConsentBannerProps = {
    locale: 'en' | 'de';
}

export default function ConsentBanner({ locale }: ConsentBannerProps) {
    useEffect(() => {
        const runCookieConsent = () => {
            const palette = (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches)) ? "dark" : "light";
            cookieconsent.run({
                "notice_banner_type": "simple",
                "consent_type": "express",
                "palette": palette,
                "language": locale,
                "page_load_consent_levels": ["strictly-necessary"],
                "notice_banner_reject_button_hide": false,
                "preferences_center_close_button_hide": false,
                "page_refresh_confirmation_buttons": false
            });
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCookieConsent);
} else {
    if (!window.cookieConsentRun) {
        runCookieConsent();
        window.cookieConsentRun = true;
    }
}
return () => {
    document.removeEventListener('DOMContentLoaded', runCookieConsent);
};
    }, [locale]);
return (<><Script src="https://www.termsfeed.com/public/cookie-consent/4.1.0/cookie-consent.js" strategy="beforeInteractive" /></>);
}
