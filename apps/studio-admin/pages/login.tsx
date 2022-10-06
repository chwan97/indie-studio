import React, { ReactElement, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { observer, useLocalObservable } from 'mobx-react'

import Captcha from 'components/Captcha'
import Layout from 'components/AuthLayout'
import LoginStore from 'store/page/LoginStore'
import { useMainStore } from 'hooks'

function Login() {
  const router = useRouter()
  const mainStore = useMainStore()
  const [form] = Form.useForm()
  const loginStore = useLocalObservable(() => new LoginStore(mainStore))
  useEffect(() => {
    loginStore.setForm(form)
  }, [form])

  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div
      css={css`
        margin-top: 40px;
        display: flex;
        justify-content: center;
      `}
    >
      <Form
        name="login"
        form={form}
        autoComplete="off"
        css={css`
          width: 325px;
        `}
      >
        <Form.Item
          label="邮箱"
          name="mail"
          rules={[
            { required: true, message: '请输入你的邮箱！' },
            {
              type: 'email',
              message: '请输入合法的邮箱',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入你的密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Captcha />

        <div
          css={css`
            text-align: center;
          `}
        >
          <Form.Item>
            <Button
              type="primary"
              css={css`
                width: 100%;
                margin-top: 24px;
              `}
              onClick={loginStore.login}
              loading={loginStore.btnLoading}
            >
              登录
            </Button>
          </Form.Item>

          <Button
            type="link"
            css={css`
              width: 100%;
            `}
            onClick={() => {
              router.replace('/reset-password')
            }}
          >
            忘记密码?
          </Button>
          <Button
            type="link"
            css={css`
              width: 100%;
            `}
            onClick={() => {
              router.replace('/register')
            }}
          >
            还没有账号？点击注册
          </Button>
        </div>
      </Form>
    </div>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Login)
