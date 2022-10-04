import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { message, Form, Upload, Modal, Button, Input } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import { observer } from 'mobx-react'
import { css } from '@emotion/react'
import { useState } from 'react'

import CustomerStore from 'store/page/CustomerStore'

function AddCustomerModal(props: { store: CustomerStore }) {
  const { store: customerStore } = props

  const { addModalVisible, toggleAddModalVisible } = customerStore
  const [form] = Form.useForm()

  return (
    <Modal
      title="新增客户"
      open={addModalVisible}
      onOk={() => {
        form.validateFields()
      }}
      onCancel={() => {
        toggleAddModalVisible(false)
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
        <Form.Item name="name" label="客户姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="mail" label="邮箱地址" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="联系地址">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="contact" label="联系方式">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(AddCustomerModal)
