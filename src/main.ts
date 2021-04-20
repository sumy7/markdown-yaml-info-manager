import * as Sentry from '@sentry/electron'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import SvgIcon from '@/components/SvgIcon.vue'
import './icons'

import '@/renderer/posts'

Sentry.init({ dsn: 'https://b7587371a60b4b4083eb19602f09f63c@o575054.ingest.sentry.io/5726826' })

const app = createApp(App).use(store).use(router)
app.component('svg-icon', SvgIcon)
app.mount('#app')
