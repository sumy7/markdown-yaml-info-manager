<template>
  <div class="space-y-2">
    <div class="tag-items" :class="{'active': activeTag === 'none'}" @click="onTagClick('none')">
      <div class="w-4/5 px-1">
        <p class="text-sm">全部文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ allPostCount }}</p>
      </div>
    </div>
    <div class="tag-items" :class="{'active': activeTag === '-1'}" @click="onTagClick('-1')">
      <div class="w-4/5 px-1">
        <p class="text-sm">未标签文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ noTagPostCount }}</p>
      </div>
    </div>

    <hr class="my-3 border-gray-300">

    <div v-for="tag in tagsList" :key="tag.id" class="tag-items" :class="{'active': activeTag === tag.id}"
         @click="onTagClick(tag.id)">
      <div class="w-4/5 px-1">
        <p class="text-sm">{{ tag.name }}</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ getPostTagRelByTagId(tag.id).length }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { TAG_NO_TAG } from '@/store/tags'

export default defineComponent({
  name: 'TagsList',
  props: {
    active: {
      type: String,
      default: 'none'
    }
  },
  emits: ['tagChanged'],
  setup (props, context) {
    const activeTag = ref(props.active)

    const store = useStore()
    return {
      activeTag,
      onTagClick: function (tag: string) {
        if (activeTag.value !== tag) {
          context.emit('tagChanged', activeTag.value, tag)
          activeTag.value = tag
        }
      },

      allPostCount: computed(() => store.state.posts.fileInfos.length),
      noTagPostCount: computed(() => store.getters.getPostTagRelByTagId(TAG_NO_TAG).length),
      tagsList: computed(() => _.sortBy(store.getters.getAllTags, 'name')),
      getPostTagRelByTagId: store.getters.getPostTagRelByTagId
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
