import './assets/main.scss'

import App from './App.vue'
import router from '@/router'//导入router文件夹，他会自动找到index.js文件
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
//导入持久化插件pinia-persist
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'

const pinia = createPinia()
const persiste=createPersistedState()
const app = createApp(App)
app.use(router)
app.use(ElementPlus,{locale})
app.use(pinia)
pinia.use(persiste)
app.mount('#app')
