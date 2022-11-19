// Copyright © 2022 Matthew Gerard Chalifoux <mgchalifoux@gmail.com> All rights reserved.

/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
// import { ServerStyleSheets } from '@material-ui/core/styles'
import { ServerStyleSheets } from '@mui/styles'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Pacifico|Raleway:100,400,400i,700|Roboto:300,400,500,700|Dosis:wght@300&display=swap"
          />
          {/* not sure what this content is for */}
          {/* <meta name="primary" content={theme.palette.primary.main} /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}
