import { app, ipcMain } from 'electron'
import { REQUEST_APP_LOCALE_EVENT, REQUEST_APP_LOCALE_RESULT_EVENT } from '@/utils/events'

// 事件：获取当期语言环境
ipcMain.on(REQUEST_APP_LOCALE_EVENT, (event) => {
  event.sender.send(REQUEST_APP_LOCALE_RESULT_EVENT, app.getLocale())
})
