import { Button, Form, Input } from 'antd'
import { css } from '@emotion/react'
import BackLoginBtn from '../components/BackLoginBtn'
import Captcha from '../components/Captcha'
import React, { ReactElement, useEffect } from 'react'
import Layout from '../components/AuthLayout'
import { useMainStore } from '../hooks'
import { observer, useLocalObservable } from 'mobx-react'
import RegisterStore from 'store/page/RegisterStore'
import PasswordField from '../components/PasswordField'
import { useRouter } from 'next/router'

function Register() {
  const mainStore = useMainStore()
  const [form] = Form.useForm()
  const router = useRouter()
  const registerStore = useLocalObservable(() => new RegisterStore(mainStore))
  useEffect(() => {
    registerStore.setForm(form)
  }, [form])
  if (registerStore.registerOK) {
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
          注册成功, 登录邮箱[{form.getFieldValue('mail')}]<br />
          查看收信箱注册邮件,点击邮件内链接激活登录!
        </div>
      </div>
    )
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
        form={form}
        name="register"
        initialValues={{ remember: true }}
        autoComplete="off"
        css={css`
          width: 325px;
        `}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入名称用于显示！' },
            {
              type: 'string',
            },
            {
              max: 7,
            },
          ]}
        >
          <Input />
        </Form.Item>
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
        <PasswordField />
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
