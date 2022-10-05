import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoginOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Layout, Menu, Button, Modal } from 'antd'
import Brand from 'components/Brand'
import { adminRouter as menuItems } from 'constants/router'
import Loading from './LoadingForAdmin'
import { useMainStore } from 'hooks'
import { observer } from 'mobx-react'

const { Content, Sider } = Layout

interface Props {
  children: ReactNode
}

function AdminLayout({ children }: Props) {
  const router = useRouter()
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const mainStore = useMainStore()
  useEffect(() => {
    mainStore.checkAuth()
    const handleComplete = (url: string) => {
      mainStore.checkAuth(url)
    }

    router.events.on('routeChangeComplete', handleComplete)
    return () => {
      router.events.off('routeChangeComplete', handleComplete)
    }
  }, [])

  return (
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Sider theme="light">
        <Brand compact />
        <Menu
          mode="inline"
          defaultSelectedKeys={[router.pathname.replace('/', '')]}
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
            {mainStore.userInfo?.user_metadata.name || 'admin-user'}
          </div>
          <Button
            css={css`
              margin-left: auto;
              margin-right: 24px;
            `}
            type="link"
            shape="circle"
            icon={<LoginOutlined />}
            onClick={() => {
              setLogoutModalVisible(true)
            }}
          />
        </div>
      </Sider>
      <Layout>
        <Content
          css={css`
            margin: 24px 16px;
            background-color: white;
          `}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
              minWidth: 1100,
              height: '100%',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <Loading />
            {children}
            <Modal
              centered
              title=""
              open={logoutModalVisible}
              onOk={() => {
                mainStore.auth.logout()
              }}
              onCancel={() => {
                setLogoutModalVisible(false)
              }}
              okText="退出登录"
              cancelText="取消"
            >
              您确定要退出登录吗？
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default observer(AdminLayout)
