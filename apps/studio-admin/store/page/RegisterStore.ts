import { makeAutoObservable } from 'mobx'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import MainStore from '../index'
import { Callbacks } from 'rc-field-form/lib/interface'

export default class ImageLibStore {
  form: FormInstance<any> | null = null

  mainStore: MainStore

  btnLoading = false

  registerOK = false

  constructor(mainStore: MainStore) {
    makeAutoObservable(this)
    this.mainStore = mainStore
  }

  setForm = (form: FormInstance<any>) => {
    this.form = form
  }

  register = async () => {
    this.btnLoading = true
    try {
      const values = await this.form?.validateFields()
      const { name, mail, password, captcha } = values
      console.log('register before', mail, password, captcha)
      await this.mainStore.auth.register(mail, password, captcha, name)
      this.registerOK = true
    } catch (e) {
    } finally {
      this.btnLoading = false
    }
    // this.mainStore.auth.login(username, password, captcha)

    // console.log('values', values)
    // console.log('mainStore.auth', this.mainStore.auth)
    // const { captcha, password, username } = values
    // this.mainStore.auth.login(username, password, captcha)
    // this.mainStore.auth.loginFake()
  }
}
