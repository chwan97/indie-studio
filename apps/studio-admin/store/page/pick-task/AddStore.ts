import { makeAutoObservable } from 'mobx'
import { message } from 'antd'

import MainStore from 'store'
import cloneDeep from 'lodash/cloneDeep'
import CustomerStore from 'store/page/CustomerStore'
import ImageLibStore from 'store/page/ImageLibStore'
import ModalMode from 'constantx/ModalMode'
import { TaskStatus } from 'constantx'

export default class AddStore {
  mainStore: MainStore

  customerStore: CustomerStore

  imageLibStore: ImageLibStore

  mode = ModalMode.add

  initSuccess = false

  taskId?: string

  initImageList?: any

  submitBtnLoading = false

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

  loading = false

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
    if (id) {
      this.taskId = id
      this.mode = ModalMode.edit
      await this.pullTaskDetail()
    } else {
      this.mode = ModalMode.add
    }
  }

  pullTaskDetail = async () => {
    this.mainStore.display.loading = true
    try {
      this.loading = true
      const supabase = this.mainStore.supabase
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
        id, disabled, created_at, status,
        task_image(id, selected, images (*)),
        customer(id, name, mail, address, contact, created_at)
        `
        )
        .eq('id', this.taskId)
        .eq('deleted', false)
      console.log('data, error', data, error)
      if (error || !data?.[0]) {
        message.error('任务详情获取失败.')
      } else {
        this.initSuccess = true
        await this.dealData(data?.[0])
      }
    } finally {
      this.mainStore.display.loading = false
    }
  }

  dealData = async (data: any) => {
    const { customer, task_image, disable } = data
    this.customer = customer
    this.disable = disable

    this.imageList = task_image.map((item: any) => {
      const { id, selected, images } = item
      return {
        ...images,
        selected,
        joinId: id,
      }
    })

    this.initImageList = cloneDeep(this.imageList)
    console.log('this.initImageList', this.initImageList)
    await this.getSignUrl()
  }

  getSignUrl = async () => {
    const keys = this.imageList.map(item => item.src)
    const supabase = this.mainStore.supabase

    const { data, error } = await supabase.storage.from('image-library').createSignedUrls(keys, 300)
    console.log('data', data)
    if (data && !error) {
      this.imageList.forEach((item, index) => {
        item.src = data[index].signedURL
      })
    }
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
    this.submitBtnLoading = true
    if (this.mode === ModalMode.add) {
      // 新建
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { owner: id, customer: customerId, status: TaskStatus.unBegin, disabled: disable },
        ])
      if (!error && data?.[0]) {
        const { id: taskId } = data?.[0]
        const { data: sData, error: sError } = await supabase.from('task_image').insert(
          this.imageList?.map(item => {
            return {
              image_id: item.id,
              task_id: taskId,
              selected: item.selected || false,
            }
          })
        )
        if (!sError) {
          this.mainStore.router?.replace('/pick-task')
        } else {
          message.error(`选片任务图片关联失败，${sError?.message}`)
        }
      } else {
        message.error(`选片任务创建失败${error?.message}`)
      }
    } else {
      // 编辑
      if (!this.initSuccess || !this.taskId) {
        message.warning('任务详情初始化失败无法提交编辑结果')
      }
      const { data, error } = await supabase
        .from('tasks')
        .update({ disabled: this.disable, customer: this.customer?.id })
        .match({ id: this.taskId })
      if (error) {
        message.error(`选片任务编辑失败${error?.message}`)
        return
      }
      // 计算 新增的任务图片插入 减少的任务图片删除 新增的已有已选图片更新 新增的未有已选图片插入  减少的已选图片更新
      const addImgs = this.imageList.filter((item: any) => {
        return this.initImageList.every((iItem: any) => {
          return iItem.id !== item.id
        })
      })
      const reduceImgs = this.initImageList.filter((iItem: any) => {
        return this.imageList.every((item: any) => {
          return iItem.id !== item.id
        })
      })

      const changeImgs = this.imageList.filter((item: any) => {
        return this.initImageList.some((iItem: any) => {
          return iItem.id === item.id && iItem.selected !== item.selected
        })
      })

      if (addImgs?.[0]) {
        const { error } = await supabase.from('task_image').insert(
          addImgs?.map(item => {
            return {
              image_id: item.id,
              task_id: this.taskId,
              selected: item.selected || false,
            }
          })
        )
        if (error) {
          console.error(error, 'task_image insert in edit')
        }
      }
      if (reduceImgs?.[0]) {
        const { error } = await supabase
          .from('task_image')
          .delete()
          .match(
            reduceImgs?.map((item: any) => {
              return item.joinId
            })
          )
        if (error) {
          console.error(error, 'task_image delete in edit')
        }
      }
      if (changeImgs?.[0]) {
        for (const changeImg of changeImgs) {
          const { error } = await supabase
            .from('task_image')
            .update({ selected: changeImg.selected || false })
            .match({ id: changeImg.joinId })
          if (error) {
            console.error(error, 'task_image update in edit')
          }
        }
      }
      message.info('任务编辑成功!')
      this.mainStore.router?.replace('/pick-task')
    }
    this.submitBtnLoading = false
  }
}
