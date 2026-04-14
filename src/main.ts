import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 1. 先引入默认样式
import 'element-plus/dist/index.css'
// 2. 再引入暗黑模式变量（必须后引，覆盖规则）
import 'element-plus/theme-chalk/dark/css-vars.css'

import './assets/main.css'

import App from './App.vue'
import router from './router'
import scrollBar from './directives/scrollBar'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.directive('scrollBar', scrollBar)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
