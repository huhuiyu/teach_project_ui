import qs from 'qs'
import axios from 'axios'

import logger from '../js/logger'
import SparkMD5 from 'spark-md5'
import tools from '../js/tools'
import serverInfo from '../js/server'

import { MessageBox } from 'element-ui'
import AutoWebSocket from '../js/AutoWebSocket'

//服务器相关信息
let myplugin = {}
// websocket管理集合
let wsMap = new Map()

// 空函数
let empty = function () {}

// 文件约束
const MAX_FILE_SIZE = 2 * 1024 * 1024
const MAX_FILE_SIZE_MESSAGE = { code: 500, success: false, message: '上传文件大小不能超过2MB' }

myplugin.install = function (Vue) {
  // 将正则校验封装到插件
  Vue.prototype.$regValidate = function (rule, value, cb, reg, message) {
    logger.debug(rule)
    if (reg.test(value)) {
      cb()
    } else {
      cb(new Error(message))
    }
  }
  // md5加密
  Vue.prototype.$md5 = function (info) {
    return SparkMD5.hash(info)
  }
  // 日志对象
  Vue.prototype.$logger = logger
  // 服务器信息对象
  Vue.prototype.$serverInfo = serverInfo
  // ajax请求
  Vue.prototype.$ajax = function () {
    let instance = this
    // 动态参数的版本
    // 如果是一个参数的，参数格式是配置的json
    // {url:'',param:{},cb:function,method:'post',handleMessage:true}
    // 如果是三个参数，参数分别就是url,param,cb
    // 如果是四个参数，参数分别就是url,param,cb,method
    // 如果是五个参数，参数分别就是url,param,cb,method,handleMessage,
    let args = arguments
    instance.$logger.debug('ajax请求参数：', args)
    // 将多种不同参数模式都转换成json配置参数
    let config = {}
    if (args.length == 1) {
      config = args[0]
      config.method = config.method ? config.method : 'post'
      config.param = config.param ? config.param : {}
    } else if (args.length == 3) {
      config.method = 'post'
      config.url = args[0]
      config.param = args[1]
      config.cb = args[2]
      config.handleMessage = true
    } else if (args.length == 4) {
      config.method = args[3]
      config.url = args[0]
      config.param = args[1]
      config.cb = args[2]
      config.handleMessage = true
    } else if (args.length == 5) {
      config.handleMessage = args[4]
      config.method = args[3]
      config.url = args[0]
      config.param = args[1]
      config.cb = args[2]
    }
    // 补全url
    config.url = config.url ? serverInfo.serverUrl + config.url : serverInfo.serverUrl + ''
    // 回调参数处理
    config.cb = config.cb ? config.cb : empty
    //后端参数处理
    config.param = config.param ? config.param : {}
    // method默认是post
    config.method = config.method ? config.method : 'post'
    config.param.ts = new Date().getTime()
    // 转换参数
    config.param = qs.stringify(config.param, { allowDots: true })
    // 处理get请求（如果链接带有?查询参数就拼接&，否则就直接拼接查询参数）
    let getStr = config.url.indexOf('?') > -1 ? '&' : '?'
    if (config.method == 'get') {
      config.url = config.url + getStr + config.param
      config.param = ''
    }
    instance.$logger.debug('ajax请求最终参数：', config)
    // 发起请求
    axios({
      method: config.method,
      url: config.url,
      data: config.param,
      headers: {
        token: serverInfo.loadToken(),
      },
    })
      .then(function (resp) {
        instance.$logger.debug('ajax请求结果：', resp)
        // 保存token信息
        serverInfo.saveToken(resp)
        // 应答结果为错误且不需要处理的就直接弹出对话框
        if (!resp.data.success && !config.handleMessage) {
          MessageBox(resp.data.message, '请求数据发生错误', 'error')
          return
        }
        config.cb.call(instance, resp.data)
      })
      .catch(function (error) {
        instance.$logger.debug('ajax请求错误：', error)
        config.cb.call(instance, { code: 500, success: false, message: '访问数据失败！', error: error })
      })
  }
  // 文件上传
  Vue.prototype.$upload = function (url, param, file, callback) {
    if (file.size > MAX_FILE_SIZE) {
      callback(MAX_FILE_SIZE_MESSAGE)
      return
    }
    url = serverInfo.serverUrl + url
    callback = callback ? callback : function () {}
    let formdata = new FormData()
    formdata.append('file', file)
    // 需要转换多级json数据为一级的方法，需要判断数据是否为json的方法
    for (let key in param) {
      formdata.append(key, param[key])
    }
    let promise = axios({
      method: 'post',
      url: url,
      data: formdata,
      headers: {
        token: serverInfo.loadToken(),
        'Content-Type': 'multipart/form-data',
      },
    })
    promise
      .then(function (resp) {
        logger.debug('ajax应答结果：', resp.data)
        serverInfo.saveToken(resp.data)
        callback.call(serverInfo.app, resp.data)
      })
      .catch(function (error) {
        logger.debug('ajax处理发生错误：', error)
        callback.call(serverInfo.app, { code: 500, success: false, message: '访问数据失败！', error: error })
      })
  }
  // 获取下载地址的方法
  Vue.prototype.$getDownloadUrl = tools.getDownloadUrl
  // 打开文件
  Vue.prototype.$openFile = function (cb) {
    let instance = this
    tools.openFile(cb, instance)
  }
  // 获取文件信息
  Vue.prototype.$getFileInfo = tools.getFileInfo
  // 复制文件的方法
  Vue.prototype.$copyText = tools.copyText

  // websocket封装
  Vue.prototype.$ws = function (app) {
    if (wsMap.has(app)) {
      return wsMap.get(app)
    }
    const socket = new AutoWebSocket(serverInfo.websocketUrl + app)
    wsMap.set(app, socket)
    socket.connect()
    return socket
  }

  // 合并json对象
  Vue.prototype.$concatJson = function () {
    let json = {}
    for (let index = 0; index < arguments.length; index++) {
      const element = arguments[index]
      for (let key in element) {
        json[key] = element[key]
      }
    }
    return json
  }

  // 开发者key
  Vue.prototype.$getAccessKey = () => {
    return '76cb360d-256b-4660-8e13-ab4e3ae9f874'
  }
}

export default myplugin
