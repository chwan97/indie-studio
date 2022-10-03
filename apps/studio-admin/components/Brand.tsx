import { css } from '@emotion/react'

export default function Brand(props: { compact?: boolean }) {
  const { compact = false } = props
  return (
    <div
      css={css`
        font-size: 25px;
        text-align: center;
        margin-bottom: ${compact ? 0 : '30px'};
        user-select: none;
      `}
    >
      <img
        css={css`
          width: ${compact ? '40px' : '70px'};
        `}
        src="/favicon.png"
      />
      <div>Indie Studio</div>
    </div>
  )
}
