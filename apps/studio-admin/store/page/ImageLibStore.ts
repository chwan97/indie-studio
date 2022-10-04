import { makeAutoObservable } from 'mobx'

export default class ImageLibStore {
  constructor(main: any) {
    makeAutoObservable(this)
  }
}
