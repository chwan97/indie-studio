import { makeAutoObservable } from 'mobx'
import Main from './index'

export default class DisplayStore {
  main: Main

  constructor(main: Main) {
    makeAutoObservable(this)
    this.main = main
  }
}
