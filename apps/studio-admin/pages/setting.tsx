import { Button, Modal, Form, Input, message } from 'antd'
import React, { ReactElement, useState } from 'react'
import { css } from '@emotion/react'
import { observer } from 'mobx-react'

import { useMainStore } from 'hooks'
import Layout from 'components/AdminLayout'
import PasswordField from 'components/PasswordField'

function Setting() {
  const mainStore = useMainStore()
  const [modalState, setModalState] = useState({
    userNameModalVisible: false,
    mailModalVisible: false,
    passwordModalVisible: false,
  })
  const { userNameModalVisible, mailModalVisible, passwordModalVisible } = modalState

  const [nameForm] = Form.useForm()
  const [mailForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  return (
    <div>
      <p>
        邮箱：{mainStore.userInfo?.email || '获取失败'}
        <Button
          type="link"
          css={css`
            display: none;
          `}
          onClick={() => {
            setModalState({
              ...modalState,
              mailModalVisible: true,
            })
          }}
        >
          更改
        </Button>
      </p>
      <p>
        用户名：{mainStore.userInfo?.user_metadata.name || 'admin-user'}
        <Button
          type="link"
          onClick={() => {
            setModalState({
              ...modalState,
              userNameModalVisible: true,
            })
          }}
        >
          更改
        </Button>
      </p>
      <p>
        密码：·················
        <Button
          type="link"
          onClick={() => {
            setModalState({
              ...modalState,
              passwordModalVisible: true,
            })
          }}
        >
          更改
        </Button>
      </p>
      <Modal
        title="更改用户名"
        open={userNameModalVisible}
        onOk={async () => {
          const values = await nameForm?.validateFields()
          const { userName } = values
          const { user, error } = await mainStore.supabase.auth.update({
            data: { name: userName },
          })
          if (error) {
            message.error('更新用户名失败.')
          } else {
            message.info('更新用户名成功.')
            if (user?.user_metadata.name) {
              mainStore.setName(user?.user_metadata.name)
            }
            setModalState({
              ...modalState,
              userNameModalVisible: false,
            })
            nameForm.resetFields()
          }
        }}
        onCancel={() => {
          setModalState({
            ...modalState,
            userNameModalVisible: false,
          })
          nameForm.resetFields()
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>当前用户名：{mainStore.userInfo?.user_metadata.name || 'admin-user'} </p>
        <Form form={nameForm} name="nameForm" requiredMark={false} onFinish={() => {}}>
          <Form.Item
            name="userName"
            label="新用户名"
            rules={[
              { required: true, message: '请输入名称用于显示！' },
              {
                type: 'string',
              },
              {
                max: 7,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更改邮箱"
        open={mailModalVisible}
        onOk={async () => {
          const values = await mailForm?.validateFields()
          console.log('values', values)
          const { mail } = values
          const { error: pError } = await mainStore.supabase.auth.update({
            email: mail,
          })
          if (pError) {
            message.error('更新邮箱失败.')
          } else {
            message.info('更新邮箱成功，检查你的目标邮箱点击确认邮件.')
            setModalState({
              ...modalState,
              mailModalVisible: false,
            })
            mailForm.resetFields()
          }
        }}
        onCancel={() => {
          setModalState({
            ...modalState,
            mailModalVisible: false,
          })
          mailForm.resetFields()
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>邮箱：{mainStore.userInfo?.email || '获取失败'}</p>
        <Form form={mailForm} name="mailForm" requiredMark={false}>
          <Form.Item
            name="mail"
            label="新邮箱"
            rules={[
              { required: true },
              {
                type: 'email',
                message: '请输入合法的邮箱',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更改密码"
        open={passwordModalVisible}
        onOk={async () => {
          const values = await passwordForm?.validateFields()
          console.log('values', values)
          const { password } = values
          const { error: pError } = await mainStore.supabase.auth.update({
            password: password,
          })
          if (pError) {
            message.error('更新密码失败.')
          } else {
            message.info('更新密码成功.')
            setModalState({
              ...modalState,
              passwordModalVisible: false,
            })
            passwordForm.resetFields()
          }
        }}
        onCancel={() => {
          setModalState({
            ...modalState,
            passwordModalVisible: false,
          })
          passwordForm.resetFields()
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          {...{
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
          }}
          form={passwordForm}
          name="passwordForm"
          requiredMark={false}
          onFinish={() => {}}
        >
          <PasswordField forModal />
        </Form>
      </Modal>
    </div>
  )
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Setting)
