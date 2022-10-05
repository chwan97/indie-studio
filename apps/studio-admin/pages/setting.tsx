import { Button, Modal, Form, Input } from 'antd'
import React, { ReactElement, useState } from 'react'
import Layout from 'components/AdminLayout'
import { css } from '@emotion/react'
import PasswordField from '../components/PasswordField'

export default function Setting() {
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
        用户名：的撒
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
        邮箱：sti2w23@qq.com
        <Button
          type="link"
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
        onOk={() => {}}
        onCancel={() => {
          setModalState({
            ...modalState,
            userNameModalVisible: false,
          })
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>当前用户名：长万 </p>
        <Form form={nameForm} name="nameForm" requiredMark={false} onFinish={() => {}}>
          <Form.Item name="note" label="新用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更改邮箱"
        open={mailModalVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalState({
            ...modalState,
            mailModalVisible: false,
          })
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>邮箱：sti2w23@qq.com</p>
        <Form form={mailForm} name="mailForm" requiredMark={false} onFinish={() => {}}>
          <Form.Item name="note" label="新邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更改密码"
        open={passwordModalVisible}
        onOk={() => {}}
        onCancel={() => {
          setModalState({
            ...modalState,
            passwordModalVisible: false,
          })
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form form={passwordForm} name="passwordForm" requiredMark={false} onFinish={() => {}}>
          <Form.Item name="note" label="旧密码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <PasswordField forModal />
        </Form>
      </Modal>
    </div>
  )
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
