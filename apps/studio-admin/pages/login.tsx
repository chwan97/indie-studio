import { createClient } from '@supabase/supabase-js'
import styles from 'styles/login.module.css'
import { Button, Checkbox, Form, Input } from 'antd'
import { css } from '@emotion/react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default function login() {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div
      css={css`
        margin: 0 auto;
        padding: 150px 0;
        user-select: none;
      `}
    >
      <div
        css={css`
          font-size: 25px;
          text-align: center;
          margin-bottom: 30px;
        `}
      >
        <img
          css={css`
            width: 70px;
          `}
          src="/favicon.png"
        />
        <div>Indie Studio</div>
      </div>
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

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入你的密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <div
            css={css`
              text-align: center;
              margin-top: 35px;
            `}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                css={css`
                  width: 100%;
                `}
              >
                登录
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <h1>login</h1>
      <button onClick={() => {}}>注册</button>
      <button onClick={() => {}}>登录</button>
      <button onClick={() => {}}>登出</button>
      <button onClick={() => {}}>登录</button>
    </div>
  )
}
