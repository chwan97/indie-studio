import React, { ReactElement, useEffect } from 'react'
import dayjs from 'dayjs'
import { css } from '@emotion/react'
import { observer, useLocalObservable } from 'mobx-react'
import { Table, Button, Form, Input, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import CustomerStore from 'store/page/CustomerStore'
import { useMainStore } from 'hooks'
import Layout from 'components/AdminLayout'
import columns from 'components/CustomerTableColumns'
import AddCustomerModal from 'components/AddCustomerModal'

const { RangePicker } = DatePicker

function Customer() {
  const [searchForm] = Form.useForm()
  const mainStore = useMainStore()
  const customerStore = useLocalObservable(() => {
    return new CustomerStore(mainStore)
  })
  const { pageSize, loading, pageNum, total, data, changePage } = customerStore

  useEffect(() => {
    customerStore.init()
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
          display: flex;

          .ant-form-inline .ant-form-item-with-help {
            margin-bottom: 0;
          }
        `}
      >
        {/* TODO 筛选 */}
        <div
          css={css`
            display: none;
          `}
        >
          <Form form={searchForm} name="searchForm" layout="inline" onFinish={() => {}}>
            <Form.Item name="id" rules={[]}>
              <Input placeholder="客户编号" />
            </Form.Item>
            <Form.Item name="name" rules={[]}>
              <Input placeholder="姓名" />
            </Form.Item>
            <Form.Item name="createTime" label="创建时间" rules={[]}>
              <RangePicker />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button type="primary" htmlType="submit" disabled={false}>
                  搜索
                </Button>
              )}
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  disabled={false}
                  onClick={() => {
                    searchForm.resetFields()
                  }}
                >
                  重置
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
        <Button
          css={css`
            margin-right: auto;
          `}
          type="primary"
          onClick={() => {
            customerStore.toggleAddModal()
          }}
        >
          创建客户信息
        </Button>
      </div>
      <Table
        rowKey="id"
        scroll={{
          y: 700,
        }}
        columns={columns(customerStore)}
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
      <AddCustomerModal store={customerStore} />
    </div>
  )
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Customer)
