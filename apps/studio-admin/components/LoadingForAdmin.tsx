import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { Spin } from 'antd'

export default function LoadingForAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const ref = useRef<null | number>(null)

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        ref.current = window.setTimeout(() => {
          setLoading(true)
        }, 500)
      }
    }
    const handleComplete = (url: string) => {
      if (ref.current) {
        window.clearTimeout(ref.current)
        ref.current = null
      }
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  if (loading)
    return (
      <div
        css={css`
          position: absolute;
          z-index: 100;
          width: 100%;
          height: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
        `}
      >
        <Spin size="large" />
      </div>
    )
  return null
}
