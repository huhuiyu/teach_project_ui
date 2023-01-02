import { createDiscreteApi } from 'naive-ui'

const { loadingBar, dialog, notification, message } = createDiscreteApi(['loadingBar', 'dialog', 'notification', 'message'])

let dialogApi = {
  // loading相关
  startLoading: loadingBar.start,
  finishLoading: loadingBar.finish,
  showSuccess: dialog.success,
  // dialog相关
  destroyAllDialog: dialog.destroyAll,
  showInfo: dialog.info,
  showError: dialog.error,
  showWarning: dialog.warning,
  // notification相关
  destroyAllNotify: notification.destroyAll,
  notifyInfo: notification.info,
  notifyError: notification.error,
  notifyWarning: notification.warning,
  // message相关
  destroyAllMessage: message.destroyAll,
  messageInfo: message.info,
  messageError: message.error,
  messageWarning: message.warning,
}

export default dialogApi
