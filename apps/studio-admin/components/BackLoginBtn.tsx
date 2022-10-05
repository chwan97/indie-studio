import { css } from '@emotion/react'
import { Button } from 'antd'
import { useRouter } from 'next/router'

export default function BackLoginBtn() {
  const router = useRouter()

  return (
    <Button
      type="link"
      css={css`
        width: 100%;
      `}
      onClick={() => {
        router.replace('/login')
      }}
    >
      回到登录
    </Button>
  )
}
