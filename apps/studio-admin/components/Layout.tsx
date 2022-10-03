import Head from 'next/head'
import { useRouter } from 'next/router'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const router = useRouter()

  return (
    <>
      <main>{children}</main>
    </>
  )
}
