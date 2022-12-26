<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {
    // 用于flash.html加载页面
    this.$logger.debug('页面加载完成', top == window)
    if (top != window) {
      top.postMessage('loaded', '*')
    }
  },
}
</script>
<style>
@import 'css/common.css';
@import 'css/iconfont/iconfont.css';
</style>
