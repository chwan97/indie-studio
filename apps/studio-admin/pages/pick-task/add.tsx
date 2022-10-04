import { ReactElement } from 'react'
import Layout from 'components/AdminLayout'
import { Space, Table, Tag, Button, Form, Image, Switch } from 'antd'
import { CloseSquareOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

export default function Index() {
  const [form] = Form.useForm()
  const router = useRouter()

  return (
    <div>
      <Button
        css={css`
          padding-left: 0;
        `}
        type="link"
        onClick={() => {
          router.push('/pick-task')
        }}
      >
        回到选片任务列表
      </Button>
      <h2
        css={css`
          margin: 10px 0;
        `}
      >
        新建选片任务
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
          form={form}
          name="taskForm"
          onFinish={() => {}}
        >
          <Form.Item name="customer" label=" 客户" rules={[{ required: true }]}>
            <div
              css={css`
                width: 400px;
                border: 1px solid #eaeaea;
                padding: 7px;
              `}
            >
              <div>姓名：万物复苏</div>
              <div>邮箱：839821646@cw.com</div>
              <div>地址：和对手斯卡湿湿的和对手斯卡湿湿的和对手斯卡湿湿的和对手斯卡湿湿的</div>
              <div>联系方式：287317245（wx）</div>
            </div>
            <div>
              <Button
                css={css`
                  padding-left: 0;
                `}
                type="link"
                onClick={() => {}}
              >
                修改
              </Button>
              <Button
                css={css`
                  padding-left: 0;
                `}
                type="link"
                onClick={() => {}}
              >
                去创建
              </Button>
            </div>
          </Form.Item>
          <Form.Item name="all" label="任务图片" rules={[{ required: true }]}>
            <div
              css={css`
                display: flex;
                flex-wrap: wrap;
              `}
            >
              {new Array(20).fill('').map(() => {
                return (
                  <div
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
                      src="https://img1.doubanio.com/dae/niffler/niffler/images/33ecc2ae-17c2-11ed-a6d2-cac96ed0deb7.png"
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
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div>
              <Button
                css={css`
                  padding-left: 0;
                `}
                type="link"
                onClick={() => {}}
              >
                新增
              </Button>{' '}
              <Button
                css={css`
                  padding-left: 0;
                `}
                type="link"
                onClick={() => {}}
              >
                去上传
              </Button>
            </div>
          </Form.Item>
          <Form.Item name="select" label="已选图片" rules={[{ required: true }]}>
            <div></div>
            <div>
              <Button
                css={css`
                  padding-left: 0;
                `}
                type="link"
                onClick={() => {}}
              >
                新增
              </Button>
            </div>
          </Form.Item>
          <Form.Item name="disable" label="是否已停用" rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
        </Form>
        <div
          css={css`
            text-align: center;
          `}
        >
          <Button
            onClick={() => {
              router.push('/pick-task')
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            css={css`
              margin-left: 15px;
            `}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
