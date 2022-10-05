import { makeAutoObservable } from 'mobx'

import DisplayStore from './DisplayStore'
import AuthStore from './AuthStore'
import { NextRouter } from 'next/dist/client/router'
import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/gotrue-js/src/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default class Index {
  display: DisplayStore

  auth: AuthStore

  router: NextRouter | null = null

  supabase = supabase

  userInfo: User | null = null

  constructor() {
    makeAutoObservable(this, {
      supabase: false,
    })
    this.display = new DisplayStore(this)
    this.auth = new AuthStore(this)
  }

  init = async () => {
    await this.getUserInfo()
  }

  checkAuth = (url?: string) => {
    if (!this.userInfo) {
      this.router?.replace('/login')
    }
  }

  log = async (content: string) => {
    const id = this.userInfo?.id
    if (id && this.userInfo?.email) {
      const { data, error } = await supabase
        .from('logs')
        .insert([{ owner: id, content: `${this.userInfo?.email} ${content}` }])
      if (error) {
        console.error(error)
      }
    }
  }

  setRouter = (router: NextRouter) => {
    this.router = router
  }

  setName = (name: string) => {
    if (this.userInfo) {
      this.userInfo.user_metadata.name = name
    }
  }

  getUserInfo = async () => {
    this.userInfo = supabase.auth.user()
  }

  onAuthStateChange = () => {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'SIGNED_IN') {
        await this.getUserInfo()
        const currentPath = this.router?.pathname
        if (
          currentPath &&
          ['/login', '/inform/reset-password', '/inform/register', '/change-email'].some(path => {
            return currentPath.indexOf(path) !== -1
          })
        ) {
          console.log('currentPath', currentPath)
          this.router?.push('/image-lib')
        }
        return
      }
      if (event == 'SIGNED_OUT') {
        this.router?.push('/login')
        return
      }
      if (event == 'PASSWORD_RECOVERY') {
        if (this.router?.pathname.indexOf('/inform/reset-password') === -1) {
          this.router?.replace('/inform/reset-password')
        }
        return
      }
    })
  }
}
