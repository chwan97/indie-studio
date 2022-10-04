import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import { Space, Table, Tag, Button, Form, Input, DatePicker } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

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

const columns: ColumnsType<DataType> = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: '客户',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '任务图片',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '已选图片',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
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
      <Space size="middle">
        <a>编辑</a>
        <a>发送选片邀请</a>
        <a>删除</a>
        <a>停用</a>
      </Space>
    ),
  },
]

const data: DataType[] = new Array(75).fill('').map((_, index) => {
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

export default function Index() {
  const [form] = Form.useForm()
  const router = useRouter()

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
          <Form form={form} name="horizontal_login" layout="inline" onFinish={() => {}}>
            <Form.Item name="id" rules={[]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="任务编号"
              />
            </Form.Item>
            <Form.Item name="name" rules={[]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="客户名称"
              />
            </Form.Item>
            <Form.Item name="创建时间" rules={[]}>
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
                <Button type="primary" htmlType="submit" disabled={false}>
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
            router.push('/pick-task/add')
          }}
        >
          新建选片任务
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
