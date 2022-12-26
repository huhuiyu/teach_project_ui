// 日志对象，只有开发模式（development）下才输出debug信息
let env = process.env.NODE_ENV
let logger = function () {}

logger.debug = function () {
  if (env === 'development') {
    console.log.apply(this, arguments)
  }
}

logger.info = function () {
  console.info.apply(this, arguments)
}

logger.error = function () {
  console.error.apply(this, arguments)
}

export default logger
