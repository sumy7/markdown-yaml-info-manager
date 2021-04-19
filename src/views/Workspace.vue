<template>
  <loading v-if="!fileLoaded"></loading>
  <div v-else>
    <div class="relative flex w-full h-screen overflow-hidden bg-gray-100 antialiased">
      <div class="w-64 flex-shrink-0 border-r">
        <div class="flex flex-col h-full">
          <div class="flex-1">
            <sidebar :active="activeMenu" @active-changed="onActiveMenuChanged"></sidebar>
          </div>
          <div class="flex-shrink-0 flex-shrink-0 px-2 py-4 space-y-2">
            <button type="button"
                    class="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark">
              <span>
                <svg-icon class-name="w-4 h-4 mr-2" icon-class="pen-alt-solid"></svg-icon>
              </span>
              <span>保存到文件</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="activeMenu === 'categories'" class="w-64 flex-shrink-0 bg-white rounded p-3 border-r overflow-auto">
        <categories-list @category-changed="onCategoryChanged"></categories-list>
      </div>
      <div v-if="activeMenu === 'tags'" class="w-64 flex-shrink-0 bg-white rounded p-3 border-r overflow-auto">
        <tags-list @tag-changed="onTagChanged"></tags-list>
      </div>
      <div class="flex-1 bg-gray-200 p-3 overflow-auto">
        <posts-list :posts="fileInfos"></posts-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import Loading from '@/components/Loading.vue'
import Sidebar from '@/components/Sidebar.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import PostsList from '@/components/PostsList.vue'
import { useStore } from 'vuex'
import { SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT } from '@/utils/events'
import TagsList from '@/components/TagsList.vue'
import CategoriesList from '@/components/CategoriesList.vue'

export default defineComponent({
  name: 'Workspace',
  components: {
    CategoriesList,
    TagsList,
    Loading,
    Sidebar,
    SvgIcon,
    PostsList
  },
  setup () {
    const postFilter = ref({
      type: 'none',
      value: '-1'
    })

    const activeMenu = ref('posts')
    const onActiveMenuChanged = function (oldVal: string, newVal: string) {
      activeMenu.value = newVal
      postFilter.value = {
        type: 'none',
        value: '-1'
      }
    }

    const onCategoryChanged = function (oldVal: string, newVal: string) {
      if (newVal === 'none') {
        postFilter.value = {
          type: 'none',
          value: '-1'
        }
      } else {
        postFilter.value = {
          type: 'categories',
          value: newVal
        }
      }
    }

    const onTagChanged = function (oldVal: string, newVal: string) {
      if (newVal === 'none') {
        postFilter.value = {
          type: 'none',
          value: '-1'
        }
      } else {
        postFilter.value = {
          type: 'tags',
          value: newVal
        }
      }
    }

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
      activeMenu,
      onActiveMenuChanged,
      onCategoryChanged,
      onTagChanged,

      fileLoaded: computed(() => store.state.loaded),
      fileInfos: computed(() => {
        if (postFilter.value.type === 'tags') {
          return store.getters.getPostsByTagId(postFilter.value.value)
        } else if (postFilter.value.type === 'categories') {
          return store.getters.getPostsByCategoryId(postFilter.value.value)
        } else {
          return store.state.posts.fileInfos
        }
      }),
      getPostInfo
    }
  }
})
</script>

<style scoped>

</style>
