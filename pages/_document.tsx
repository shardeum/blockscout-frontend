import { ColorModeScript } from '@chakra-ui/react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import logRequestFromBot from 'nextjs/utils/logRequestFromBot';
import * as serverTiming from 'nextjs/utils/serverTiming';

import config from 'configs/app';
import theme from 'theme/theme';
import * as svgSprite from 'ui/shared/IconSvg';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = async() => {
      const start = Date.now();
      const result = await originalRenderPage();
      const end = Date.now();

      serverTiming.appendValue(ctx.res, 'renderPage', end - start);

      return result;
    };

    await logRequestFromBot(ctx.req, ctx.res, ctx.pathname);

    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          { /* Google Tag Manager */ }
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N6NTB5C');`,
            }}
          />
          { /* End Google Tag Manager */ }

          { /* FONTS */ }
          <link
            href={ config.UI.fonts.heading?.url ?? 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' }
            rel="stylesheet"
          />
          <link
            href={ config.UI.fonts.body?.url ?? 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
            rel="stylesheet"
          />

          { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
          <script src="/assets/envs.js"/>

          { /* FAVICON */ }
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon/favicon-48x48.png"/>
          <link rel="shortcut icon" href="/assets/favicon/favicon.ico"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon/android-chrome-192x192.png"/>
          <link rel="preload" as="image" href={ svgSprite.href }/>
        </Head>
        <body>
          { /* Google Tag Manager (noscript) */ }
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-N6NTB5C"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          { /* End Google Tag Manager (noscript) */ }
          <ColorModeScript initialColorMode={ theme.config.initialColorMode }/>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
