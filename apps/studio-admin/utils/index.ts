import errorMsgToCN from 'constants/errorMsgMap'

export function getErrorTips(rawMsg: string) {
  let res = '账号密码错误'
  for (const [msg, cn] of errorMsgToCN) {
    if (msg.indexOf(rawMsg)) {
      res = cn
      break
    }
  }

  return res
}
