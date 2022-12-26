/**
 * 工具类过滤器
 */
import Vue from 'vue'
import logger from '../js/logger'
import tools from '../js/tools'

// 文件大小的过滤器
Vue.filter('filesize', function (info) {
  logger.debug('in filesize====>', info)
  if (info === 0) {
    return '0 B'
  }
  let k = 1024
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], //单位值
    i = Math.floor(Math.log(info) / Math.log(k))
  return (info / Math.pow(k, i)).toPrecision(3) + '' + sizes[i]
})

// 日期格式化的过滤器
Vue.filter('formatDate', function (value, format) {
  logger.debug('in formatDate====>', value, format)
  return value ? tools.formatDate(value, format) : ''
})

// json格式化的过滤器
Vue.filter('formatJson', function (value) {
  let result = value ? tools.formatJson(value, true) : ''
  logger.debug('in formatJson====>', result)
  return result
})
