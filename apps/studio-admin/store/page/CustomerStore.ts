import { makeAutoObservable } from 'mobx'
import { message } from 'antd'
import { FormInstance } from 'antd/lib/form/hooks/useForm'

import ModalMode from 'constantx/ModalMode'
import MainStore from 'store'

export const PAGE_SIZE = 10

export default class CustomerStore {
  addModalVisible = false

  mainStore: MainStore

  addForm?: FormInstance<any>

  // searchForm

  total = 0

  pageNum = 1

  pageSize = PAGE_SIZE

  data: any[] = []

  loading = false

  modelMode: ModalMode = ModalMode.add

  currentItem?: any

  constructor(mainStore: MainStore /* searchForm: FormInstance<any>*/) {
    // this.searchForm = searchForm
    this.mainStore = mainStore
    makeAutoObservable(this)
  }

  init = async () => {
    this.getTotal()
    this.query(1)
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize
  }

  toggleAddModalVisible = (visible: boolean) => {
    this.addModalVisible = visible
  }

  addCustomer = () => {}

  setForm = (form: FormInstance<any>) => {
    this.addForm = form
  }

  toggleAddModal = () => {
    this.toggleAddModalVisible(true)
    this.modelMode = ModalMode.add
  }

  modalOKClick = async () => {
    if (this.modelMode == ModalMode.add) {
      await this.add()
    } else {
      await this.edit()
    }
  }

  edit = async () => {
    if (!this.addForm || !this?.currentItem?.id) return
    let param
    try {
      param = await this.addForm.validateFields()
    } catch (e) {
      console.error(e)
    }
    if (!param) return

    const itemId = this?.currentItem?.id
    const { name, mail, address, contact } = param

    const id = this.mainStore.userInfo?.id
    const supabase = this.mainStore.supabase

    if (!id || !supabase) return

    const { data, error } = await supabase
      .from('customer')
      .update({
        name,
        mail,
        address,
        contact,
      })
      .match({ id: itemId, owner: id })
    if (error) {
      message.error(`客户编辑失败!${error.message}`)
    } else {
      message.info('客户编辑成功')
      this.mainStore.log(`客户编辑成功,客户邮箱：${mail}, 客户ID: ${data?.[0]!.id || '获取失败'}`)
      this.closeModal()
      this.getTotal()
      this.changePage(this.pageNum)
    }
  }

  add = async () => {
    if (!this.addForm) return
    let param
    try {
      param = await this.addForm.validateFields()
    } catch (e) {
      console.error(e)
    }
    if (!param) return
    const { name, mail, address, contact } = param

    const id = this.mainStore.userInfo?.id
    const supabase = this.mainStore.supabase

    if (!id || !supabase) return

    const { data, error } = await supabase.from('customer').insert([
      {
        owner: id,
        name,
        mail,
        address,
        contact,
      },
    ])
    if (error) {
      message.error(`客户新建失败!${error.message}`)
    } else {
      message.info('客户新建成功')
      this.mainStore.log(`客户新建成功,客户邮箱：${mail}, 客户ID: ${data?.[0]!.id || '获取失败'}`)
      this.closeModal()
      this.getTotal()
      this.changePage(this.pageNum)
    }
  }

  toggleEditModal = (record: any) => {
    this.toggleAddModalVisible(true)
    this.modelMode = ModalMode.edit
    this.currentItem = record
    this.addForm?.setFields([
      {
        name: 'name',
        value: record?.name,
      },
      {
        name: 'contact',
        value: record?.contact,
      },

      {
        name: 'mail',
        value: record?.mail,
      },

      {
        name: 'address',
        value: record?.address,
      },
    ])
  }

  closeModal = () => {
    this.toggleAddModalVisible(false)
    this.addForm?.resetFields()
  }

  changePage = async (page: number) => {
    this.pageNum = page
    this.query(page)
  }

  getTotal = async () => {
    if (!this.mainStore.userInfo?.id) {
      return
    }
    const supabase = this.mainStore.supabase
    const id = this.mainStore.userInfo?.id
    const { error, count } = await supabase
      .from('customer')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('owner', id)
      .eq('deleted', false)
    this.total = count as number
  }

  query = async (page: number) => {
    if (!this.mainStore.userInfo?.id) {
      return
    }
    try {
      this.loading = true
      const supabase = this.mainStore.supabase
      const id = this.mainStore.userInfo?.id
      const base = (page - 1) * this.pageSize

      const { data: dBase, error } = await supabase
        .from('customer')
        .select('id, name, mail, address, contact, created_at')
        .eq('owner', id)
        .eq('deleted', false)
        .order('created_at', { ascending: false })
        .range(base, base + this.pageSize - 1)

      if (!error) {
        this.data = dBase
      } else {
        message.error(`列表获取失败!${error.message}`)
      }
    } finally {
      this.loading = false
    }
  }
  deleted = async (record: any) => {
    const infoID = record.id
    if (!this.mainStore.userInfo?.id) {
      return
    }
    const supabase = this.mainStore.supabase
    const id = this.mainStore.userInfo?.id
    const { data, error } = await supabase
      .from('customer')
      .update({ deleted: true })
      .match({ id: infoID, owner: id })
    if (!error) {
      message.error(`删除成功`)
      this.mainStore.log(`删除客户成功,客户ID：${infoID}`)
      this.getTotal()
      this.changePage(this.pageNum)
    } else {
      message.error(`删除失败!${error.message}`)
    }
  }
}
