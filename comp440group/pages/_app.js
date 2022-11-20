import { Provider } from 'next-auth/client'
import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'

import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import NextNprogress from 'nextjs-progressbar'

// Client-side cache, shared for the whole session of the user in the browser.

export default function MyApp(props) {
  const { Component, pageProps } = props

  // React.useEffect(() => {
  //   // Remove the server-side injected CSS.
  //   const jssStyles = document.querySelector('#jss-server-side')
  //   if (jssStyles) {
  //     jssStyles.parentElement.removeChild(jssStyles)
  //   }
  // }, [])

  return (
    <>
      <Head>
        {/* <meta name="viewport" content="initial-scale=1, width=device-width" /> */}
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Pacifico|Raleway:100,400,400i,700|Roboto:300,400,500,700&display=swap"
        /> */}
      </Head>
      <Provider session={pageProps.session}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <NextNprogress options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}

// import { SessionProvider } from 'next-auth/react'
// import NextNprogress from 'nextjs-progressbar'
// import Head from 'next/head'

// function MyApp(props) {
//   const {
//     Component,
//     pageProps: { session, ...pageProps },
//   } = props
//   return (
//     <SessionProvider
//       session={session}
//       refetchInterval={5 * 60}
//       refetchOnWindowFocus
//     >
//       <Head />
//       <NextNprogress options={{ showSpinner: false }} />
//       <Component {...pageProps} />
//     </SessionProvider>
//   )
// }

// export default MyApp
