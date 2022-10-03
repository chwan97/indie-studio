import { css } from '@emotion/react'
import { Form } from 'antd'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function Captcha(props: { onVerify: (token: string, ekey: string) => any }) {
  const { onVerify } = props

  return (
    <div
      css={css`
        height: 150px;
        position: relative;
        left: -14px;
      `}
    >
      <Form.Item
        label="验证码"
        name="captcha"
        rules={[{ required: true, message: '请完成验证码' }]}
      >
        <HCaptcha
          css={css`
            width: 325px;
          `}
          // sitekey="693470fb-ef3b-400c-8e7f-f1c8a805ede6"
          sitekey="your_site_key"
          languageOverride="zh-CN"
          size="compact"
          onVerify={onVerify}
        />
      </Form.Item>
    </div>
  )
}
