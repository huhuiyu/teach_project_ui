<template>
  <div>
    <div>{{ title }}</div>
    <div>
      {{ info }}
      <br />
      {{ query }}
      <br />
      {{ hash }}
    </div>
  </div>
</template>
<script>
import logger from '../../js/logger'
let app
export default {
  data() {
    return {
      title: '路由信息页面',
      info: {},
      query: '',
      hash: '',
    }
  },
  computed: {},
  methods: {},
  created() {
    app = this
    logger.debug('页面标题：', app.title)
    logger.debug(this.$route.params, this.$route.hash, this.$route.query)
    app.info = this.$route.params.info
    app.query = this.$route.query
    app.hash = this.$route.hash
  },
}
</script>
