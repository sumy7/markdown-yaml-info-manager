'use strict'

import * as Sentry from '@sentry/electron'
import { app, BrowserWindow, Menu, protocol, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import './main/files'
import './main/posts'
import './main/i18n'
import path from 'path'
import { autoUpdater } from 'electron-updater'
import getMenuTemplate from '@/main/menu'

const isDevelopment = process.env.NODE_ENV !== 'production'

Sentry.init({ dsn: 'https://b7587371a60b4b4083eb19602f09f63c@o575054.ingest.sentry.io/5726826' })

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    minWidth: 850,
    minHeight: 580,
    useContentSize: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {

      // Required for Spectron testing
      enableRemoteModule: true,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // check update
    autoUpdater.checkForUpdatesAndNotify()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     // await session.defaultSession.loadExtension(path.join(__dirname, '../vue-devtools'))
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()

  const menu = Menu.buildFromTemplate(getMenuTemplate(app, shell))
  Menu.setApplicationMenu(menu)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
