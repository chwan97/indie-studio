import React, { ReactElement, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { css } from '@emotion/react'

import BackLoginBtn from 'components/BackLoginBtn'
import Captcha from 'components/Captcha'
import Layout from 'components/AuthLayout'
import { useMainStore } from 'hooks'
import { useRouter } from 'next/router'

export default function ResetPassword() {
  const mainStore = useMainStore()
  const [form] = Form.useForm()
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  if (success) {
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
          重置成功, 登录邮箱[{form.getFieldValue('mail')}]<br />
          查看收信箱重置邮件,点击邮件内链接重设密码!
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
        name="basic"
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
        <Captcha />
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
              onClick={async () => {
                try {
                  const { mail, captcha } = await form.validateFields()
                  await mainStore.auth.resetPassword(mail, captcha)
                  setSuccess(true)
                } catch (e) {
                  message.error('字段格式错误或者系统内部错误，请求失败！')
                  return
                }
              }}
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
