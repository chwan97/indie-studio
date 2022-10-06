import { Button } from 'antd'
import { css } from '@emotion/react'

import { useMainStore } from 'hooks'
import { toJS } from 'mobx'

export default function TestPage() {
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
          console.log('supabase.auth.user()', toJS(supabase.auth.user()))
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
            .eq('user', id)
          console.log('userInfo', data, error)
        }}
      >
        查询userInfo
      </Button>

      <Button
        type="primary"
        onClick={async () => {
          mainStore.log('测试' + Math.random())
        }}
      >
        插入日志
      </Button>
    </div>
  )
}
