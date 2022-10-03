import type { ReactElement } from 'react'
import Layout from 'components/Layout'
import type { NextPageWithLayout } from './_app'

const ImageLib: NextPageWithLayout = function () {
  return (
    <div>
      <h1>Docs</h1>
    </div>
  )
}

ImageLib.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default ImageLib
