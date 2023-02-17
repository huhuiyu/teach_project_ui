import qs from 'qs'
import { Ajax, AjaxConfig } from './Ajax'

import { BaseResult } from './entity/BaseResult'

let serverInfo = {
	url: 'https://service.huhuiyu.top/teach_project_service',
	websocket: 'wss://service.huhuiyu.top/teach_project_service/ws/',
	tokenKey: 'teach_project_service_token',
	counterKey: 'teach_project_service_counter',
	counterMessageKey: 'teach_project_service_counter',
	accessKey: '18c4e6cf-e54b-4e64-a764-c3fdd15226f8',
	saveToken: (data: BaseResult) => {
		if (data && data.token) {
			uni.setStorageSync(serverInfo.tokenKey, data.token)
		}
	},
	loadToken() {
		let token = uni.getStorageSync(serverInfo.tokenKey)
		return token ? token : ''
	},
}


// 创建ajax实例
const ajax = new Ajax(() => { }, () => { })

// 前置函数
ajax.before = (config: AjaxConfig) => {
	// 请求地址补全
	config.url = serverInfo.url + config.url
	// 处理json参数
	config.param = qs.stringify(config.param, { allowDots: true })
	// 处理get请求（如果链接带有?查询参数就拼接&，否则就直接拼接查询参数）
	let getStr = config.url.indexOf('?') > -1 ? '&' : '?'
	if (config.method == 'GET') {
		config.url = config.url + getStr + config.param
		config.param = ''
	}
	// 处理token头信息
	let headers = config.headers ? config.headers : {}
	headers.token = serverInfo.loadToken()
	headers['Content-Type'] = "application/x-www-form-urlencoded"
	config.headers = headers
}

ajax.after = (data: BaseResult | any) => {
	serverInfo.saveToken(data)
}

const server = {
	post: (url: string, param: any, cb: Function) => {
		ajax.send(AjaxConfig.buildPostConfig(url, param, cb))
	},
	get: (url: string, param: any, cb: Function) => {
		ajax.send(AjaxConfig.buildGetConfig(url, param, cb))
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