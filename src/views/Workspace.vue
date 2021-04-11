<template>
  <loading v-if="!fileLoaded"></loading>
  <div v-else>
    {{ fileInfos }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import { useStore } from 'vuex'
import { SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT } from '@/utils/events'

export default defineComponent({
  name: 'Workspace',
  components: {
    Loading
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
      fileInfos: computed(() => JSON.stringify(store.state.posts.fileInfos)),
      getPostInfo
    }
  }
})
</script>

<style scoped>

</style>
