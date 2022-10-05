import { makeAutoObservable } from 'mobx'
import { createClient } from '@supabase/supabase-js'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { message } from 'antd'
import { getErrorTips } from 'utils'
import Main from './index'
import { AuthError } from 'errors'

export default class AuthStore {
  main: Main

  captchaRef: HCaptcha | null = null

  constructor(main: Main) {
    makeAutoObservable(this)
    this.main = main
  }

  login = async (email: string, password: string, captchaToken: string) => {
    const { user, session, error } = await this.main.supabase.auth.signIn(
      {
        email,
        password,
      },
      {
        captchaToken,
      }
    )
    console.log(user, session, error, 'user, session, error')
    if (error && error.message) {
      this.refreshCaptcha()
      throw new AuthError(getErrorTips(error.message))
    }
  }

  loginFake = async () => {
    this.refreshCaptcha()
    message.error('dsadsa')
  }
  resetPassword = () => {}

  register = async (email: string, password: string, captchaToken: string) => {
    const { user, session, error } = await this.main.supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        captchaToken,
      }
    )
    console.log(user, session, error, 'user, session, error')
    if (error && error.message) {
      message.error(getErrorTips(error.message))
      this.refreshCaptcha()
    } else {
      // this.main.router?.push('/image-lib')
    }
  }

  refreshCaptcha = () => {
    this.captchaRef?.resetCaptcha()
  }

  setCaptchaRef = (captchaRef: HCaptcha | null) => {
    this.captchaRef = captchaRef
  }
}
