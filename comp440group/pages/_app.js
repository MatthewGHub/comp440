import { SessionProvider } from 'next-auth/react'
import NextNprogress from 'nextjs-progressbar'
import Head from 'next/head'

function MyApp(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus
    >
      <Head />
      <NextNprogress options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
