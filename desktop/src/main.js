import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './filters/tools'

// 自定义插件
import myplugins from './plugins/myplugins'

Vue.use(ElementUI)
Vue.use(myplugins)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
