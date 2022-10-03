import { Button } from 'antd'
import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import { css } from '@emotion/react'

export default function Setting() {
  return (
    <div>
      <p>
        用户名：长万
        <Button type="link">更改</Button>
      </p>
      <p>
        邮箱：sti2w23@qq.com
        <Button type="link">更改</Button>
      </p>
      <p>
        密码：·················
        <Button type="link">更改</Button>
      </p>
    </div>
  )
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
