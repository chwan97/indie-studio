import { createClient } from '@supabase/supabase-js'
import React, { ReactElement } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { css } from '@emotion/react'

import BackLoginBtn from 'components/BackLoginBtn'
import Captcha from 'components/Captcha'
import Layout from 'components/AuthLayout'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default function ResetPassword() {
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
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        css={css`
          width: 325px;
        `}
      >
        <Form.Item
          label="邮箱"
          name="username"
          rules={[{ required: true, message: '请输入你的邮箱！' }]}
        >
          <Input />
        </Form.Item>
        <Captcha
          onVerify={(token, ekey) => {
            console.log(token, ekey)
          }}
        />
        <div
          css={css`
            text-align: center;
          `}
        >
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              css={css`
                width: 100%;
                margin-top: 24px;
              `}
            >
              发送重置邮件
            </Button>
          </Form.Item>
          <BackLoginBtn />
        </div>
      </Form>
    </div>
  )
}

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
