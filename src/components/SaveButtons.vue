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
              @click="savePosts('changed')">
              <span>
                <svg-icon class-name="w-4 h-4 mr-2" icon-class="pen-alt-solid"></svg-icon>
              </span>
        <span>{{ t('post.save', [changedPostCount]) }}</span>
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
         style="transform: translate3d(0px, -165px, 0px)">
      <div class="flex flex-col space-y-2">
        <button type="button"
                class="flex items-center justify-center w-full
                px-4 py-2
                text-sm text-white bg-blue-600 rounded-md border-gray-200
                hover:bg-blue-700
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
                @click="savePosts('all')">
          <span>
            <svg-icon class-name="w-4 h-4 mr-2" icon-class="save-regular"></svg-icon>
          </span>
          <span>{{ t('post.saveAll', [postCount]) }}</span>
        </button>
        <button type="button"
                class="flex items-center justify-center w-full
                px-4 py-2
                text-sm text-white bg-red-600 rounded-md border-gray-200
                hover:bg-red-700
                focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white"
                @click="reloadPosts">
          <span>
            <svg-icon class-name="w-4 h-4 mr-2" icon-class="sync-solid"></svg-icon>
          </span>
          <span>{{ t('post.reload') }}</span>
        </button>
      </div>
      <div class="triangle triangle-location"></div>
    </div>
    <div v-if="popupActive" class="fixed z-10 top-0 bottom-0 left-0 right-0" @click="closePopup"></div>
  </div>

  <modal ref="saveConfirmModal" :title="t('message.saveConfirm.title')" @ok="onOkSavePosts">
    <template #body>
      <p v-for="(line, index) in t('message.saveConfirm.content').split('\n')" :key="index">
        {{ line }}
      </p>
    </template>
  </modal>

  <modal ref="reloadConfirmModal" :title="t('message.reloadConfirm.title')" @ok="onOkReloadPosts">
    <template #body>
      <p v-for="(line, index) in t('message.reloadConfirm.content').split('\n')" :key="index">
        {{ line }}
      </p>
    </template>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { PostFileInfo } from '@/utils/posts'
import { SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT } from '@/utils/events'
import Modal from '@/components/Modal.vue'
import { MUTATION_SET_LOADED } from '@/store/events'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SaveButtons',
  components: {
    Modal,
    SvgIcon
  },
  setup () {
    const store = useStore()

    const popupActive = ref(false)
    const activePopup = function () {
      popupActive.value = true
    }
    const closePopup = function () {
      popupActive.value = false
    }

    const saveConfirmModal: Ref<typeof Modal | null> = ref(null)
    let confirmSaveType = 'changed'
    const savePosts = function (saveType: string) {
      confirmSaveType = saveType
      popupActive.value = false
      if (saveConfirmModal.value) {
        saveConfirmModal.value.openModal()
      }
    }

    const onOkSavePosts = function () {
      if (confirmSaveType === 'changed') {
        const changedPostIds = _.map(store.getters.getChangedFileInfos, 'id')
        const newPostsInfo: PostFileInfo[] = store.getters.getPostFileInfosByPostIds(changedPostIds)
        store.commit(MUTATION_SET_LOADED, false)
        window.ipcRenderer.send(SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, { posts: newPostsInfo })
      } else if (confirmSaveType === 'all') {
        const allPostIds = _.map(store.state.posts.fileInfos, 'id')
        const newPostsInfo: PostFileInfo[] = store.getters.getPostFileInfosByPostIds(allPostIds)
        store.commit(MUTATION_SET_LOADED, false)
        window.ipcRenderer.send(SAVE_MARKDOWN_FRONT_MATTER_INFO_EVENT, { posts: newPostsInfo })
      }
    }

    const reloadConfirmModal: Ref<typeof Modal | null> = ref(null)
    const reloadPosts = function () {
      popupActive.value = false
      if (reloadConfirmModal.value) {
        reloadConfirmModal.value.openModal()
      }
    }
    const onOkReloadPosts = function () {
      store.commit(MUTATION_SET_LOADED, false)
      window.ipcRenderer.send(SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT, store.state.rootPath)
    }

    const { t } = useI18n()

    return {
      popupActive,
      activePopup,
      closePopup,

      saveConfirmModal,
      savePosts,
      onOkSavePosts,
      reloadConfirmModal,
      reloadPosts,
      onOkReloadPosts,

      t,

      postCount: computed(() => store.getters.getPostCount),
      changedPostCount: computed(() => store.getters.getChangedPostCount)
    }
  }
})
</script>

<style scoped>
/* 绘制三角形和阴影 */
.triangle {
  width: 0;
  height: 0;
  border-top: 0.6rem solid white;
  border-left: 0.6rem solid transparent;
  border-right: 0.6rem solid transparent;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, .2));
}

.triangle-location {
  position: absolute;
  bottom: -0.5rem;
  left: 13.5rem;
}
</style>
