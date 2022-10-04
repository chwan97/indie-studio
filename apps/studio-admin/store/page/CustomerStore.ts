import { makeAutoObservable } from 'mobx'

export default class CustomerStore {
  addModalVisible = false

  constructor() {
    makeAutoObservable(this)
  }

  toggleAddModalVisible = (visible: boolean) => {
    this.addModalVisible = visible
  }
}
