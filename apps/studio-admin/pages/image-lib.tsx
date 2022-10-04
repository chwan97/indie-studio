import { ReactElement } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { Space, Table, Tag, Button, Form, Input, DatePicker } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import Layout from 'components/AdminLayout'
import AddImageModal from 'components/AddImageModal'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useMainStore } from 'hooks'
import ImageLibStore from '../store/page/ImageLibStore'

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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '预览',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '类型',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '大小',
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
        <a>删除</a>
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

function ImageLib() {
  const imageLibStore = useLocalObservable(() => new ImageLibStore())
  const { addModalVisible, toggleAddModalVisible } = imageLibStore

  const [form] = Form.useForm()
  const mainStore = useMainStore()

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
                placeholder="图片编号"
              />
            </Form.Item>
            <Form.Item name="name" rules={[]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="图片名称"
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
            toggleAddModalVisible(true)
          }}
        >
          上传图片
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <AddImageModal store={imageLibStore} />
    </div>
  )
}

ImageLib.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(ImageLib)
