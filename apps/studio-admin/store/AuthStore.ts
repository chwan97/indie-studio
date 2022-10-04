import { makeAutoObservable } from 'mobx'
import { createClient } from '@supabase/supabase-js'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default class AuthStore {
  main: any

  captchaRef: HCaptcha | null = null

  constructor(main: any) {
    makeAutoObservable(this)
    this.main = main
  }

  login = async (email: string, password: string, captchaToken: string) => {
    const { user, session, error } = await supabase.auth.signIn(
      {
        email,
        password,
      },
      {
        captchaToken,
      }
    )
    console.log(user, session, error, 'user, session, error')
  }

  resetPassword = () => {}

  register = () => {}

  refreshCaptcha = () => {
    this.captchaRef?.resetCaptcha()
  }

  setCaptchaRef = (captchaRef: HCaptcha | null) => {
    this.captchaRef = captchaRef
  }
}
