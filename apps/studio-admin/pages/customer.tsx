import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import { Space, Table, Tag, Button, Form, Input, DatePicker } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import AddCustomerModal from 'components/AddCustomerModal'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { observer, useLocalObservable } from 'mobx-react'
import CustomerStore from 'store/page/CustomerStore'

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
      render: text => <a>{text}</a>,
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '邮箱地址',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '联系地址',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '联系方式',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '创建日期',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
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

const data: DataType[] = new Array(1).fill('').map((_, index) => {
  return {
    key: String(index),
    id: '212d3215123',
    name: 'John Brown',
    age: 32,
    address: '12',
    status: '未选择',
    tags: ['nice', 'developer'],
  }
})

function Customer() {
  const [searchForm] = Form.useForm()
  const customerStore = useLocalObservable(() => {
    return new CustomerStore(searchForm)
  })
  const { addModalVisible, toggleAddModalVisible } = customerStore

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
        <div>
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
            margin-left: auto;
          `}
          type="primary"
          onClick={() => {
            customerStore.toggleAddModal()
          }}
        >
          创建客户信息
        </Button>
      </div>
      <Table columns={columns(customerStore)} dataSource={data} />
      <AddCustomerModal store={customerStore} />
    </div>
  )
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Customer)
