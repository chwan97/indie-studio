import { makeAutoObservable, toJS } from 'mobx'
import { message } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

import Main from 'store'

export const PAGE_SIZE = 5

export default class ImageLibStore {
  addModalVisible = false

  total = 0

  pageNum = 1

  pageSize = PAGE_SIZE

  data: any[] = []

  excludeIds: string[] = []

  loading = false

  main: Main

  constructor(main: Main) {
    makeAutoObservable(this)
    this.main = main
  }

  init = async () => {
    this.getTotal()
    this.query(1)
  }

  changePage = async (page: number) => {
    this.pageNum = page
    this.query(page)
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize
  }

  setExcludeIds = (excludeIds: string[]) => {
    this.excludeIds = excludeIds
  }

  getTotal = async () => {
    if (!this.main.userInfo?.id) {
      return
    }
    const supabase = this.main.supabase
    const id = this.main.userInfo?.id
    const { error, count } = await supabase
      .from('images')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('owner', id)
      .eq('deleted', false)
      .not('id', 'in', `(${toJS(this.excludeIds)})`)

    this.total = count as number
  }

  query = async (page: number) => {
    if (!this.main.userInfo?.id) {
      return
    }
    try {
      this.loading = true
      const supabase = this.main.supabase
      const id = this.main.userInfo?.id
      const base = (page - 1) * this.pageSize

      const { data: dBase, error } = await supabase
        .from('images')
        .select('id, file_name, size, src, type, created_at')
        .eq('owner', id)
        .eq('deleted', false)
        .not('id', 'in', `(${toJS(this.excludeIds)})`)
        .order('created_at', { ascending: false })
        .range(base, base + this.pageSize - 1)

      if (!error) {
        const keys = dBase.map(item => item.src)
        if (keys[0]) {
          const { data, error } = await supabase.storage
            .from('image-library')
            .createSignedUrls(keys, 300)
          console.log('data', data)
          if (data && !error) {
            dBase.forEach((item, index) => {
              item.src = data[index].signedURL
            })
          }
        }
        this.data = dBase
      } else {
        message.error(`列表获取失败!${error.message}`)
      }
    } finally {
      this.loading = false
    }
  }

  deleteImage = async (imageId: string) => {
    if (!this.main.userInfo?.id) {
      return
    }
    const supabase = this.main.supabase
    const id = this.main.userInfo?.id
    const { data, error } = await supabase
      .from('images')
      .update({ deleted: true })
      .match({ id: imageId, owner: id })
    if (!error) {
      message.error(`删除成功`)
      this.main.log(`删除图片,图片ID：${imageId}`)
      this.getTotal()
      this.changePage(this.pageNum)
    } else {
      message.error(`删除失败!${error.message}`)
    }
  }

  toggleAddModalVisible = (visible: boolean) => {
    this.addModalVisible = visible
  }

  customRequest = (options: UploadRequestOption) => {
    console.log('options', options)
    const { onError, onSuccess, file, filename } = options
    const supabase = this.main.supabase

    if (!file) return
    const { uid, name, size, type } = file as any

    ;(async () => {
      const { data, error } = await supabase.storage
        .from('image-library')
        .upload(uid as string, file, {
          cacheControl: '3600',
          upsert: false,
        })
      console.log('data, error ', data, error)

      if (error) {
        let msg = error.message || ''
        message.error(`图片上传失败!${msg}`)
        onError?.(error)
      } else {
        const id = this.main.userInfo?.id
        if (id) {
          const { data, error } = await supabase
            .from('images')
            .insert([{ owner: id, file_name: name, size: size, src: uid, type }])
          this.main.log(`上传图片,图片名称：${name}, 图片ID: ${data?.[0]!.id || '获取失败'}`)
        }
        console.log('insert data', data)

        onSuccess?.(options)
      }
    })().catch(e => console.error(e))
  }
}
