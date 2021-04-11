import { SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT } from '@/utils/events'
import { ACTION_SET_POST_FILE_INFO } from '@/store/events'
import store from '@/store/index'

window.ipcRenderer.on(SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT,
  function (event, fileInfos) {
    store.dispatch(ACTION_SET_POST_FILE_INFO, fileInfos)
  })
