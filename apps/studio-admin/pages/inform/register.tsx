import { Button } from 'antd'
import { css } from '@emotion/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Layout from 'components/AuthLayout'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'

function Register() {
  const router = useRouter()
  const [success, setSuccess] = useState(true)
  useEffect(() => {
    if (window.location.hash.indexOf('error_code') !== -1) {
      setSuccess(false)
    }
  }, [])
  return (
    <div
      css={css`
        margin-top: 40px;
        display: flex;
        justify-content: center;
      `}
    >
      <div
        css={css`
          width: 325px;
          text-align: center;
        `}
      >
        {success && <div>注册成功! 即将跳转到首页...</div>}
        {!success && <div>注册链接已经过期！</div>}

        <Button
          type="link"
          css={css`
            width: 100%;
          `}
          onClick={() => {
            if (success) {
              router.replace('/image-lib')
            } else {
              router.replace('/login')
            }
          }}
        >
          {success && '去首页'}
          {!success && '去登录'}
        </Button>
      </div>
    </div>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default observer(Register)
