import { makeAutoObservable } from 'mobx'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import ModalMode from 'constants/ModalMode'

export default class CustomerStore {
  addModalVisible = false

  addForm?: FormInstance<any>

  searchForm

  modelMode: ModalMode = ModalMode.add

  constructor(searchForm: FormInstance<any>) {
    this.searchForm = searchForm
    makeAutoObservable(this)
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

  add = async () => {
    if (!this.addForm) return

    try {
      const { name, mail, address, contact } = await this.addForm.validateFields()
    } catch (e) {
      console.error(e)
    }
  }

  toggleEditModal = (record: any) => {
    this.toggleAddModalVisible(true)
    this.modelMode = ModalMode.edit
  }

  closeModal = () => {
    this.toggleAddModalVisible(false)
    this.addForm?.resetFields()
  }

  deleted = (record: any) => {}
}
