import { ReactElement, useEffect } from 'react'
import Layout from 'components/AdminLayout'
import { Space, Table, Tag, Button, Form, Input, DatePicker } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import AddCustomerModal from 'components/AddCustomerModal'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { observer, useLocalObservable } from 'mobx-react'
import CustomerStore, { PAGE_SIZE } from 'store/page/CustomerStore'
import { useMainStore } from 'hooks'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface DataType {
  key: string
  id: string
  name: string
  age: number
  address: string
  status: string
  tags: string[]
}

const columns: (customerStore: CustomerStore) => ColumnsType<DataType> = customerStore => {
  const {} = customerStore
  return [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 350,
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱地址',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '创建日期',
      key: 'created_at',
      dataIndex: 'created_at',
      render: created_at => <>{created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            css={css`
              padding: 0 5px;
            `}
            onClick={() => {
              customerStore.toggleEditModal(record)
            }}
          >
            编辑
          </Button>
          <Button
            css={css`
              padding: 0 5px;
            `}
            type="link"
            onClick={() => {
              customerStore.deleted(record)
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ]
}

function Customer() {
  const [searchForm] = Form.useForm()
  const mainStore = useMainStore()
  const customerStore = useLocalObservable(() => {
    return new CustomerStore(mainStore, searchForm)
  })
  const { loading, pageNum, total, data, changePage } = customerStore

  useEffect(() => {
    customerStore.init()
  }, [])

  return (
    <div>
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
        columns={columns(customerStore)}
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
      <AddCustomerModal store={customerStore} />
    </div>
  )
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Customer)
