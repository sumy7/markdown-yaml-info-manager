import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import SvgIcon from '@/components/SvgIcon.vue'
import './icons'

import '@/renderer/posts'

const app = createApp(App).use(store).use(router)
app.component('svg-icon', SvgIcon)
app.mount('#app')
