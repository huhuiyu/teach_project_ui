<template>
  <div>
    <div>{{ title }}</div>
    <div>
      <el-button @click="toRouteInfo">路由带参数跳转</el-button>
    </div>
  </div>
</template>
<script>
import logger from '../../js/logger'
let app
export default {
  data() {
    return {
      title: '路由测试页面',
    }
  },
  computed: {},
  methods: {
    toRouteInfo() {
      this.$router.push({
        path: '/test/route/id_123',
        query: {
          abc: '查询123',
          'page.pageSize': 5,
          'page.pageNumber': 2,
        },
        hash: 'abc',
      })
    },
  },
  created() {
    app = this
    logger.debug('页面标题：', app.title)
  },
}
</script>
