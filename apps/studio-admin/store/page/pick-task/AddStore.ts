import { makeAutoObservable } from 'mobx'

import MainStore from 'store'
import CustomerStore from 'store/page/CustomerStore'
import { message } from 'antd'

export default class AddStore {
  mainStore: MainStore

  customerStore: CustomerStore

  customer = {
    id: 'fde340d4-1cce-406a-9dc6-ac0eb10d8d28',
    name: '万物复苏',
    mail: '839821646@cw.com',
    address: '和对手斯卡湿湿的和对手斯卡湿湿的和对手斯卡湿湿的和对手斯卡湿湿的',
    contact: '287317245（wx）',
  }

  selectCustomerForModal: any[] = []

  customerModalVisible = false

  rawImageList: any[]

  imageList = [
    {
      id: 'fde340d4-1cce-406a-9dc6-ac0eb10d8d28d',
      src: 'https://img1.doubanio.com/dae/niffler/niffler/images/33ecc2ae-17c2-11ed-a6d2-cac96ed0deb7.png',
      selected: false,
    },
    {
      id: 'fde340d4-1cce-406a-9dc6-ac0eb10d8dd28',
      src: 'https://img1.doubanio.com/dae/niffler/niffler/images/33ecc2ae-17c2-11ed-a6d2-cac96ed0deb7.png',
      selected: false,
    },
    {
      id: 'fde340d4-1cce-406a-9dc6-dac0eb10dd8d28',
      src: 'https://img1.doubanio.com/dae/niffler/niffler/images/33ecc2ae-17c2-11ed-a6d2-cac96ed0deb7.png',
      selected: false,
    },
    {
      id: 'fde340d4-1cce-406a-9dc6-adc0eb10d8d28',
      src: 'https://img1.doubanio.com/dae/niffler/niffler/images/33ecc2ae-17c2-11ed-a6d2-cac96ed0deb7.png',
      selected: true,
    },
  ]

  get unselectedImages() {
    return this.imageList.filter(item => !item.selected)
  }

  get selectedImages() {
    return this.imageList.filter(item => item.selected)
  }

  disable = false

  constructor(mainStore: MainStore, customerStore: CustomerStore) {
    this.mainStore = mainStore
    this.customerStore = customerStore
    this.customerStore.setPageSize(5)
    this.rawImageList = this.imageList
    makeAutoObservable(this)
  }

  init = async () => {
    this.customerStore.getTotal()
    this.customerStore.changePage(1)
  }

  setSelectCustomerForModal = (rows: string[]) => {
    this.selectCustomerForModal = rows
  }

  setDisable = (value: boolean) => {
    this.disable = value
  }

  changeCustomer = async () => {
    await this.customerStore.getTotal()
    this.customerStore.changePage(1)
    this.selectCustomerForModal = []
    this.customerModalVisible = true
  }

  onModalCustomerCancel = async () => {
    this.customerModalVisible = false
  }

  onModalCustomerOk = async () => {
    if (this.selectCustomerForModal[0]) {
      const { id, name, mail, address, contact } = this.selectCustomerForModal[0]
      this.customer = {
        id,
        name,
        mail,
        address,
        contact,
      }
      this.customerModalVisible = false
    } else {
      message.warning('选择一个与选片任务关联的客户！')
    }
  }

  addImage = async () => {}

  deleteImage = async (id: string) => {
    this.imageList = this.imageList.filter(item => item.id !== id)
  }

  deleteSelectedImage = async (id: string) => {}

  addSelectedImage = async () => {}
}
