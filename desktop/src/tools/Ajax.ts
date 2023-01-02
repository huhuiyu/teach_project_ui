import AjaxConfig from '../entity/AjaxConfig'
import axios from 'axios'
import logger from './logger'
import dialogApi from './dialog'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILE_SIZE_MESSAGE = { code: 500, success: false, message: '上传文件大小不能超过' + MAX_FILE_SIZE / 1024 / 1024 + 'MB' }

class Ajax {
  // axios实例
  axiosInstance: any
  // 文件上传的axios实例
  axiosFileInstance: any
  // 发起请求前的处理函数，蚕食是AajxConfig
  before: any
  // 应答回来之后的处理函数，参数是应答服务端数据
  after: any
  constructor() {
    this.axiosInstance = axios.create()
    this.axiosFileInstance = axios.create()
  }

  upload(config: AjaxConfig, file: File) {
    // 保留原始参数对象
    config.paramObj = JSON.parse(JSON.stringify(config.param))
    let instance = this
    logger.debug('请求参数：', config)
    // 上传大小限制
    if (file.size > MAX_FILE_SIZE) {
      config.cb(MAX_FILE_SIZE_MESSAGE)
      return
    }
    // 前置处理
    instance.before(config)
    // 处理参数
    let formdata = new FormData()
    formdata.append('file', file)
    for (let key in config.paramObj) {
      formdata.append(key, config.paramObj[key])
    }
    // 处理请求类型
    config.method = 'POST'
    config.headers['Content-Type'] = 'multipart/form-data'
    let promise = this.axiosFileInstance({
      url: config.url,
      data: formdata,
      method: config.method,
      headers: config.headers,
    })
    if (config.returnPromise) {
      return promise
    }
    promise
      .then((resp: any) => {
        logger.debug('请求结果====>', resp)
        // 应答拦截处理
        instance.after(resp.data)
        // 错误自动弹框
        if (!config.handleMessage && !resp.data.success) {
          dialogApi.messageError(resp.data.message, { keepAliveOnHover: true, duration: 3000 })
        }
        // 应答回调处理
        config.cb(resp.data)
      })
      .catch((err: any) => {
        logger.error('请求错误====>', err)
        config.cb({ code: 500, success: false, message: '访问数据失败！', error: err })
      })
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
      headers: config.headers,
    })
    if (config.returnPromise) {
      return promise
    }
    promise
      .then((resp: any) => {
        logger.debug('请求结果====>', resp)
        // 应答拦截处理
        instance.after(resp.data)
        // 错误自动弹框
        if (!config.handleMessage && !resp.data.success) {
          dialogApi.messageError(resp.data.message, { keepAliveOnHover: true, duration: 3000 })
        }
        // 应答回调处理
        config.cb(resp.data)
      })
      .catch((err: any) => {
        logger.error('请求错误====>', err)
        config.cb({ code: 500, success: false, message: '访问数据失败！', error: err })
      })
  }
}

export default Ajax
