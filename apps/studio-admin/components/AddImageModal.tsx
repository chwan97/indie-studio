import { css } from '@emotion/react'
import { message, Form, Upload, Modal, Button } from 'antd'
import { useState } from 'react'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { observer } from 'mobx-react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import ImageLibStore from 'store/page/ImageLibStore'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只支持 PNG、IMG格式!')
  }
  const isLt3M = file.size / 1024 / 1024 < 3
  if (!isLt3M) {
    message.error('图片大小不能超过 3MB!')
  }
  return isJpgOrPng && isLt3M
}

function AddImageModal(props: { store: ImageLibStore }) {
  const { store: imageLibStore } = props
  const [imageUrl, setImageUrl] = useState<string>()
  const [loading, setLoading] = useState(false)

  const { addModalVisible, toggleAddModalVisible } = imageLibStore
  const [form] = Form.useForm()

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    console.log(info)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false)
        toggleAddModalVisible(false)
        message.info('新的图片创建成功!')
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  return (
    <Modal
      transitionName=""
      maskTransitionName=""
      title="上传图片"
      destroyOnClose
      open={addModalVisible}
      footer={
        <Button
          onClick={() => {
            toggleAddModalVisible(false)
          }}
        >
          取消
        </Button>
      }
      closable={false}
    >
      <div
        css={css`
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;

          .ant-upload-picture-card-wrapper {
            width: unset;
          }
        `}
      >
        <Upload
          name="image-upload"
          listType="picture-card"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </div>
    </Modal>
  )
}

export default observer(AddImageModal)
