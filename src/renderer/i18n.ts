import { CHANGE_APP_LANGUAGE, REQUEST_APP_LOCALE_RESULT_EVENT } from '@/utils/events'
import store from '@/store'
import { ACTION_SET_LOCALE } from '@/store/events'

// 事件：返回当前系统语言环境
window.ipcRenderer.on(REQUEST_APP_LOCALE_RESULT_EVENT,
  function (event, locale) {
    store.dispatch(ACTION_SET_LOCALE, {
      system: locale
    })
  })

// 事件：响应更改界面语言事件
window.ipcRenderer.on(CHANGE_APP_LANGUAGE, function (event, language) {
  store.dispatch(ACTION_SET_LOCALE, {
    choose: language
  })
})
