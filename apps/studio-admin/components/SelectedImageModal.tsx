import { css } from '@emotion/react'
import { message, Modal, Table } from 'antd'
import columns from './ImageLibTableColumns'
import AddStore from 'store/page/pick-task/AddStore'
import React, { useRef } from 'react'
import { observer } from 'mobx-react'

// for :: Hydration failed because the initial UI does not match what was rendered on the server
// https://github.com/vercel/next.js/discussions/35773#discussioncomment-2840696
function SelectedImageModal(props: { addStore: AddStore }) {
  const { addStore } = props
  const selectRowsRef = useRef<any[]>([])
  const { unselectedImages, markSelectModalVisible, updateSelectedImage, toggleMarkSelectModal } =
    addStore

  // console.log('render markSelectModalVisible', markSelectModalVisible)
  return (
    <Modal
      width={1100}
      centered
      title="选择需要添加到已选图片的图片"
      open={markSelectModalVisible}
      onOk={async () => {
        if (selectRowsRef.current?.[0]) {
          updateSelectedImage(selectRowsRef.current)
          toggleMarkSelectModal(false)
        } else {
          message.warn('至少选择一个作为已选中照片！')
        }
      }}
      onCancel={() => {
        toggleMarkSelectModal(false)
      }}
      okText="确认"
      cancelText="取消"
      destroyOnClose
    >
      <Table
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          onChange: (_, selectedRows) => {
            selectRowsRef.current = selectedRows
            console.log('selectedRows', selectedRows)
          },
        }}
        scroll={{
          y: 700,
        }}
        columns={columns({
          compact: true,
        })}
        dataSource={unselectedImages}
        pagination={{
          pageSize: 4,
          total: unselectedImages.length,
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
        }}
      />
    </Modal>
  )
}

export default observer(SelectedImageModal)
