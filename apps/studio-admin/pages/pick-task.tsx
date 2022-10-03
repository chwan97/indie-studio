import { Button } from 'ui'
import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'

export default function PickTask() {
  return (
    <div>
      <h1>PickTask</h1>
      <Button />
    </div>
  )
}

PickTask.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
