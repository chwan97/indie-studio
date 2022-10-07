import { ReactElement, useEffect, useState } from 'react'
import Layout from 'components/AdminLayout'
import {
  Switch,
  Table,
  Tooltip,
  Button,
  Form,
  Input,
  DatePicker,
  Modal,
  Image,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { observer, useLocalObservable } from 'mobx-react'
import IndexStore from 'store/page/pick-task/IndexStore'
import dayjs from 'dayjs'
import { TaskStatus } from 'constantx'
import { useMainStore } from 'hooks'

const { RangePicker } = DatePicker

interface IImageViewModal {
  visible: boolean
  imgs: any[]
}

function Index() {
  const [form] = Form.useForm()
  const router = useRouter()
  const mainStore = useMainStore()
  const indexStore = useLocalObservable(() => new IndexStore(mainStore))
  useEffect(() => {
    indexStore.init()
  }, [])
  const { loading, pageNum, total, data, pageSize, setDisabled, deleteItem, search, changePage } =
    indexStore

  const [imageViewModal, setImageViewModal] = useState<IImageViewModal>(() => ({
    imgs: [],
    visible: false,
  }))

  const { imgs, visible } = imageViewModal

  const columns: ColumnsType<any> = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 350,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => {
        if (!customer) return '-'
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
      dataIndex: 'task_image',
      key: 'images',
      render: (task_image: any) => {
        if (!task_image || task_image.length === 0) return 0
        const images = task_image.map((item: any) => item.images)

        return (
          <a
            onClick={async () => {
              const { data, error } = await mainStore.supabase.storage
                .from('image-library')
                .createSignedUrls(
                  images.map((item: any) => item.src),
                  300
                )
              if (!error) {
                setImageViewModal({
                  imgs: (data || []).map(item => item.signedURL),
                  visible: true,
                })
              } else {
                message.warn(`获取图片失败， ${error?.message}`)
              }
            }}
          >
            {images.length}
          </a>
        )
      },
    },
    {
      title: '已选图片',
      dataIndex: 'task_image',
      key: 'selected_images',
      render: (task_image: any) => {
        if (!task_image || task_image.length === 0) return 0
        const images = task_image
          .filter((item: any) => item.selected)
          .map((item: any) => item.images)
        if (images.length === 0) return 0

        return (
          <a
            onClick={async () => {
              const { data, error } = await mainStore.supabase.storage
                .from('image-library')
                .createSignedUrls(
                  images.map((item: any) => item.src),
                  300
                )
              if (!error) {
                setImageViewModal({
                  imgs: (data || []).map(item => item.signedURL),
                  visible: true,
                })
              } else {
                message.warn(`获取图片失败， ${error?.message}`)
              }
            }}
          >
            {images.length}
          </a>
        )
      },
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <>{status === TaskStatus.selected ? '已选择' : '未开始'}</>,
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
      key: 'disabled',
      dataIndex: 'disabled',
      render: (disabled, record) => {
        return (
          <Switch
            checked={disabled}
            onChange={val => {
              setDisabled(val, record)
            }}
          />
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record: any) => (
        <div
          css={css`
            a {
              margin-right: 10px;
            }
          `}
        >
          <a
            onClick={() => {
              router.push({
                pathname: '/pick-task/add',
                query: { id: record.id },
              })
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              Modal.info({
                title: '发送选片邀请',
                content: (
                  <div>
                    <p>复制以下信息，发送给待选片用户</p>
                    <Input.TextArea
                      autoSize
                      value={`使用你的邮箱 ${record.customer.mail}，注册登录 https://u-portal.netlify.app/，完成选片，任务 ID: ${record.id}`}
                    ></Input.TextArea>
                  </div>
                ),
                okText: '确定',
              })
            }}
          >
            发送选片邀请
          </a>
          <a
            onClick={() => {
              deleteItem(record)
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ]

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
          <Form
            form={form}
            name="horizontal_login"
            layout="inline"
            onFinish={vals => {
              console.log('vals', vals)
              search(vals)
            }}
          >
            <Form.Item
              name="id"
              rules={[
                {
                  type: 'string',
                },
                {
                  max: 50,
                  message: '长度不能超过50',
                },
              ]}
            >
              <Input placeholder="任务编号" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                {
                  type: 'string',
                },
                {
                  max: 20,
                  message: '长度不能超过20',
                },
              ]}
            >
              <Input placeholder="客户姓名" />
            </Form.Item>
            <Form.Item name="dates" label="创建时间" rules={[]}>
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  onClick={() => {
                    form.resetFields()
                    search({})
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
            router.push('/pick-task/add')
          }}
        >
          添加选片任务
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{
          y: 700,
        }}
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
      <Modal
        title="图片列表预览"
        open={visible}
        footer={null}
        onCancel={() => {
          setImageViewModal({
            imgs: [],
            visible: false,
          })
        }}
      >
        {imgs.map((item: any) => {
          return (
            <span
              css={css`
                margin-right: 8px;
                margin-bottom: 8px;
              `}
            >
              <Image width={80} key={item} src={item} />
            </span>
          )
        })}
      </Modal>
    </div>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Index)
