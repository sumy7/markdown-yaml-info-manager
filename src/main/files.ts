import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron'
import {
  FileInfo,
  OPEN_SELECT_DIRECTORY_DIALOG_EVENT,
  SCAN_FILE_INFO_EVENT,
  SCAN_FILE_INFO_RESULTS_EVENT,
  ScanFileResult,
  SELECT_DIRECTORY_RESULT_EVENT
} from '@/utils/events'
import * as fs from 'fs'
import { glob } from 'glob'

// 事件：打开文件选择框，选择一个路径
ipcMain.on(OPEN_SELECT_DIRECTORY_DIALOG_EVENT, (event) => {
  dialog.showOpenDialog(<BrowserWindow>BrowserWindow.getFocusedWindow(), {
    properties: [
      'openDirectory'
    ]
  }).then(result => {
    if (!result.canceled) {
      event.sender.send(SELECT_DIRECTORY_RESULT_EVENT, result.filePaths[0])
    }
  })
})

// 事件：扫描路径中的md文件
ipcMain.on(SCAN_FILE_INFO_EVENT, (event: IpcMainEvent, dir: string) => {
  const results: ScanFileResult = {
    path: dir,
    success: true,
    fileInfos: [],
    errorMessage: ''
  }
  try {
    const state = fs.statSync(dir)
    if (!state) {
      results.success = false
      results.errorMessage = '路径不存在'
    } else if (!state.isDirectory()) {
      results.success = false
      results.errorMessage = '路径不是一个有效的文件夹'
    } else {
      const fileInfos: FileInfo[] = []
      const matchFiles = glob.sync('*.md', {
        cwd: dir,
        absolute: true
      })
      matchFiles.forEach((file) => {
        fileInfos.push({
          path: file
        })
      })
      results.success = true
      results.errorMessage = ''
      results.fileInfos = fileInfos
    }
  } catch (e) {
    results.success = false
    results.errorMessage = '解析路径失败，' + e.toString()
  }
  event.sender.send(SCAN_FILE_INFO_RESULTS_EVENT, results)
})
