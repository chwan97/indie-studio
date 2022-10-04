import React, { useContext, useState } from 'react'
import StoreContext from 'context/StoreContext'
import MainStore from 'store'

export const useMainStore = (): MainStore => {
  const mainStore = useContext(StoreContext)
  if (!mainStore) {
    throw new Error('mainStore not find!')
  }
  return mainStore
}
