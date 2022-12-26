import logger from './logger'

/**
 * 时间戳回应信息
 */
const TIMESTAMP_RESPONSE = 'teach_project_service_timestamp'
/**
 * 自动重连的websocket对象
 */
class AutoWebSocket {
  /**
   * @param {string} url websocket服务器地址
   */
  constructor(url) {
    this.destroyed = false
    // 是否已经链接到服务器
    this.isConnect = false
    // websocket服务器地址
    this.url = url
    // 监听器列表
    this.listeners = new Map()
    // 重连计时器
    this.timer
  }

  /**
   * 断开连接
   */
  disconnet() {
    logger.debug('断开websocket服务器')
    this.destroyed = true
    if (this.ws) {
      this.ws.close()
    }
    // 中断计时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.ws = null
    this.isConnect = false
  }

  /**
   * 连接服务器
   */
  connect() {
    let me = this
    logger.debug('连接websocket服务器')
    me.destroyed = false
    if (me.ws) {
      return
    }
    me.ws = new WebSocket(me.url)
    // 成功连接
    me.ws.onopen = function (event) {
      logger.debug('websocket服务器 onopen:', event)
      // 标记为已经连接
      me.isConnect = true
      // 中断计时器
      if (me.timer) {
        clearInterval(me.timer)
        me.timer = null
      }
      // 广播open事件
      if (me.listeners.has('open')) {
        let eventSet = me.listeners.get('open')
        eventSet.forEach((fun) => {
          fun(event)
        })
      }
    }
    // 连接断开
    me.ws.onclose = function (event) {
      logger.debug('websocket服务器 onclose:', event)
      // 标记为已经断开
      me.isConnect = false
      // 广播关闭事件
      if (me.listeners.has('close')) {
        let eventSet = me.listeners.get('close')
        eventSet.forEach((fun) => {
          fun(event)
        })
      }
      // 重置ws
      me.ws = null
      if (me.destroyed) {
        // 销毁状态就无需重连
        return
      }
      // 启动重连
      me.timer = setTimeout(function () {
        me.connect()
      }, 10 * 1000)
    }
    // 收到消息
    me.ws.onmessage = function (event) {
      logger.debug('websocket服务器 onmessage:', event)
      let data = JSON.parse(event.data)
      // 时间戳只需要回应即可，不需要处理（类似于心跳应答）
      if (data.type == 'timestamp') {
        logger.debug('收到时间戳信息自动回应')
        me.ws.send(TIMESTAMP_RESPONSE)
        return
      }
      // 广播消息事件
      if (me.listeners.has('message')) {
        let eventSet = me.listeners.get('message')
        eventSet.forEach((fun) => {
          fun(JSON.parse(event.data))
        })
      }
    }
    // 发生错误
    me.ws.onerror = function (event) {
      logger.debug('websocket服务器 onerror:', event)
      // 广播错误事件
      if (me.listeners.has('error')) {
        let eventSet = me.listeners.get('error')
        eventSet.forEach((fun) => {
          fun(event)
        })
      }
    }
  }

  /**
   * 添加监听器，监听的事件名称只有四个open(连接成功时),message(收到消息)，close(连接被关闭)，error(连接发生错误),回调的function带有事件信息参数
   *
   * @param {string} name 监听的事件名称
   * @param {function} listener 事件处理函数
   */
  addListener(name, listener) {
    let listenerSet
    if (this.listeners.has(name)) {
      listenerSet = this.listeners.get(name)
    } else {
      listenerSet = new Set()
      this.listeners.set(name, listenerSet)
    }
    listenerSet.add(listener)
  }
  /**
   * 移除指定的监听器，监听的事件名称只有四个open(连接成功时),message(收到消息)，close(连接被关闭)，error(连接发生错误)
   * @param {string} name 监听的事件名称
   * @param {function} listener 事件处理函数
   */
  removeListener(name, listener) {
    let listenerSet
    if (!this.listeners.has(name)) {
      return
    }
    listenerSet = this.listeners.get(name)
    listenerSet.delete(listener)
  }
  /**
   * 发送消息到服务器
   * @param {string|json} message 发送的消息
   */
  send(message) {
    let me = this
    if (!me.isConnect || !me.ws) {
      return
    }
    if (typeof message === 'string') {
      me.ws.send(message)
    } else {
      me.ws.send(JSON.stringify(message))
    }
  }
}

export default AutoWebSocket
