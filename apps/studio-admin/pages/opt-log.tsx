import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import type { PaginationProps } from 'antd'
import { Pagination } from 'antd'
import { css } from '@emotion/react'

const showTotal: PaginationProps['showTotal'] = total => `共 ${total} 项`

export default function OptLog() {
  return (
    <>
      <div
        css={css`
          margin-bottom: 15px;
        `}
      >
        <Pagination size="small" total={50} showTotal={showTotal} />
      </div>
      <div
        css={css`
          height: calc(100% - 45px);
          overflow-y: auto;
        `}
      >
        {new Array(90).fill('').map((_, index) => {
          return (
            <p
              key={index}
              css={css`
                line-break: anywhere;
                white-space: break-spaces;
              `}
            >
              2022-3-23 23:23:23:
              isd8d2dnksbf89uvefibewiucvewiuvwnvibweiobviwbevkewncinbeibviwoboivwebvnoiweni
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
