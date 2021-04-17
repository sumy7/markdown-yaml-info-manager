<template>
  <loading v-if="!fileLoaded"></loading>
  <div v-else>
    <div class="relative flex w-full h-screen overflow-hidden bg-gray-100 antialiased">
      <div class="w-64 flex-shrink-0 border-r">
        <div class="flex flex-col h-full">
          <div class="flex-1"><sidebar></sidebar></div>
          <div class="flex-shrink-0 flex-shrink-0 px-2 py-4 space-y-2">
            <button type="button" class="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark">
              <span>
                <svg-icon class-name="w-4 h-4 mr-2" icon-class="pen-alt-solid"></svg-icon>
              </span>
              <span>保存到文件</span>
            </button>
          </div>
        </div>
      </div>
      <div class="w-64 flex-shrink-0 bg-white rounded p-3 border-r overflow-auto">
        <tags-list></tags-list>
      </div>
      <div class="flex-1 bg-gray-200 p-3 overflow-auto">
        <posts-list :posts="fileInfos"></posts-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import Sidebar from '@/components/Sidebar.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import PostsList from '@/components/PostsList.vue'
import { useStore } from 'vuex'
import { SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT } from '@/utils/events'
import TagsList from '@/components/TagsList.vue'

export default defineComponent({
  name: 'Workspace',
  components: {
    TagsList,
    Loading,
    Sidebar,
    SvgIcon,
    PostsList
  },
  setup () {
    const store = useStore()
    const getPostInfo = function () {
      if (store.state.rootPath !== '') {
        window.ipcRenderer.send(SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT, store.state.rootPath)
      }
    }
    onMounted(() => {
      if (!store.state.loaded) {
        getPostInfo()
      }
    })

    return {
      fileLoaded: computed(() => store.state.loaded),
      fileInfos: computed(() => store.state.posts.fileInfos),
      getPostInfo
    }
  }
})
</script>

<style scoped>

</style>
