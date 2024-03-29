import Ajax from './Ajax'
import AjaxConfig from '../entity/AjaxConfig'
import qs from 'qs'
import logger from './logger'
import BaseResult from '../entity/BaseResult'

let serverInfo = {
  url: 'https://service.huhuiyu.top',
  websocket: 'wss://service.huhuiyu.top/ws/',
  tokenKey: 'teach_project_service_token',
  counterKey: 'teach_project_service_counter',
  counterMessageKey: 'teach_project_service_counter',
  accessKey: '18c4e6cf-e54b-4e64-a764-c3fdd15226f8',
  ossUrl: 'https://service.huhuiyu.top/oss/ossinfo/openOssFile?oiid=',
  saveToken: (data: BaseResult) => {
    if (data && data.token) {
      localStorage.setItem(serverInfo.tokenKey, data.token)
    }
  },
  loadToken() {
    let token = localStorage.getItem(serverInfo.tokenKey)
    return token ? token : ''
  },
}

// 通过环境变量切换服务地址
if ('/local_teach_project_ui/' == import.meta.env.BASE_URL) {
  serverInfo.url = 'http://127.0.0.1:30000'
  serverInfo.websocket = 'ws://127.0.0.1:30000/ws/'
} else if ('/frp_teach_project_ui/' == import.meta.env.BASE_URL) {
  serverInfo.url = 'https://local.huhuiyu.top'
  serverInfo.websocket = 'ws://local.huhuiyu.top/ws/'
}

logger.debug('服务器地址信息：', serverInfo.url, serverInfo.websocket)

// 创建ajax实例
const ajax = new Ajax()
// 前置函数
ajax.before = (config: AjaxConfig) => {
  // 请求地址补全
  config.url = serverInfo.url + config.url
  // 处理json参数
  config.param = qs.stringify(config.param, { allowDots: true })
  // 处理get请求（如果链接带有?查询参数就拼接&，否则就直接拼接查询参数）
  let getStr = config.url.indexOf('?') > -1 ? '&' : '?'
  if (config.method.toLowerCase() == 'get') {
    config.url = config.url + getStr + config.param
    config.param = ''
  }

  // 处理token头信息
  let headers = config.headers ? config.headers : {}
  headers.token = serverInfo.loadToken()
  config.headers = headers
}

// 应答函数
ajax.after = (data: any) => {
  serverInfo.saveToken(data)
}

const server = {
  post: (url: string, param: any, cb: any, handleMessage = false) => {
    ajax.send(AjaxConfig.buildPostConfig(url, param, cb, handleMessage))
  },
  get: (url: string, param: any, cb: any, handleMessage = false) => {
    ajax.send(AjaxConfig.buildGetConfig(url, param, cb, handleMessage))
  },
  upload: (url: string, file: File, param: any, cb: any, handleMessage = false) => {
    let config = AjaxConfig.buildPostConfig(url, param, cb, handleMessage)
    ajax.upload(config, file)
  },
  // 获取文件下载地址
  getDownloadUrl: (fid: number | string) => {
    return serverInfo.url + `/user/file/download?fid=${fid}`
  },
  // 是否为文件下载地址，如果是返回fid信息，否则返回-1
  isDownloadUrl: (url: string) => {
    const baseUrl = serverInfo.url + '/user/file/download?fid='
    let index = url.indexOf(baseUrl)
    if (index == 0) {
      return url.replace(baseUrl, '')
    } else {
      return -1
    }
  },
}

export { server as server, serverInfo as serverInfo }

export default server
