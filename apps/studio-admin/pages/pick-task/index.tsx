import { ReactElement, useEffect } from 'react'
import Layout from 'components/AdminLayout'
import { Switch, Table, Tooltip, Button, Form, Input, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { useMainStore } from '../../hooks'
import { observer, useLocalObservable } from 'mobx-react'
import IndexStore from 'store/page/pick-task/IndexStore'
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

const columns: ColumnsType<DataType> = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '客户',
    dataIndex: 'customer',
    key: 'customer',
    render: (customer: any) => {
      return (
        <Tooltip
          title={
            <div>
              <div>姓名：{customer.name}</div>
              <div>邮箱：{customer.mail}</div>
              <div>地址：{customer.address}</div>
              <div>联系方式：{customer.contact}</div>
            </div>
          }
        >
          <a>{customer.name}</a>
        </Tooltip>
      )
    },
  },
  {
    title: '任务图片',
    dataIndex: 'images',
    key: 'images',
    render: (images: any) => {
      return images.length
    },
  },
  {
    title: '已选图片',
    dataIndex: 'images',
    key: 'images',
    render: (images: any) => {
      return images.filter((item: any) => item.selected).length
    },
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: any) => <>未开始</>,
  },
  {
    title: '创建日期',
    key: 'created_at',
    dataIndex: 'created_at',
    render: (created_at: any) => (
      <>{created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</>
    ),
  },
  {
    title: '停用',
    key: 'disable',
    render: (disable, record) => (
      <Switch
        checked={disable}
        onChange={res => {
          console.log(res)
        }}
      />
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    render: (_, record) => (
      <div
        css={css`
          a {
            margin-right: 10px;
          }
        `}
      >
        <a>编辑</a>
        <a>发送选片邀请</a>
        <a>删除</a>
      </div>
    ),
  },
]

function Index() {
  const [form] = Form.useForm()
  const router = useRouter()
  const mainStore = useMainStore()
  const indexStore = useLocalObservable(() => new IndexStore(mainStore))
  useEffect(() => {
    indexStore.init()
  }, [])
  const { data } = indexStore
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
        <div>
          <Form form={form} name="horizontal_login" layout="inline" onFinish={() => {}}>
            <Form.Item name="id" rules={[]}>
              <Input placeholder="任务编号" />
            </Form.Item>
            <Form.Item name="name" rules={[]}>
              <Input placeholder="客户姓名" />
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
          添加选片任务
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          y: 700,
        }}
      />
    </div>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Index)
