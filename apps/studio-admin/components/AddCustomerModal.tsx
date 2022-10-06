import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { message, Form, Upload, Modal, Button, Input } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import { observer } from 'mobx-react'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import CustomerStore from 'store/page/CustomerStore'
import ModalMode from 'constants/ModalMode'

function AddCustomerModal(props: { store: CustomerStore }) {
  const { store: customerStore } = props

  const { modelMode, addModalVisible, currentItem } = customerStore
  const [form] = Form.useForm()
  const isAdd = ModalMode.add === modelMode
  useEffect(() => {
    customerStore.setForm(form)
  }, [form])
  return (
    <Modal
      title={`${isAdd ? '创建' : '编辑'}客户信息`}
      open={addModalVisible}
      onOk={async () => {
        await customerStore.modalOKClick()
      }}
      onCancel={() => {
        customerStore.closeModal()
      }}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        }}
        name="customerForm"
        onFinish={() => {}}
      >
        <Form.Item
          name="name"
          label="客户姓名"
          rules={[
            { required: true },
            {
              type: 'string',
            },
            {
              max: 20,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mail"
          label="邮箱地址"
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
        <Form.Item
          name="address"
          label="联系地址"
          rules={[
            {
              type: 'string',
            },
            {
              max: 100,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="contact"
          label="联系方式"
          rules={[
            {
              type: 'string',
            },
            {
              max: 50,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(AddCustomerModal)
