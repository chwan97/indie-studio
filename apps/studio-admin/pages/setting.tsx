import { Button } from 'ui'
import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'

export default function Setting() {
  return (
    <div>
      <h1>Web</h1>
      <Button />
    </div>
  )
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
