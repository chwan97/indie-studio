import { makeAutoObservable } from 'mobx'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { message } from 'antd'
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
      throw new AuthError(error.message)
    }
  }

  logout = async () => {
    const { error } = await this.main.supabase.auth.signOut()
    if (error) {
      message.info('出现错误，退出登录失败')
      return
    }
    this.main.userInfo = null
    message.info('退出登录成功')
  }

  resetPassword = async (email: string, captchaToken: string) => {
    const location = document.location
    const { protocol, host } = location

    const { error } = await this.main.supabase.auth.api.resetPasswordForEmail(email, {
      captchaToken,
    })
    console.log(error, 'error')
    if (error) {
      message.error('字段格式错误或者系统内部错误，请求失败！')
      this.refreshCaptcha()
    }
  }

  updatePassword = async (password: string) => {
    const { error } = await this.main.supabase.auth.update({
      password,
    })
    console.log(error, 'error')
    if (error) {
      throw new AuthError()
    }
  }
  // redirectTo: `${protocol}${host}${port}/inform/register`,
  register = async (email: string, password: string, captchaToken: string, name: string) => {
    const { user, session, error } = await this.main.supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        captchaToken,
        data: {
          name: name,
          signFor: 'admin',
        },
      }
    )
    console.log(user, session, error, 'user, session, error')
    if (error) {
      message.error('字段格式错误或者系统内部错误，请求失败！')
      this.refreshCaptcha()
    }
  }

  refreshCaptcha = () => {
    this.captchaRef?.resetCaptcha()
  }

  setCaptchaRef = (captchaRef: HCaptcha | null) => {
    this.captchaRef = captchaRef
  }
}
