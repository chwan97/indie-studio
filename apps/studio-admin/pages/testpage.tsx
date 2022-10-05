import { Button } from 'antd'
import { css } from '@emotion/react'

import { useMainStore } from 'hooks'
import { toJS } from 'mobx'

export default function Testpage() {
  const mainStore = useMainStore()
  const supabase = mainStore.supabase
  return (
    <div
      css={css`
        & > * {
          margin-bottom: 24px;
          margin-right: 24px;
        }
      `}
    >
      <Button
        type="primary"
        onClick={() => {
          console.log('mainStore.userInfo', toJS(mainStore.userInfo))
        }}
      >
        打印用户信息
      </Button>
      <Button
        type="primary"
        onClick={async () => {
          if (!mainStore.userInfo) {
            console.log('mainStore.userInfo null')
            return
          }
          const { id } = mainStore.userInfo
          const { data, error } = await supabase
            .from('user_info')
            .select()
            .select('name')
            .eq('user', id) // Incorrect
          console.log('userInfo', data, error)
        }}
      >
        查询userInfo
      </Button>
    </div>
  )
}
