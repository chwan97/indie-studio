import { makeAutoObservable } from 'mobx'
import { message } from 'antd'

import MainStore from 'store'
import CustomerStore from 'store/page/CustomerStore'
import ImageLibStore from 'store/page/ImageLibStore'
import ModalMode from 'constantx/ModalMode'
import { TaskStatus } from 'constantx'

export default class AddStore {
  mainStore: MainStore

  customerStore: CustomerStore

  imageLibStore: ImageLibStore

  mode = ModalMode.add

  taskId?: string

  customer: {
    id: string
    name: string
    mail: string
    address: string
    contact: string
  } | null = null

  selectImageForModal: any[] = []

  selectCustomerForModal: any[] = []

  customerModalVisible = false

  imageModalVisible = false

  rawImageList: any[]

  imageList: any[] = []

  disable = false

  markSelectModalVisible = false

  get unselectedImages() {
    return this.imageList.filter(item => !item.selected)
  }

  get selectedImages() {
    return this.imageList.filter(item => item.selected)
  }

  constructor(mainStore: MainStore, customerStore: CustomerStore, imageLibStore: ImageLibStore) {
    this.mainStore = mainStore
    this.imageLibStore = imageLibStore
    this.imageLibStore.setPageSize(3)

    this.customerStore = customerStore
    this.customerStore.setPageSize(5)
    this.rawImageList = this.imageList
    makeAutoObservable(this)
  }

  init = async (id: string) => {
    this.taskId = id
    this.mode = ModalMode.edit
    console.log('init id', id)
  }

  toggleMarkSelectModal = (val: boolean) => {
    this.markSelectModalVisible = val
  }

  updateSelectedImage = (rows: any[]) => {
    this.imageList.forEach(item => {
      if (rows.some(it => it.id === item.id)) {
        item.selected = true
      }
    })
  }

  setSelectCustomerForModal = (rows: string[]) => {
    this.selectCustomerForModal = rows
  }

  setSelectImageForModal = (rows: string[]) => {
    this.selectImageForModal = rows
  }

  setDisable = (value: boolean) => {
    this.disable = value
  }

  changeCustomer = async () => {
    this.selectCustomerForModal = []
    this.customerModalVisible = true
    await this.customerStore.getTotal()
    this.customerStore.changePage(1)
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

  onModalCustomerCancel = async () => {
    this.customerModalVisible = false
  }

  onModalImageOk = async () => {
    if (this.selectImageForModal[0]) {
      const mergeImages = this.selectImageForModal.filter(item =>
        this.imageList.every(sImg => item.id !== sImg.id)
      )
      this.imageList = [...this.imageList, ...mergeImages]
      console.log('this.imageList', this.imageList)
      this.imageModalVisible = false
    } else {
      message.warning('选择至少一张图片！')
    }
  }

  onModalImageCancel = async () => {
    this.imageModalVisible = false
  }

  addImage = async () => {
    this.selectImageForModal = []
    this.imageModalVisible = true
    await this.imageLibStore.getTotal()
    this.imageLibStore.setExcludeIds(this.imageList.map(item => item.id))
    this.imageLibStore.changePage(1)
  }

  deleteImage = async (id: string) => {
    this.imageList = this.imageList.filter(item => item.id !== id)
  }

  deleteSelectedImage = async (id: string) => {
    this.imageList.some(item => {
      if (item.id === id) {
        item.selected = false
      }
    })
  }

  addSelectedImage = async () => {
    console.log('addSelectedImage', this.unselectedImages)
    if (!this.unselectedImages?.[0]) {
      message.info('已选图片没有可以添加的图片！')
      return
    }
    this.toggleMarkSelectModal(true)
  }

  submit = async () => {
    let msg
    if (!this.customer?.id) {
      msg = '请选择一个客户绑定选片任务'
    }
    if (!this.imageList?.[0]) {
      msg = '请选择一个至少一张图片绑定选片任务'
    }
    if (msg) {
      message.warning(msg)
      return
    }
    const supabase = this.mainStore.supabase
    const id = this.mainStore.userInfo?.id
    const customerId = this.customer?.id
    const disable = this.disable

    if (this.mode === ModalMode.add) {
      // 新建
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { owner: id, customer: customerId, status: TaskStatus.unBegin, disabled: disable },
        ])
      if (!error && data?.[0]) {
        const { id: taskId } = data?.[0]
        const { data: sData, error: sError } = await supabase
          .from('image_selected_task_join')
          .insert(
            this.imageList?.map(item => {
              return {
                image: item.id,
                task: taskId,
                selected: item.selected || false,
              }
            })
          )
        if (!sError) {
          this.mainStore.router?.push('/pick-task')
        } else {
          message.error(`选片任务图片关联失败，${sError?.message}`)
        }
      } else {
        message.error(`选片任务创建失败${error?.message}`)
      }
    } else {
      // 编辑
    }
  }
}
