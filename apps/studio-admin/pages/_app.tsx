import React, { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import StoreContext from 'context/StoreContext'
import MainStore from 'store/index'

import 'normalize.css'
import 'styles/main.less'
import SetRouter from '../components/SetRouter'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)
  const mainStore = useLocalObservable(() => new MainStore())

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
      <StoreContext.Provider value={mainStore}>
        <ConfigProvider locale={locale}>{getLayout(<Component {...pageProps} />)}</ConfigProvider>
        <SetRouter />
      </StoreContext.Provider>
    </>
  )
}

export default observer(App)
