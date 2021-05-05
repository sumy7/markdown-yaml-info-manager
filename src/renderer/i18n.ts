import { REQUEST_APP_LOCALE_RESULT_EVENT } from '@/utils/events'
import store from '@/store'
import { ACTION_SET_LOCALE } from '@/store/events'

// 事件：返回当前系统语言环境
window.ipcRenderer.on(REQUEST_APP_LOCALE_RESULT_EVENT,
  function (event, locale) {
    store.dispatch(ACTION_SET_LOCALE, {
      system: locale
    })
  })
