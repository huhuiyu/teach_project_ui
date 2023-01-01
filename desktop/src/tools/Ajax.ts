import AjaxConfig from "../entity/AjaxConfig"
import axios from 'axios'
import logger from "./logger"

class Ajax {
  // axios实例
  axiosInstance: any
  // 发起请求前的处理函数，蚕食是AajxConfig
  before: any
  // 应答回来之后的处理函数，参数是应答服务端数据
  after: any
  constructor() {
    this.axiosInstance = axios.create()
  }

  send(config: AjaxConfig) {
    let instance = this
    logger.debug('请求参数：', config)
    // 前置处理
    instance.before(config)
    let promise = this.axiosInstance({
      url: config.url,
      data: config.param,
      method: config.method,
      headers: config.headers
    })
    if (config.returnPromise) {
      return promise
    }
    promise.then((resp: any) => {
      logger.debug('请求结果====>', resp)
      // 应答拦截处理
      instance.after(resp.data)
      // 应答回调处理
      config.cb(resp.data);
    }).catch((err: any) => {
      logger.error('请求错误====>', err)
      config.cb({ code: 500, success: false, message: '访问数据失败！', error: err })
    })
  }

}

export default Ajax