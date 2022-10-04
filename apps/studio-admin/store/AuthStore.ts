import { makeAutoObservable } from 'mobx'

export default class AuthStore {
  main: any

  constructor(main: any) {
    makeAutoObservable(this)
    this.main = main
  }
}
