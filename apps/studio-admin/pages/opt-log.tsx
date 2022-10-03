import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'

export default function OptLog() {
  return (
    <div>
      <h1>OptLog</h1>
    </div>
  )
}

OptLog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
