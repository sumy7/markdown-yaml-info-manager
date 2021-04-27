<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 z-40" style="background: rgba(0, 0, 0, 0.3);">
    <div class="h-full w-full flex justify-center items-center" @click.stop.self="closeTagSelect">
      <div class="bg-white w-96 shadow-lg rounded-lg overflow-hidden w-500">
        <div class="flex items-center px-2 py-4">
          <div class="flex-grow">
            <div class="flex justify-center items-center">
              <h4 class="font-normal px-2 leading-tight w-full">选择标签</h4>
              <span class="w-8 text-gray-400 hover:text-gray-600"
                    @click="closeTagSelect"><svg-icon icon-class="times-solid"></svg-icon></span>
            </div>
            <input type="text" v-model="selectInputText" placeholder="搜索或添加标签"
                   class="my-2 w-full text-sm bg-grey-white text-grey-darkest rounded h-10 p-3 focus:outline-none border border-grey-light rounded"/>
            <div class="w-full h-64 overflow-auto space-x-2 leading-8">
              <badge v-if="isNotFoundTag" @click="addNewTagToPost">新建"{{ selectInputText }}"标签</badge>
              <badge v-for="tag in selectedTagList" :key="tag.id" :selected="true"
                     :color="tag.color"
                     class="text-white"
                     @change="(selected) => onTagSelectChange(selected, tag.id)"
              >{{ tag.name }}
              </badge>
              <badge v-for="tag in unselectedTagList" :key="tag.id" :selected="false"
                     :color="tag.color"
                     class="text-white"
                     @change="(selected) => onTagSelectChange(selected, tag.id)"
              >{{ tag.name }}
              </badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import Badge from '@/components/Badge.vue'
import { TagState } from '@/store/tags'
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'TagSelect',
  components: {
    SvgIcon,
    Badge
  },
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup (props, context) {
    const store = useStore()

    const closeTagSelect = function () {
      context.emit('close')
    }

    const selectInputText = ref('')
    const selectedTagList = computed(() => {
      return _(store.getters.getTagsByPostId(props.postId))
        .filter((item: TagState) => item.name.indexOf(selectInputText.value) >= 0)
        .value()
    })
    const unselectedTagList = computed(() => {
      return _(store.getters.getAllTags)
        .filter((item: TagState) => item.name.indexOf(selectInputText.value) >= 0)
        .filter((item: TagState) => !_.find(selectedTagList.value, { id: item.id }))
        .sortBy(['name'])
        .value()
    })
    const isNotFoundTag = computed(() => {
      return selectInputText.value !== '' && !store.getters.findTagByName(selectInputText.value)
    })
    const addNewTagToPost = function () {
      store.commit('addTag', {
        name: selectInputText.value
      })
      const newTag = store.getters.findTagByName(selectInputText.value)
      if (newTag) {
        store.commit('addPostTagRel', {
          postId: props.postId,
          tagId: newTag.id
        })
      }
    }
    const addTagToPost = function (tagId: string) {
      store.commit('addPostTagRel', {
        postId: props.postId,
        tagId: tagId
      })
    }
    const removeTagFromPost = function (tagId: string) {
      store.commit('deletePostTagRel', {
        postId: props.postId,
        tagId: tagId
      })
    }
    const onTagSelectChange = function (selected: boolean, tagId: string) {
      if (selected) {
        addTagToPost(tagId)
      } else {
        removeTagFromPost(tagId)
      }
    }
    return {
      closeTagSelect,

      selectInputText,
      selectedTagList,
      unselectedTagList,
      isNotFoundTag,
      addNewTagToPost,
      onTagSelectChange
    }
  }
})
</script>

<style scoped>

</style>
