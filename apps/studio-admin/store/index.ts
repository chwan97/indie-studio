import { makeAutoObservable } from 'mobx'

import DisplayStore from './DisplayStore'
import AuthStore from './AuthStore'
import { NextRouter } from 'next/dist/client/router'

export default class Index {
  display: DisplayStore

  auth: AuthStore

  router: NextRouter | null = null

  constructor() {
    makeAutoObservable(this)
    this.display = new DisplayStore(this)
    this.auth = new AuthStore(this)
  }

  setRouter = (router: NextRouter) => {
    this.router = router
  }
}
