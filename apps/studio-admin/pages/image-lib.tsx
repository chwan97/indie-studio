import { ReactElement, useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { Space, Table, Button, Form, Image, DatePicker } from 'antd'

import Layout from 'components/AdminLayout'
import AddImageModal from 'components/AddImageModal'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useMainStore } from 'hooks'
import ImageLibStore, { PAGE_SIZE } from 'store/page/ImageLibStore'
import dayjs from 'dayjs'
import { formatSize } from 'utils'

interface DataType {
  key: string
  id: string
  name: string
  age: number
  address: string
  status: string
  tags: string[]
}

const columns: (option: any) => ColumnsType<DataType> = option => {
  const { deleteImage } = option
  return [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 300,
    },
    {
      title: '名称',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: '预览',
      dataIndex: 'src',
      key: 'src',
      render: src => (
        <div
          css={css`
            width: 85px;
            height: 85px;
            border: 1px solid #eaeaea;
            border-radius: 4px;
            position: relative;
            margin-bottom: 5px;
            margin-right: 5px;

            .ant-image {
              width: 85px;
              height: 85px;
            }
          `}
        >
          <Image
            css={css`
              max-width: 100%;
              max-height: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: unset;
              height: unset;
              vertical-align: unset;
            `}
            src={src}
          ></Image>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size, { tags }) => <>{size && formatSize(size)}</>,
    },
    {
      title: '创建日期',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at, { tags }) => (
        <>{created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              if (record?.id) {
                deleteImage(record?.id)
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
}

function ImageLib() {
  const mainStore = useMainStore()
  const imageLibStore = useLocalObservable(() => new ImageLibStore(mainStore))
  const { loading, pageNum, total, data, toggleAddModalVisible, changePage, deleteImage } =
    imageLibStore

  const [form] = Form.useForm()
  useEffect(() => {
    imageLibStore.init()
  }, [])
  return (
    <div
      css={css`
        .ant-table {
          height: 700px;
        }

        .ant-table-body {
        }
      `}
    >
      <div
        css={css`
          padding-bottom: 15px;
        `}
      >
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
      <Table
        rowKey="id"
        columns={columns({ deleteImage })}
        dataSource={data}
        loading={loading}
        scroll={{
          y: 700,
        }}
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
      <AddImageModal store={imageLibStore} />
    </div>
  )
}

ImageLib.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(ImageLib)
