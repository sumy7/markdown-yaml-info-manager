import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Welcome from '@/views/Welcome.vue'
import Workspace from '@/views/Workspace.vue'
import store from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Workspace',
    component: Workspace,
    beforeEnter: (to, from, next) => {
      // 判断是否已经选择了文件根路径
      if (store.state.rootPath === '') {
        // 没有选择则要去选择
        next({
          path: '/selectPath'
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/selectPath',
    name: 'Welcome',
    component: Welcome
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
