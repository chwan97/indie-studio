import { makeAutoObservable, toJS } from 'mobx'
import MainStore from 'store'
import { message } from 'antd'

const PAGE_SIZE = 10

export default class IndexStore {
  mainStore: MainStore

  total = 0

  pageNum = 1

  params: any = {}

  pageSize = PAGE_SIZE

  data: any[] = []

  loading = false

  constructor(mainStore: MainStore) {
    this.mainStore = mainStore
    makeAutoObservable(this)
  }

  init = async () => {
    this.getTotal()
    this.query(1)
  }

  changePage = async (page: number) => {
    this.pageNum = page
    await this.query(page)
  }

  setDisabled = async (disabled: boolean, record: any) => {
    const supabase = this.mainStore.supabase
    const recordId = record.id
    if (!supabase || !recordId) {
      return
    }
    const { data, error } = await supabase
      .from('tasks')
      .update({ disabled: disabled })
      .match({ id: recordId })

    this.data.forEach((item, index) => {
      if (item.id === record.id) {
        this.data[index].disabled = disabled
      }
    })
    this.data = [...this.data]
  }

  deleteItem = async (record: any) => {
    const supabase = this.mainStore.supabase
    const recordId = record.id
    if (!supabase || !recordId) {
      return
    }
    const { data, error } = await supabase
      .from('tasks')
      .update({ deleted: true })
      .match({ id: recordId })
    if (error) {
      message.warning(`删除失败！${error.message}`)
    } else {
      message.info('删除成功！')
      this.getTotal()
      this.changePage(this.pageNum)
    }
  }

  getTotal = async () => {
    if (!this.mainStore.userInfo?.id) {
      return
    }
    const supabase = this.mainStore.supabase
    const id = this.mainStore.userInfo?.id
    let query = supabase
      .from('tasks')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('owner', id)

    query = this.addQueryParams(query)

    const { error, count } = await query.eq('deleted', false)
    this.total = count as number
    console.log('count', count)
  }

  search = async (params: any) => {
    this.params = params
    this.getTotal()
    this.query(1)
  }

  addQueryParams = (raw: any) => {
    let query = raw
    if (this.params.id) {
      const id = String(this.params.id).trim()
      query = query.eq('id', id)
    }
    if (this.params.name) {
      query = query.textSearch('customer.name', `'${this.params.name}'`)
    }
    if (this.params?.dates?.[0]) {
      const formatForSupabbase = 'YYYY-MM-DDTHH:mm:ss+08:00'
      const [beginDate, endDate] = toJS(this.params?.dates)

      query = query
        .gte('created_at', `'${beginDate.format(formatForSupabbase)}'`)
        .lte('created_at', `'${endDate.format(formatForSupabbase)}'`)
    }
    return query
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
      let query = supabase.from('tasks').select(
        `
        id, disabled, created_at, status,
        task_image(selected, images (*)),
        customer!inner(id, name, mail, address, contact, created_at)
        `
      )

      query = this.addQueryParams(query)

      const { data: dBase, error } = await query
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
}
