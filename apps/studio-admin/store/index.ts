import { makeAutoObservable } from 'mobx'

import DisplayStore from './DisplayStore'
import AuthStore from './AuthStore'
import { NextRouter } from 'next/dist/client/router'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default class Index {
  display: DisplayStore

  auth: AuthStore

  router: NextRouter | null = null

  supabase = supabase

  constructor() {
    makeAutoObservable(this, {
      supabase: false,
    })
    this.display = new DisplayStore(this)
    this.auth = new AuthStore(this)
  }

  setRouter = (router: NextRouter) => {
    this.router = router
  }
}
