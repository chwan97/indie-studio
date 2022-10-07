import React, { ReactElement, useEffect } from 'react'
import { Button, Form, Image, Switch, Modal, Table } from 'antd'
import { CloseSquareOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { observer, useLocalObservable } from 'mobx-react'
import dynamic from 'next/dynamic'

import { useMainStore } from 'hooks'
import CustomerStore from 'store/page/CustomerStore'
import AddStore from 'store/page/pick-task/AddStore'
import Layout from 'components/AdminLayout'
import ImageLibStore from 'store/page/ImageLibStore'
import ModalMode from 'constantx/ModalMode'

const BindCustomerModal = dynamic(() => import('../../components/BindCustomerModal'), {
  ssr: false,
})

const BindImagesModal = dynamic(() => import('../../components/BindImagesModal'), {
  ssr: false,
})

const SelectedImageModal = dynamic(() => import('../../components/SelectedImageModal'), {
  ssr: false,
})

function Add() {
  const router = useRouter()
  const mainStore = useMainStore()
  const customerStore = useLocalObservable(() => new CustomerStore(mainStore))
  const imageLibStore = useLocalObservable(() => new ImageLibStore(mainStore))
  const addStore = useLocalObservable(() => new AddStore(mainStore, customerStore, imageLibStore))
  useEffect(() => {
    if (router.query.id) {
      addStore.init(router.query.id as string)
    }
  }, [router.query])
  const {
    selectedImages,
    disable,
    customer,
    imageList,
    submitBtnLoading,
    mode,
    setDisable,
    changeCustomer,
    addImage,
    deleteImage,
    deleteSelectedImage,
    addSelectedImage,
    submit,
  } = addStore
  const { name, mail, address, contact } = customer || {}
  const isAdd = mode === ModalMode.add

  const imageListBuilder = (list: any[], deleteFn: any) => {
    return (
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {list.map((item, index) => {
          const { id, src } = item
          return (
            <div
              key={index}
              css={css`
                width: 85px;
                height: 85px;
                border: 1px solid #eaeaea;
                border-radius: 4px;
                position: relative;
                margin-bottom: 5px;
                margin-right: 5px;

                .ant-image {
                  width: 85px;
                  height: 85px;
                }
              `}
            >
              <Image
                css={css`
                  max-width: 100%;
                  max-height: 100%;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: unset;
                  height: unset;
                  vertical-align: unset;
                `}
                src={src}
                fallback="data:image/png;base64,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"
              ></Image>
              <div
                css={css`
                  position: absolute;
                  right: 0;
                  top: 0;
                  z-index: 1;
                  cursor: pointer;
                `}
              >
                <CloseSquareOutlined
                  style={{
                    fontSize: '20px',
                    color: '#b514b5',
                  }}
                  onClick={() => {
                    deleteFn(id)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <>
      <div>
        <Button
          css={css`
            padding-left: 0;
          `}
          type="link"
          onClick={() => {
            router.back()
          }}
        >
          回到选片任务列表
        </Button>
        <h2
          css={css`
            margin: 10px 0;
          `}
        >
          {isAdd ? '创建' : '编辑'}选片任务
        </h2>
        <div
          css={css`
            width: 900px;
            margin-top: 30px;
          `}
        >
          <Form
            {...{
              labelCol: { span: 4 },
              wrapperCol: { span: 20 },
            }}
            name="taskForm"
          >
            <Form.Item name="customer" label=" 客户" rules={[{ required: true }]}>
              <>
                {customer && (
                  <div
                    css={css`
                      width: 400px;
                      border: 1px solid #eaeaea;
                      padding: 7px;
                    `}
                  >
                    <div>姓名：{name}</div>
                    <div>邮箱：{mail}</div>
                    <div>地址：{address}</div>
                    <div>联系方式：{contact}</div>
                  </div>
                )}

                <div>
                  <Button
                    css={css`
                      padding-left: 0;
                    `}
                    type="link"
                    onClick={() => {
                      changeCustomer()
                    }}
                  >
                    {customer && '修改'}
                    {!customer && '添加'}
                  </Button>
                  <Button
                    css={css`
                      padding-left: 0;
                    `}
                    type="link"
                    onClick={() => {
                      router.push('/customer')
                    }}
                  >
                    去创建
                  </Button>
                </div>
              </>
            </Form.Item>
            <Form.Item name="totalImage" label="任务图片" rules={[{ required: true }]}>
              {imageListBuilder(imageList, deleteImage)}
              <div>
                <Button
                  css={css`
                    padding-left: 0;
                  `}
                  type="link"
                  onClick={() => {
                    addImage()
                  }}
                >
                  添加
                </Button>
                <Button
                  css={css`
                    padding-left: 0;
                  `}
                  type="link"
                  onClick={() => {
                    router.push('/image-lib')
                  }}
                >
                  去上传
                </Button>
              </div>
            </Form.Item>
            <Form.Item label="已选图片">
              {imageListBuilder(selectedImages, deleteSelectedImage)}
              <div>
                <Button
                  css={css`
                    padding-left: 0;
                  `}
                  type="link"
                  onClick={() => {
                    addSelectedImage()
                  }}
                >
                  添加
                </Button>
              </div>
            </Form.Item>
            <Form.Item label="是否已停用">
              <Switch
                checked={disable}
                onChange={val => {
                  setDisable(val)
                }}
              />
            </Form.Item>
          </Form>
          <div
            css={css`
              text-align: left;
            `}
          >
            <Button
              css={css`
                margin-left: 188px;
                margin-top: 62px;
              `}
              onClick={() => {
                Modal.confirm({
                  onOk: () => {
                    router.push('/pick-task')
                  },
                  cancelText: '取消',
                  okText: '确定',
                  content: `确定要退出${isAdd ? '创建' : '编辑'}吗？`,
                })
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              css={css`
                margin-left: 15px;
              `}
              loading={submitBtnLoading}
              onClick={submit}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
      <BindCustomerModal addStore={addStore} />
      <BindImagesModal addStore={addStore} />
      <SelectedImageModal addStore={addStore} />
    </>
  )
}

Add.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default observer(Add)
