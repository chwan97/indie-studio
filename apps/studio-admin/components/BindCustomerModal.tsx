import { css } from '@emotion/react'
import { Modal, Table } from 'antd'
import columns from './CustomerTableColumns'
import CustomerStore, { PAGE_SIZE } from '../store/page/CustomerStore'
import AddStore from '../store/page/pick-task/AddStore'
import React from 'react'
import { observer } from 'mobx-react'

// for :: Hydration failed because the initial UI does not match what was rendered on the server
// https://github.com/vercel/next.js/discussions/35773#discussioncomment-2840696
function BindCustomerModal(props: { addStore: AddStore }) {
  const { addStore } = props
  const {
    customerStore,
    selectCustomerForModal,
    customerModalVisible,
    setSelectCustomerForModal,
    onModalCustomerOk,
    onModalCustomerCancel,
  } = addStore
  const { data, loading, pageNum, total, changePage } = customerStore
  return (
    <Modal
      width={1100}
      centered
      title="选择需要关联的客户"
      open={customerModalVisible}
      onOk={async () => {
        onModalCustomerOk()
      }}
      onCancel={() => {
        onModalCustomerCancel()
      }}
      okText="确认"
      cancelText="取消"
      destroyOnClose
    >
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectCustomerForModal?.[0]?.id && [selectCustomerForModal?.[0].id],
          type: 'radio',
          onChange: (_, selectedRows) => {
            setSelectCustomerForModal(selectedRows as any[])
            console.log('selectedRows', selectedRows)
          },
        }}
        scroll={{
          y: 700,
        }}
        columns={columns(customerStore, {
          compact: true,
        })}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: PAGE_SIZE,
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

export default observer(BindCustomerModal)
