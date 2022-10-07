import { makeAutoObservable } from 'mobx'
import Main from './index'

export default class DisplayStore {
  main: Main

  loading = false

  constructor(main: Main) {
    makeAutoObservable(this)
    this.main = main
  }

  setLoading = (val: boolean) => {
    this.loading = val
  }
}
