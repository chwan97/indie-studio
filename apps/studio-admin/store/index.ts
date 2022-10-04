import { makeAutoObservable } from 'mobx'

import DisplayStore from './DisplayStore'
import AuthStore from './AuthStore'

export default class Index {
  display: DisplayStore

  auth: AuthStore

  constructor() {
    makeAutoObservable(this)
    this.display = new DisplayStore(this)
    this.auth = new AuthStore(this)
  }
}
