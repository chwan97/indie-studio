import errorMsgToCN from 'constantx/errorMsgMap'

export function getErrorTips(rawMsg: string) {
  let res = '账号密码错误'
  for (const [msg, cn] of errorMsgToCN) {
    if (msg.indexOf(rawMsg) !== -1) {
      res = cn
      break
    }
  }

  return res
}

export function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.floor(size / 1024)} KB`
  return `${Math.floor(size / (1024 * 1024))} MB`
}
