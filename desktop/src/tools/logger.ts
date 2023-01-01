
// 日志对象，只有开发模式（development）下才输出debug信息
let logger = {
  debug(...args: any[]) {
    if (import.meta.env.DEV) {
      console.log.apply(this, args)
    }
  },
  info(...args: any[]) {
    console.info.apply(this, args)
  },
  error(...args: any[]) {
    console.error.apply(this, args)
  },
}

export default logger
