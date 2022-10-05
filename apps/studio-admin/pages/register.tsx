import { createClient } from '@supabase/supabase-js'
import styles from 'styles/login.module.css'
import { Button, Checkbox, Form, Input } from 'antd'
import { css } from '@emotion/react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import Brand from '../components/Brand'
import BackLoginBtn from '../components/BackLoginBtn'
import Captcha from '../components/Captcha'
import React, { ReactElement, useEffect } from 'react'
import Layout from '../components/AuthLayout'
import { useMainStore } from '../hooks'
import { observer, useLocalObservable } from 'mobx-react'
import RegisterStore from 'store/page/RegisterStore'

function Register() {
  const mainStore = useMainStore()
  const [form] = Form.useForm()
  const registerStore = useLocalObservable(() => new RegisterStore(mainStore))
  useEffect(() => {
    registerStore.setForm(form)
  }, [form])

  return (
    <div
      css={css`
        margin-top: 40px;
        display: flex;
        justify-content: center;
      `}
    >
      <Form
        form={form}
        name="register"
        initialValues={{ remember: true }}
        autoComplete="off"
        css={css`
          width: 325px;
        `}
      >
        <Form.Item
          label="邮箱"
          name="mail"
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
        <Form.Item
          css={css`
            position: relative;
            left: -28px;
            width: 353px;
          `}
          label="密码确认"
          name="rePassword"
          rules={[{ required: true, message: '请再次输入你的密码' }]}
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
              loading={registerStore.btnLoading}
              onClick={registerStore.register}
            >
              注册
            </Button>
          </Form.Item>
          <BackLoginBtn />
        </div>
      </Form>
    </div>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default observer(Register)
