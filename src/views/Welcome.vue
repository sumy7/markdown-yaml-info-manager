<template>
  <div class="bg-gray-100 py-16 h-full">
    <div class="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto h-full flex justify-center items-center">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
        <div class="col-span-6">
          <h1 class="font-bold text-4xl max-w-xl text-gray-900 leading-tight">选择一个目录开始吧</h1>
          <hr class="w-24 h-1 bg-orange-500 rounded-full mt-2">
          <div class="mb-4 mt-2">
            <div class="flex flex-wrap items-stretch w-full relative">
              <input type="text"
                     class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-r-none px-3 relative"
                     disabled
                     placeholder="hexo下_post文件夹路径"
                     v-model="selectedPath">
              <div class="flex -mr-px">
                <button
                  class="flex items-center w-32 justify-center leading-normal whitespace-no-wrap bg-indigo-600 hover:bg-blue-dark text-white font-bold rounded-lg rounded-l-none hover:bg-indigo-500 transition ease-in-out duration-300"
                  @click="selectDirectory">
                  选择路径
                </button>
              </div>
            </div>
            <div class="m-0 text-red-500">{{ errorMessage }}</div>
          </div>

          <button
            class="w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300 disabled:opacity-50"
            :disabled="isDisabled">
            开始处理
          </button>
        </div>

        <div class="col-span-6 hidden md:block">
          <img src="../assets/undraw_File_searching_re_3evy.svg" alt="logo">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { IpcRendererEvent } from 'electron'
import {
  OPEN_SELECT_DIRECTORY_DIALOG_EVENT,
  SCAN_FILE_INFO_EVENT,
  SCAN_FILE_INFO_RESULTS_EVENT,
  ScanFileResult,
  SELECT_DIRECTORY_RESULT_EVENT
} from '@/utils/events'

export default defineComponent({
  name: 'Welcome',
  setup () {
    // 文件选择与选择后的回调
    const selectedPath = ref('')
    const selectDirectory = function () {
      window.ipcRenderer.send(OPEN_SELECT_DIRECTORY_DIALOG_EVENT)
    }
    const selectDirectoryCallback = function (event: IpcRendererEvent, path: string) {
      selectedPath.value = path
      mdFileCount.value = 0
      errorMessage.value = ''
    }
    onMounted(() => window.ipcRenderer.on(SELECT_DIRECTORY_RESULT_EVENT, selectDirectoryCallback))
    onUnmounted(() => window.ipcRenderer.removeListener(SELECT_DIRECTORY_RESULT_EVENT, selectDirectoryCallback))

    // 开始处理按钮逻辑
    const mdFileCount = ref(0)
    const isDisabled = computed(() => mdFileCount.value <= 0)
    const errorMessage = ref('')
    const scanFileInfoCallback = function (event: IpcRendererEvent, result: ScanFileResult) {
      if (result.path !== selectedPath.value) {
        return
      }
      if (result.success) {
        errorMessage.value = (result.fileInfos.length === 0) ? '目录下未找到md格式的文件' : ''
        mdFileCount.value = result.fileInfos.length
      } else {
        mdFileCount.value = -1
        errorMessage.value = result.errorMessage
      }
    }
    watch(selectedPath, (value) => {
      window.ipcRenderer.send(SCAN_FILE_INFO_EVENT, value)
    })
    onMounted(() => window.ipcRenderer.on(SCAN_FILE_INFO_RESULTS_EVENT, scanFileInfoCallback))
    onUnmounted(() => window.ipcRenderer.removeListener(SCAN_FILE_INFO_RESULTS_EVENT, scanFileInfoCallback))

    return {
      selectedPath,
      selectDirectory,
      isDisabled,
      errorMessage
    }
  }
})
</script>

<style scoped>

</style>
