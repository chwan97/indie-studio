import { ReactElement, useEffect, useState } from 'react'
import Layout from 'components/AdminLayout'
import type { PaginationProps } from 'antd'
import { Pagination } from 'antd'
import dayjs from 'dayjs'
import { css } from '@emotion/react'
import { useMainStore } from '../hooks'

const showTotal: PaginationProps['showTotal'] = total => `共 ${total} 项`
const PAGE_SIZE = 15

export default function OptLog() {
  const mainStore = useMainStore()
  const supabase = mainStore.supabase

  const [totalCount, setTotalCount] = useState(0)
  const [data, setData] = useState<any[]>([])
  const query = async (page: number) => {
    if (!mainStore.userInfo?.id) {
      return
    }
    const base = (page - 1) * PAGE_SIZE
    const id = mainStore.userInfo?.id
    const { data, error } = await supabase
      .from('logs')
      .select('content, created_at')
      .eq('owner', id)
      .limit(PAGE_SIZE)
      .order('created_at', { ascending: false })
      .range(base, base + PAGE_SIZE)
    if (!error) {
      setData(data)
    }
  }
  useEffect(() => {
    ;(async () => {
      if (!mainStore.userInfo?.id) {
        return
      }
      const id = mainStore.userInfo?.id
      const { data, error, count } = await supabase
        .from('logs')
        .select('content', {
          count: 'exact',
          head: true,
        })
        .eq('owner', id)

      if (count) {
        setTotalCount(count as number)
      }
    })().catch(e => {
      console.error(e)
    })
  }, [])

  useEffect(() => {
    ;(async () => {
      await query(1)
    })().catch(e => {
      console.error(e)
    })
  }, [])
  return (
    <>
      <div
        css={css`
          margin-bottom: 15px;
        `}
      >
        <Pagination
          size="small"
          pageSize={PAGE_SIZE}
          total={totalCount}
          showTotal={showTotal}
          onChange={(page, pageSize) => {
            query(page)
          }}
        />
      </div>
      <div
        css={css`
          height: calc(100% - 45px);
          overflow-y: auto;
        `}
      >
        {data.length === 0 && '当前暂无日志'}
        {data.map((item, index) => {
          const { content, created_at } = item
          return (
            <p
              key={index}
              css={css`
                line-break: anywhere;
                white-space: break-spaces;
              `}
            >
              {created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}
              <span
                css={css`
                  margin-left: 15px;
                `}
              >
                {content}
              </span>
            </p>
          )
        })}
      </div>
    </>
  )
}

OptLog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
