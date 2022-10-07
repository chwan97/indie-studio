import { makeAutoObservable } from 'mobx'
import MainStore from 'store'
import { message } from 'antd'

const PAGE_SIZE = 10

export default class IndexStore {
  mainStore: MainStore

  total = 0

  pageNum = 1

  params = {}

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

  getTotal = async () => {
    if (!this.mainStore.userInfo?.id) {
      return
    }
    const supabase = this.mainStore.supabase
    const id = this.mainStore.userInfo?.id
    const { error, count } = await supabase
      .from('tasks')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('owner', id)
      .eq('deleted', false)
    this.total = count as number
    console.log('count', count)
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
        .from('tasks')
        .select(
          `
        id, disabled, created_at, status,
        customer (id, name, mail, address, contact, created_at),
        images (*)
        
        `
          // images (id, file_name, size, src, type, created_at, task_image (selected))
        )
        .eq('owner', id)
        .eq('deleted', false)
        .order('created_at', { ascending: false })
        .range(base, base + this.pageSize - 1)

      if (!error) {
        this.data = dBase
        // {
        //   "id": "70671db4-d112-442b-b1bf-4f432c9a783b",
        //   "disabled": true,
        //   "created_at": "2022-10-06T13:08:44.260491+00:00",
        //   "customer": {
        //   "id": "fde340d4-1cce-406a-9dc6-ac0eb10d8d28",
        //     "name": "weqd",
        //     "mail": "23@sad.com",
        //     "address": "dasfsad",
        //     "contact": "dasdsad(qq)",
        //     "created_at": "2022-10-06T03:11:16.791924+00:00"
        // },
        //   "images": [
        //   {
        //     "id": "cad4dd07-3029-427a-98f9-6af14d1a2118",
        //     "file_name": "2021525-211328.jpeg",
        //     "size": "6188",
        //     "src": "rc-upload-1665021082586-3",
        //     "type": "image/jpeg",
        //     "created_at": "2022-10-06T01:51:36.518771+00:00"
        //   }
        // ]
        console.log(this.data, 'this.data')
      } else {
        message.error(`列表获取失败!${error.message}`)
      }
    } finally {
      this.loading = false
    }
  }
}
