import { Html, Head, Main, NextScript } from 'next/document'
import Document, { DocumentContext, DocumentInitialProps } from 'next/document'
import Script from 'next/script'
import { DefaultSeo } from "next-seo";

class MyDocument extends Document {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }
    // document with GTM tag.
    render() {
        return (
            <Html className="dark" lang="en">
                <Head>
                    {/* <!-- Google Tag Manager --> */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-W6NVS67'); `,
                        }}
                    />
                    {/* <!-- Dark mode fun --> */}
                    <script dangerouslySetInnerHTML={{
                        __html: `if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark')
                            }`,
                    }} />
                    <script type='text/javascript' src='/scripts/freshworks.js' />
                    <script type='text/javascript' src='https://widget.freshworks.com/widgets/151000001120.js' />
                    <link href="/lb2/css/lightbox.css" rel="stylesheet" />
                    {/* CONSENT THING */}
                    <script type="text/javascript" src="https://www.termsfeed.com/public/cookie-consent/4.0.0/cookie-consent.js"></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `document.addEventListener('DOMContentLoaded', function () {
                            cookieconsent.run({"notice_banner_type":"simple","consent_type":"implied","palette":"dark","language":"en","page_load_consent_levels":["strictly-necessary","functionality","tracking","targeting"],"notice_banner_reject_button_hide":false,"preferences_center_close_button_hide":false,"page_refresh_confirmation_buttons":false,"website_name":"Streets of Danzig"});
                            });
                        `}} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W6NVS67" height="0" width="0" style="display: none; visibility: hidden;" />`,
                        }}
                    />
                    <script type='text/javascript' src='/lb2/js/lightbox-plus-jquery.js' />
                </body>
            </Html>
        )
    }
}

export default MyDocument