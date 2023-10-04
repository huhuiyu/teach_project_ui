import { createApp } from 'vue'

import App from './App.vue'

// 路由配置导入
import { router } from './router/index'

// 饿了么ui导入
import 'element-plus/dist/index.css'

// 公用css
import './style/index.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
