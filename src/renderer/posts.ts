import { SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT } from '@/utils/events'
import { ACTION_FIRST_LOAD_POST_FILE_INFO } from '@/store/events'
import store from '@/store/index'

window.ipcRenderer.on(SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT,
  function (event, fileInfos) {
    store.dispatch(ACTION_FIRST_LOAD_POST_FILE_INFO, fileInfos)
  })
