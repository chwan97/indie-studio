import React from 'react'
import {
  BarsOutlined,
  BlockOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

export const adminRouter = [
  {
    icon: <FolderOpenOutlined />,
    label: '图片库',
    key: 'image-lib',
  },
  {
    icon: <UserOutlined />,
    label: '客户资料',
    key: 'customer',
  },

  {
    icon: <BlockOutlined />,
    label: '选片任务',
    key: 'pick-task',
  },
  {
    icon: <BarsOutlined />,
    label: '操作日志',
    key: 'opt-log',
  },
  {
    icon: <SettingOutlined />,
    label: '用户设置',
    key: 'setting',
  },
]
