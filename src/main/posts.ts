import { ipcMain } from 'electron'
import { SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT, SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT } from '@/utils/events'
import { glob } from 'glob'
import { parsePost, PostFileInfo } from '@/utils/posts'

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
