import { css } from '@emotion/react'
import { Form, Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal/Modal'

export default function FiledModal(props: ModalProps) {
  const { onOk, onCancel, children, ...rest } = props
  const [form] = Form.useForm()

  return (
    <Modal
      {...rest}
      onOk={async e => {
        try {
          const value = await form.validateFields()
          onOk?.(e)
          onCancel?.(e)
        } catch (e) {}
      }}
    >
      <Form form={form} name="control-hooks" requiredMark={false} onFinish={() => {}}>
        {children}
      </Form>
    </Modal>
  )
}
