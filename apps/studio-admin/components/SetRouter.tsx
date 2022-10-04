import { useEffect } from 'react'

import { useMainStore } from 'hooks'
import { useRouter } from 'next/router'

export default function SetRouter() {
  const router = useRouter()

  const mainStore = useMainStore()

  useEffect(() => {
    mainStore.setRouter(router)
  }, [router, mainStore])

  return null
}
