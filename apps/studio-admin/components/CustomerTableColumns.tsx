import CustomerStore from 'store/page/CustomerStore'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { Button } from 'antd'
import { css } from '@emotion/react'
import React from 'react'
import { deleteCheck } from '../utils'

const columns: (customerStore: CustomerStore, options?: any) => ColumnsType<any> = (
  customerStore,
  options
) => {
  const { compact } = options || {
    compact: false,
  }
  let ret = [
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
      render: (created_at: any) => (
        <>{created_at && dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            css={css`
              padding-left: 0;
              padding-right: 5px;
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
            onClick={async () => {
              await deleteCheck()
              customerStore.deleted(record)
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ]
  if (compact) {
    ret = ret.filter(item => item.key !== 'action' && item.key !== 'created_at')
  }
  return ret
}

export default columns
