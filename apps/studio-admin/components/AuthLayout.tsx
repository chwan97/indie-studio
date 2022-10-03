import React, { ReactNode } from 'react'
import { css } from '@emotion/react'
import Brand from './Brand'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div
      css={css`
        margin: 0 auto;
        padding: 150px 0;
        user-select: none;
      `}
    >
      <Brand />
      {children}
    </div>
  )
}
