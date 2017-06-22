import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/files',
      name: 'file-list-page',
      component: require('@/components/FileListingPage')
    },
    {
      path: '/files/categories',
      name: 'file-categories-page',
      component: require('@/components/CategoriesPage')
    },
    {
      path: '/files/tags',
      name: 'file-tags-page',
      component: require('@/components/TagsPage')
    },
    {
      path: '/sysinfo',
      name: 'system-information',
      component: require('@/components/LandingPage/SystemInformation')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
