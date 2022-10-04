import { makeAutoObservable } from 'mobx'

export default class ImageLibStore {
  addModalVisible = false

  constructor() {
    makeAutoObservable(this)
  }

  toggleAddModalVisible = (visible: boolean) => {
    this.addModalVisible = visible
  }
}