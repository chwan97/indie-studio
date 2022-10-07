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
    setDisable,
    changeCustomer,
    addImage,
    deleteImage,
    deleteSelectedImage,
    addSelectedImage,
    submit,
  } = addStore
  const { name, mail, address, contact } = customer || {}

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
          创建选片任务
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
                  content: '确定要退出创建吗？',
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
