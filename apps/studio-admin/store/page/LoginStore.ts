import { makeAutoObservable } from 'mobx'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import MainStore from '../index'
import { Callbacks } from 'rc-field-form/lib/interface'
import { message } from 'antd'
import { getErrorTips } from 'utils'
import { AuthError } from '../../errors'

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

  login = async () => {
    this.btnLoading = true
    try {
      const values = await this.form?.validateFields()
      const { mail, password, captcha } = values
      console.log('login before', mail, password, captcha)
      await this.mainStore.auth.login(mail, password, captcha)
    } catch (e: any) {
      if (e instanceof AuthError) {
        message.error(e!.message as string)
        this.form?.resetFields(['captcha'])
      }
    } finally {
      this.btnLoading = false
    }
  }
}
