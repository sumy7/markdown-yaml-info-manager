import { ipcMain } from 'electron'
import {
  SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT,
  SAVE_MARKDOWN_FRONT_MATTER_INFO_RESULT_EVENT,
  SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT,
  SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT
} from '@/utils/events'
import { glob } from 'glob'
import { parsePost, PostFileInfo, savePost } from '@/utils/posts'

// 事件：扫描文章信息
ipcMain.on(SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT, async (event, dir: string) => {
  const matchFiles = glob.sync('*.md', {
    cwd: dir,
    absolute: true
  })
  const scanResults: PostFileInfo[] = []
  for (const file of matchFiles) {
    const fileInfo = await parsePost(file)
    scanResults.push(fileInfo)
  }

  event.sender.send(SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT, scanResults)
})

// 事件：保存文章信息
ipcMain.on(SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, async (event, posts: PostFileInfo[]) => {
  for (const post of posts) {
    await savePost(post)
  }
  event.sender.send(SAVE_MARKDOWN_FRONT_MATTER_INFO_RESULT_EVENT)
})
