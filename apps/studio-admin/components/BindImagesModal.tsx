import { css } from '@emotion/react'
import { Modal, Table } from 'antd'
import columns from './ImageLibTableColumns'
import AddStore from '../store/page/pick-task/AddStore'
import React from 'react'
import { observer } from 'mobx-react'

// for :: Hydration failed because the initial UI does not match what was rendered on the server
// https://github.com/vercel/next.js/discussions/35773#discussioncomment-2840696
function BindImagesModal(props: { addStore: AddStore }) {
  const { addStore } = props
  const {
    imageLibStore,
    selectImageForModal,
    imageModalVisible,
    setSelectImageForModal,
    onModalImageOk,
    onModalImageCancel,
  } = addStore
  const { pageSize, data, loading, pageNum, total, changePage } = imageLibStore
  return (
    <Modal
      width={1100}
      centered
      title="选择添加的任务图片"
      open={imageModalVisible}
      onOk={async () => {
        onModalImageOk()
      }}
      onCancel={() => {
        onModalImageCancel()
      }}
      okText="确认"
      cancelText="取消"
      destroyOnClose
    >
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectImageForModal?.[0]
            ? selectImageForModal.map((item: any) => item.id)
            : [],
          type: 'checkbox',
          onChange: (_, selectedRows) => {
            setSelectImageForModal(selectedRows as any[])
            console.log('selectedRows', selectedRows)
          },
        }}
        scroll={{
          y: 700,
        }}
        columns={columns({
          compact: true,
        })}
        dataSource={data}
        loading={loading}
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
    </Modal>
  )
}

export default observer(BindImagesModal)
