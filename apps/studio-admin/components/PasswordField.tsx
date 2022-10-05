import { css } from '@emotion/react'
import { Form, Input } from 'antd'
import React from 'react'

export default function PasswordField(props: { forModal?: boolean }) {
  const { forModal = false } = props
  return (
    <>
      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入你的密码' },
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.resolve()
              }
              if (value.length >= 8 && value.length <= 20 && /^[a-zA-Z0-9]+$/.test(value)) {
                return Promise.resolve()
              }

              return Promise.reject(new Error('密码需要在8到20位之间，只包括数字和字母'))
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        css={
          !forModal
            ? css`
                position: relative;
                left: -28px;
                width: 353px;
              `
            : css``
        }
        label="密码确认"
        name="rePassword"
        rules={[
          { required: true, message: '请再次输入你的密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次密码输入不一致'))
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </>
  )
}
