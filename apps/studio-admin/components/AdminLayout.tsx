import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import {
  FolderOpenOutlined,
  BarsOutlined,
  SettingOutlined,
  LoginOutlined,
  BlockOutlined,
} from '@ant-design/icons'
import { css } from '@emotion/react'
import { Layout, Menu, Button, Dropdown } from 'antd'
import Brand from 'components/Brand'

const { Header, Content, Footer, Sider } = Layout

interface Props {
  children: ReactNode
}

const menuItems = [
  {
    icon: <FolderOpenOutlined />,
    label: '图片库',
    key: 'image-lib',
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

export default function AdminLayout({ children }: Props) {
  const router = useRouter()

  return (
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Sider
        theme="light"
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <Brand compact />
        <Menu
          mode="inline"
          defaultSelectedKeys={['image-lib']}
          items={menuItems}
          onClick={item => {
            const { key } = item
            if (!key) return
            router.push(`/${key}`)
          }}
        />
        <div
          css={css`
            position: absolute;
            width: 100%;
            bottom: 0;
            padding: 8px 0;
            border-top: 1px solid #eaeaea;
            display: flex;
            align-content: center;
          `}
        >
          <div
            css={css`
              margin-left: 24px;
              width: 150px;
              text-align: left;
              font-size: 16px;
              line-height: 30px;
              padding: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            `}
          >
            长万长万长万长万长万长万
          </div>
          <Button
            css={css`
              margin-left: auto;
              margin-right: 24px;
            `}
            type="link"
            shape="circle"
            icon={<LoginOutlined />}
          />
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
