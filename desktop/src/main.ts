import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
const pinia = createPinia()

import './css/index.css'
import './css/iconfont/iconfont.css'

const app = createApp(App)
app.use(router)
app.use(pinia)

app.mount('#app')
