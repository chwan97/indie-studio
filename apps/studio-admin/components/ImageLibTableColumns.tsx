import { ColumnsType } from 'antd/es/table'
import { css } from '@emotion/react'
import { Button, Image, Space } from 'antd'
import { formatSize } from '../utils'
import dayjs from 'dayjs'
import React from 'react'

const columns: (option: any) => ColumnsType<any> = option => {
  const { deleteImage, compact = false } = option
  let ret = [
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
      render: (src: any) => (
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
      render: (size: any, { tags }: any) => <>{size && formatSize(size)}</>,
    },
    {
      title: '创建日期',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at: any, { tags }: any) => (
        <>{created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
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
  if (compact) {
    return ret.filter(item => item.key !== 'action' && item.key !== 'created_at')
  }
  return ret
}

export default columns
