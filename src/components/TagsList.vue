<template>
  <div class="space-y-2">
    <div class="tag-items active">
      <div class="w-4/5 px-1">
        <p class="text-sm">全部文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ allPostCount }}</p>
      </div>
    </div>
    <div class="tag-items">
      <div class="w-4/5 px-1">
        <p class="text-sm">未标签文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ noTagPostCount }}</p>
      </div>
    </div>

    <hr class="my-3 border-gray-300">

    <div v-for="tag in tagsList" :key="tag.id" class="tag-items">
      <div class="w-4/5 px-1">
        <p class="text-sm">{{ tag.name }}</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ getPostsByTagId(tag.id).length }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { TAG_NO_TAG } from '@/store/tags'

export default defineComponent({
  name: 'TagsList',
  setup () {
    const store = useStore()
    return {
      allPostCount: computed(() => store.state.posts.fileInfos.length),
      noTagPostCount: computed(() => store.getters.getPostsByTagId(TAG_NO_TAG).length),
      tagsList: computed(() => _.sortBy(store.getters.getAllTags, 'name')),
      getPostsByTagId: store.getters.getPostsByTagId
    }
  }
})
</script>

<style scoped>
.tag-items {
  @apply flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-200
}

.active {
  @apply bg-gray-200
}
</style>
