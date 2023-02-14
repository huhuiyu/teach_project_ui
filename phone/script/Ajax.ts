class Ajax {

	// 发起请求前的处理函数，参数是AajxConfig
	before: Function
	// 应答回来之后的处理函数，参数是应答服务端数据
	after: Function

	constructor(before: Function, after: Function) {
		this.before = before
		this.after = after
	}

	send(config: AjaxConfig) {
		let instance = this
		console.log('请求参数：', config)
		// 前置处理
		instance.before(config)
		console.log('请求参数处理结果：', config)
		uni.request({
			url: config.url,
			method: config.method,
			data: config.param,
			header: config.headers,
			success(resp: any) {
				console.log('ajax处理成功：', resp)
				instance.after(resp.data)
				config.cb(resp.data)
			}, fail(err: any) {
				console.log('ajax处理失败：', err)
				config.cb({ code: 500, success: false, message: '访问数据失败！', error: err })
			}
		})
	}
}

// ajax配置信息对象
class AjaxConfig {
	method: 'POST' | 'GET'
	url: string = ''
	param: any = {}
	cb: Function = () => { }
	headers: any = {}
	paramObj: any = {}
	constructor() { }

	static buildConfig(url: string, param: any, cb: Function, method: 'POST' | 'GET'): AjaxConfig {
		let config = new AjaxConfig()
		config.url = url
		config.param = param
		config.cb = cb
		config.method = method
		return config
	}

	static buildPostConfig(url: string, param: any, cb: Function): AjaxConfig {
		return this.buildConfig(url, param, cb, 'POST')
	}

	static buildGetConfig(url: string, param: any, cb: Function): AjaxConfig {
		return this.buildConfig(url, param, cb, 'GET')
	}

}

export { AjaxConfig as AjaxConfig, Ajax as Ajax }

export default Ajax