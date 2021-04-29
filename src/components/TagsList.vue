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

    <div class="relative flex py-1 text-xs">
      <hr class="absolute border-gray-300 left-0 right-0 top-1/2">
      <div class="z-10 w-full">
        <span class="bg-white px-2">标签（{{ tagsList.length }}）</span>
      </div>
      <div class="z-20 w-8" @click="toAddNewTag">
        <span class="bg-white px-2"><svg-icon icon-class="plus-solid"></svg-icon></span>
      </div>
    </div>

    <div v-if="isAddNewTag" class="px-3 py-2 text-sm rounded-md bg-gray-200">
      <editable-text ref="newTagEditItem" value="未命名标签"
                     @blur="(val) => onAddNewTag(val)"
      ></editable-text>
    </div>

    <div v-for="tag in tagsList" :key="tag.id" class="tag-items" :class="{'active': activeTag === tag.id}"
         @click="onTagClick(tag.id)">
      <div class="w-full px-1 text-sm">
        <editable-text :value="tag.name"
                       @value-change="(oldVal, newVal) => onTagNameModified(tag.id, oldVal, newVal)"
        ></editable-text>
      </div>
      <div class="w-16 text-right">
        <p class="text-sm">{{ getPostTagRelByTagId(tag.id).length }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { TAG_NO_TAG } from '@/store/tags'
import EditableText from '@/components/EditableText.vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'TagsList',
  components: {
    SvgIcon,
    EditableText
  },
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

    const isAddNewTag = ref(false)
    const newTagEditItem = ref<null | typeof EditableText>(null)
    const toAddNewTag = function () {
      isAddNewTag.value = true
      nextTick(() => {
        if (newTagEditItem.value) {
          newTagEditItem.value.onTextDblClick()
        }
      })
    }
    const onAddNewTag = function (tagName: string) {
      isAddNewTag.value = false
      store.commit('addTag', { name: tagName })
    }

    return {
      activeTag,
      onTagClick: function (tag: string) {
        if (activeTag.value !== tag) {
          context.emit('tagChanged', activeTag.value, tag)
          activeTag.value = tag
        }
      },
      onTagNameModified: function (tagId: string, oldVal: string, newVal: string) {
        store.dispatch('setTagNameById', {
          tagId: tagId,
          name: newVal
        })
      },

      isAddNewTag,
      newTagEditItem,
      toAddNewTag,
      onAddNewTag,

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
