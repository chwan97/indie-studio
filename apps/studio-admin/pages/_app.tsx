import React, { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import Head from 'next/head'

import 'styles/main.less'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <>
      <Head>
        <title>Indie Studio</title>
        <meta name="robots" content="follow, index" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link href="/favicon.ico" />
      </Head>
      <ConfigProvider locale={locale}>{getLayout(<Component {...pageProps} />)}</ConfigProvider>
    </>
  )
}
