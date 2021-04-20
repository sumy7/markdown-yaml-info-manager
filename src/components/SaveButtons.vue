<template>
  <div class="w-full relative">
    <div class="flex w-full">
      <button type="button"
              class="flex items-center justify-center w-full
                px-4 py-2
                text-sm text-white bg-blue-600 rounded-l-md border-r border-gray-200
                hover:bg-blue-700 disabled:bg-gray-400
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
              :disabled="changedPostCount === 0"
              @click="saveChangedPosts">
              <span>
                <svg-icon class-name="w-4 h-4 mr-2" icon-class="pen-alt-solid"></svg-icon>
              </span>
        <span>保存 {{ changedPostCount }} 个文件</span>
      </button>
      <button type="button"
              class="flex items-center justify-center w-2
                px-4 py-2
                text-sm text-white bg-blue-600 rounded-r-md
                hover:bg-blue-700
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
              @click="activePopup">
        <span><svg-icon class-name="w-4 h-4" icon-class="caret-up-solid"></svg-icon></span>
      </button>
    </div>
    <div v-if="popupActive" class="absolute z-20
              mb-10 w-72 p-4
              rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
              focus:outline-none"
         style="transform: translate3d(0px, -120px, 0px)">
      <div class="flex">
        <button type="button"
                class="flex items-center justify-center w-full
                px-4 py-2
                text-sm text-white bg-blue-600 rounded-md border-gray-200
                hover:bg-blue-700
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
                @click="saveAllPosts">
              <span>
                <svg-icon class-name="w-4 h-4 mr-2" icon-class="save-regular"></svg-icon>
              </span>
          <span>保存全部 {{ postCount }} 个文件</span>
        </button>
      </div>
    </div>
    <div v-if="popupActive" class="fixed z-10 top-0 bottom-0 left-0 right-0" @click="closePopup"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { PostFileInfo } from '@/utils/posts'
import { SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT } from '@/utils/events'

export default defineComponent({
  name: 'SaveButtons',
  components: { SvgIcon },
  setup () {
    const store = useStore()

    const popupActive = ref(false)
    const activePopup = function () {
      popupActive.value = true
    }
    const closePopup = function () {
      popupActive.value = false
    }

    const saveChangedPosts = function () {
      const changedPostIds = _.map(store.getters.getChangedFileInfos, 'id')
      const newPostsInfo: PostFileInfo[] = store.getters.getPostFileInfosByPostIds(changedPostIds)
      window.ipcRenderer.send(SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, { posts: newPostsInfo })
    }

    const saveAllPosts = function () {
      const allPostIds = _.map(store.state.posts.fileInfos, 'id')
      const newPostsInfo: PostFileInfo[] = store.getters.getPostFileInfosByPostIds(allPostIds)
      window.ipcRenderer.send(SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, { posts: newPostsInfo })
      popupActive.value = false
    }

    return {
      popupActive,
      activePopup,
      closePopup,

      saveChangedPosts,
      saveAllPosts,

      postCount: store.getters.getPostCount,
      changedPostCount: store.getters.getChangedPostCount
    }
  }
})
</script>

<style scoped>

</style>
