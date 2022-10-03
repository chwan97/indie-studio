import type { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import type { NextPageWithLayout } from './_app'

const ImageLib: NextPageWithLayout = function () {
  return (
    <div>
      <h1>ImageLib</h1>
    </div>
  )
}

ImageLib.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ImageLib
