import Head from 'next/head'
import React from 'react'
import { css } from '@emotion/react'

export default function Index() {
  return (
    <div
      css={css`
        color: #3f3f3f;
      `}
    >
      <Head>
        <title>Indie Studio - 加速独立摄影师交付</title>
        <meta name="robots" content="follow, index" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link href="/favicon.ico" />
      </Head>
      <div>
        <nav
          css={css`
            width: 1080px;
            height: 36px;
            margin: 26px auto;
            display: flex;
            align-items: center;
            user-select: none;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              font-size: 22px;
            `}
          >
            <img
              css={css`
                width: 40px;
              `}
              src="/favicon.png"
            />
            <span
              css={css`
                color: #000000;
                font-weight: 500;
              `}
            >
              ndie Studio
            </span>
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://studio-admin.netlify.app/login"
            css={css`
              margin-left: auto;
              text-decoration: none;
              color: #3b426b;
              font-weight: 500;
            `}
          >
            后台登录
          </a>
        </nav>
      </div>
      <div
        css={css`
          width: 1080px;
          height: 36px;
          margin: 0 auto;
        `}
      >
        <div
          css={css`
            font-size: 16px;
          `}
        >
          <div
            css={css`
              font-weight: 500;
              font-size: 45px;
              margin-top: 180px;
            `}
          >
            Indie Studio
          </div>
          <div
            css={css`
              margin-top: 50px;
              font-size: 25px;
            `}
          >
            <p>为独立摄影师制作的网站应用，用于简化照片交付流程。</p>
            <p>
              web application for Independent photographers, <br />
              make photo delivery easy.
            </p>
          </div>
        </div>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=chwan97&repo=indie-studio&type=star&count=false&size=large"
          frameBorder="0"
          scrolling="0"
          width="170"
          height="30"
          title="GitHub"
        ></iframe>
        <div
          css={css`
            margin-top: 80px;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              color: #5c5c5c;

              .card {
                width: 300px;
                border-right: 1px solid #eaeaea;
                text-align: center;
                font-size: 16px;
                font-weight: 400;
              }

              .card:last-child {
                border-right: none;
              }

              .card div {
                margin-bottom: 15px;
                height: 60px;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
              }

              .card div.title {
                font-weight: 500;
                font-size: 20px;
                line-height: 18px;
              }
            `}
          >
            <div className="card">
              <div className="title">图片仓库</div>
              <div>上传你的图片，云端存储，随处访问。</div>
            </div>
            <div className="card">
              <div className="title">客户资料</div>
              <div>记录客户资料，在线检索，永不丢失。</div>
            </div>
            <div className="card">
              <div className="title">选片交付</div>
              <div>邀请客户挑选照片，快速方便。</div>
            </div>
          </div>
        </div>
        <div
          css={css`
            margin-top: 50px;
            border-top: 1px solid #eee;
            text-align: center;
          `}
        >
          <p>
            Copyright at <a href="https://chwan.cc">@chwan</a>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
