import { app, BrowserWindow, ipcMain } from 'electron'
import { CHANGE_APP_LANGUAGE, REQUEST_APP_LOCALE_EVENT, REQUEST_APP_LOCALE_RESULT_EVENT } from '@/utils/events'

// 事件：获取当期语言环境
ipcMain.on(REQUEST_APP_LOCALE_EVENT, (event) => {
  event.sender.send(REQUEST_APP_LOCALE_RESULT_EVENT, app.getLocale())
})

/**
 * 修改界面语言
 * @param window 接收事件响应的窗体
 * @param language 新语言标识符
 */
export function changeLanguage (window: BrowserWindow | undefined, language: string): void {
  if (window) {
    window.webContents.send(CHANGE_APP_LANGUAGE, language)
  }
}
