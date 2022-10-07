import { makeAutoObservable } from 'mobx'
import { message } from 'antd'
import { FormInstance } from 'antd/lib/form/hooks/useForm'

import MainStore from '../index'
import { AuthError } from 'errors'

export default class ImageLibStore {
  form: FormInstance<any> | null = null

  mainStore: MainStore

  btnLoading = false

  constructor(mainStore: MainStore) {
    makeAutoObservable(this)
    this.mainStore = mainStore
  }

  setForm = (form: FormInstance<any>) => {
    this.form = form
  }

  checkIfLogin = () => {
    if (this.mainStore?.userInfo?.id) {
      this.mainStore.router?.push('/image-lib')
    }
  }

  login = async () => {
    this.btnLoading = true
    try {
      const values = await this.form?.validateFields()
      const { mail, password, captcha } = values
      console.log('login before', mail, password, captcha)
      await this.mainStore.auth.login(mail, password, captcha)
    } catch (e: any) {
      if (e instanceof AuthError) {
        console.log('e!.message', e!.message)
        message.error('账号密码错误')
        this.form?.resetFields(['captcha'])
      }
    } finally {
      this.btnLoading = false
    }
  }
}
