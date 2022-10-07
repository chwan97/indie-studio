import React, { ReactElement, useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { Table, Button, Form } from 'antd'
import { css } from '@emotion/react'

import Layout from 'components/AdminLayout'
import AddImageModal from 'components/AddImageModal'
import columns from 'components/ImageLibTableColumns'
import { useMainStore } from 'hooks'
import ImageLibStore from 'store/page/ImageLibStore'

function ImageLib() {
  const mainStore = useMainStore()
  const imageLibStore = useLocalObservable(() => new ImageLibStore(mainStore))
  const {
    pageSize,
    loading,
    pageNum,
    total,
    data,
    toggleAddModalVisible,
    changePage,
    deleteImage,
  } = imageLibStore

  const [form] = Form.useForm()
  useEffect(() => {
    imageLibStore.init()
  }, [])
  return (
    <div
      css={css`
        .ant-table {
          height: 700px;
        }
      `}
    >
      <div
        css={css`
          padding-bottom: 15px;
        `}
      >
        <Button
          css={css`
            margin-left: auto;
          `}
          type="primary"
          onClick={() => {
            toggleAddModalVisible(true)
          }}
        >
          上传图片
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns({ deleteImage })}
        dataSource={data}
        loading={loading}
        scroll={{
          y: 700,
        }}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: total,
          showTotal: total => (
            <div
              css={css`
                font-size: 16px;
                line-height: 32px;
                margin-right: 8px;
              `}
            >
              共{total}项
            </div>
          ),
          onChange: (page, pageSize) => {
            changePage(page)
          },
        }}
      />
      <AddImageModal store={imageLibStore} />
    </div>
  )
}

ImageLib.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(ImageLib)
