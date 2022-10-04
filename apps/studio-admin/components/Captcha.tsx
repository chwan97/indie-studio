import { css } from '@emotion/react'
import { Form } from 'antd'
import { useEffect, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useMainStore } from '../hooks'

function WrapperForItem(props: any) {
  const { onChange } = props
  const mainStore = useMainStore()
  const captchaRef = useRef<HCaptcha>(null)

  useEffect(() => {
    mainStore.auth.setCaptchaRef(captchaRef.current)
  }, [captchaRef.current])
  return (
    <HCaptcha
      css={css`
        width: 325px;
      `}
      ref={captchaRef}
      sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string}
      languageOverride="zh-CN"
      size="compact"
      onVerify={(token, ekey) => {
        console.log(token, ekey)
        if (token) {
          onChange(token)
        }
      }}
    />
  )
}

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
        <WrapperForItem />
      </Form.Item>
    </div>
  )
}
