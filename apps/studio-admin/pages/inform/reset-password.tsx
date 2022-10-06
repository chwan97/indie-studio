import { Button, Form, Input, message } from 'antd'
import { css } from '@emotion/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Layout from 'components/AuthLayout'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import PasswordField from 'components/PasswordField'
import { useMainStore } from 'hooks'

function Register() {
  const router = useRouter()
  const [passwordForm] = Form.useForm()
  const mainStore = useMainStore()
  const [success, setSuccess] = useState(true)
  useEffect(() => {
    if (window.location.hash.indexOf('error_code') !== -1) {
      setSuccess(false)
    }
  }, [])
  let content = (
    <Form
      css={css`
        width: 325px;
      `}
      form={passwordForm}
      name="passwordForm"
      requiredMark={false}
      onFinish={() => {}}
    >
      <Form.Item label="当前邮箱" rules={[{ required: true }]}>
        {mainStore.userInfo?.email || '获取失败'}
      </Form.Item>
      <PasswordField />
      <Form.Item>
        <Button
          type="primary"
          css={css`
            width: 100%;
            margin-top: 24px;
          `}
          onClick={async () => {
            try {
              const { password } = await passwordForm.validateFields()
              await mainStore.auth.updatePassword(password)
              message.info('密码更新成功！')
              router.replace('/image-lib')
            } catch (e) {
              message.error('字段格式错误或者系统内部错误，请求失败！')
              return
            }
          }}
        >
          更改为新的密码
        </Button>
      </Form.Item>
    </Form>
  )
  if (!success) {
    content = (
      <div
        css={css`
          width: 325px;
          text-align: center;
        `}
      >
        密码重置链接已经过期！
        <Button
          type="link"
          css={css`
            width: 100%;
          `}
          onClick={() => {
            router.replace('/login')
          }}
        >
          去登录
        </Button>
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
      {content}
    </div>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default observer(Register)
