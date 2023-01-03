import AutoWebSocket from './AutoWebSocket'
import logger from './logger'
import { serverInfo } from './server'

const empty = (info: any = '') => {}

// 创建soket
const socket = new AutoWebSocket(serverInfo.websocket + 'chat')
logger.debug('创建聊天websocket')

/**
 * 聊天服务
 */
const chat_service = {
  // ws原始事件
  onopen: empty,
  onclose: empty,
  onmessage: empty,
  // 聊天事件
  onjoin: empty,
  onleave: empty,
  onquery: empty,
  oninfo: empty,
  // 设置事件监听回调方法
  setOnOpen: (cb = empty) => {
    chat_service.onopen = cb
  },
  setOnClose: (cb = empty) => {
    chat_service.onclose = cb
  },
  setOnMessage: (cb = empty) => {
    chat_service.onmessage = cb
  },
  // 设置聊天事件监听回调方法
  setOnJoin: (cb = empty) => {
    chat_service.onjoin = cb
  },
  setOnLeave: (cb = empty) => {
    chat_service.onleave = cb
  },
  setOnQuery: (cb = empty) => {
    chat_service.onquery = cb
  },
  setOnInfo: (cb = empty) => {
    chat_service.oninfo = cb
  },
  disconnect: () => {
    socket.disconnet()
  },
  connect: () => {
    socket.connect()
  },
  join: () => {
    // 加入聊天室
    socket.send({
      token: serverInfo.loadToken(),
      action: '/chat/join',
    })
  },
  query: () => {
    // 加入聊天室
    socket.send({
      token: serverInfo.loadToken(),
      action: '/chat/query',
    })
  },
  leave: () => {
    // 离开聊天室
    socket.send({
      token: serverInfo.loadToken(),
      action: '/chat/leave',
    })
  },
  sendMessage: (message: any) => {
    // 发送聊天信息
    socket.send({
      token: serverInfo.loadToken(),
      action: '/chat/message',
      info: message,
    })
  },
  isConnected: () => {
    return socket.isConnect
  },
}

socket.addListener('open', (event: any) => {
  logger.debug('连接服务器成功： ', event)
  chat_service.onopen(event)
  // 连接就发送加入聊天室请求
  chat_service.join()
})
socket.addListener('close', (event: any) => {
  logger.debug('服务器已经断开： ', event)
  chat_service.onclose(event)
})
socket.addListener('message', (event: any) => {
  logger.debug('收到服务器消息message=====>', event.message)
  // 分类处理细节事件
  if (event.success && '/chat/join' == event.message.action) {
    chat_service.onjoin({
      username: event.message.user.username,
      nickname: event.message.user.nickname,
      groupName: event.message.group.groupName,
      createDate: new Date(),
    })
  }
  if (event.success && '/chat/query' == event.message.action) {
    let list = event.message.list.map((d: any) => {
      return {
        username: d.user.username,
        nickname: d.user.nickname,
        groupName: d.group.groupName,
        createDate: d.createDate,
        info: d.info,
      }
    })
    chat_service.onquery(list)
  }
  if (event.success && '/chat/leave' == event.message.action) {
    chat_service.onleave({
      username: event.message.user.username,
      nickname: event.message.user.nickname,
      groupName: event.message.group.groupName,
      createDate: new Date(),
    })
  }
  if (event.success && '/chat/message' == event.message.action) {
    chat_service.oninfo({
      username: event.message.user.username,
      nickname: event.message.user.nickname,
      groupName: event.message.group.groupName,
      createDate: event.message.createDate,
      info: event.message.info,
    })
  }

  chat_service.onmessage(event)
})

export default chat_service
