<template>
  <div class="title">
    <div @click="goBack">
      <i class="iconfont">&#xe615;</i>
    </div>
    <div>
      <slot></slot>
    </div>
    <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
  </div>
</template>
<script>
import logger from '../js/logger'
let app
export default {
  data() {
    return {
      title: '模板页面',
    }
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
  created() {
    app = this
    logger.debug('页面标题：', app.title)
  },
}
</script>
<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  color: #fff;
  background-color: #1989fa;
}
</style>
