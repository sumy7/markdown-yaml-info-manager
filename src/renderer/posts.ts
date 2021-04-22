import {
  SAVE_MARKDOWN_FRONT_MATTER_INFO_RESULT_EVENT, SAVE_MARKDOWN_FRONT_MATTER_PROCESS_EVENT,
  SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT
} from '@/utils/events'
import { ACTION_FIRST_LOAD_POST_FILE_INFO, MUTATION_SET_LOADED } from '@/store/events'
import store from '@/store/index'

// 事件：收到扫描到的文章信息
window.ipcRenderer.on(SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT,
  function (event, fileInfos) {
    store.dispatch(ACTION_FIRST_LOAD_POST_FILE_INFO, fileInfos)
  })

// 事件：保存单个文件结果
window.ipcRenderer.on(SAVE_MARKDOWN_FRONT_MATTER_PROCESS_EVENT,
  function (event, payload) {
    const post = store.getters.getPostByPath(payload.path)
    if (post) {
      store.commit('setChangedFlagByPostIds', {
        postIds: [post.id],
        changed: false
      })
    }
  })

// 事件：保存文件完成
window.ipcRenderer.on(SAVE_MARKDOWN_FRONT_MATTER_INFO_RESULT_EVENT,
  function (event) {
    store.commit(MUTATION_SET_LOADED, true)
  })
