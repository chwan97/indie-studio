import { makeAutoObservable } from 'mobx'

export default class DisplayStore {
  main: any

  constructor(main: any) {
    makeAutoObservable(this)
    this.main = main
  }
}
