// 微信相关
class JsSignature {
  appId: string = ''
  signature: string = ''
  noncestr: string = ''
  jsapi_ticket: string = ''
  url: string = ''
  timestamp: number = 0
}

export { JsSignature as JsSignature }
export default JsSignature
