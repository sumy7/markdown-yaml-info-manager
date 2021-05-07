<template>
  <div>
    <tag-select v-if="showTagSelect" :post-id="selectedPostId"
                @close="onTagSelectClose"></tag-select>
    <category-select v-if="showCategorySelect" :post-id="selectedCategoryPostId"
                     @close="onCategorySelectClose"></category-select>
    <div v-for="post in posts" :key="post.postInfo.path"
         class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 py-4 my-2">
      <div class="col-span-12 px-3">
        <div class="flex justify-between items-center">
          <span class="font-light text-gray-600">{{ post.postInfo.date }}</span>
        </div>
        <div class="mt-2">
          <p :title="post.postInfo.title"
             class="text-lg text-gray-700 font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">
            {{ post.postInfo.title }}</p>
          <p :title="post.postInfo.fileName" class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
            {{ post.postInfo.fileName }}</p>
        </div>
        <div class="grid grid-cols-2 mt-4 my-auto">
          <div class="col-span-12 leading-8">
            <span class="inline-block mr-1 align-middle">
              <svg-icon class-name="w-4 h-4" icon-class="folder-solid"></svg-icon>
            </span>
            <span class="space-x-2">
              <badge v-for="category in getCategoriesByPostId(post.id)" :key="category.id"
                     closable
                     class="text-white"
                     @close="removeCategoryFromPost(post.id, category.id)">
                {{ category.path.join(' / ') }}
              </badge>
              <badge color="white" @click="openCategorySelect(post.id)" border-type="dot"
                     class="text-gray-500 hover:text-gray-600">
                <svg-icon icon-class="plus-solid"></svg-icon>
                {{ t('category.add') }}
              </badge>
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 mt-2 my-auto">
          <div class="col-span-12 leading-8">
            <span class="inline-block mr-1 align-middle">
              <svg-icon class-name="w-4 h-4" icon-class="tags-solid"></svg-icon>
            </span>
            <span class="space-x-2">
              <badge v-for="tag in getTagsByPostId(post.id)" :key="tag.id"
                     :color="tag.color" class="text-white"
                     closable
                     @close="removeTagFromPost(post.id, tag.id)">
                {{ tag.name }}
              </badge>
              <badge color="white" @click="openTagSelect(post.id)" border-type="dot"
                     class="text-gray-500 hover:text-gray-600">
                <svg-icon icon-class="plus-solid"></svg-icon> {{ t('tag.add') }}</badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import SvgIcon from '@/components/SvgIcon.vue'
import Badge from '@/components/Badge.vue'
import TagSelect from '@/components/TagSelect.vue'
import CategorySelect from '@/components/CategorySelect.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PostsList',
  components: {
    CategorySelect,
    TagSelect,
    Badge,
    SvgIcon
  },
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const store = useStore()

    const showTagSelect = ref(false)
    const selectedPostId = ref('-1')
    const openTagSelect = function (postId: string) {
      selectedPostId.value = postId
      showTagSelect.value = true
    }
    const onTagSelectClose = function () {
      showTagSelect.value = false
    }

    const showCategorySelect = ref(false)
    const selectedCategoryPostId = ref('-1')
    const openCategorySelect = function (postId: string) {
      selectedCategoryPostId.value = postId
      showCategorySelect.value = true
    }
    const onCategorySelectClose = function () {
      showCategorySelect.value = false
    }

    const removeCategoryFromPost = function (postId: string, categoryId: string) {
      store.commit('deletePostCategoryRel', {
        postId,
        categoryId
      })
    }

    const removeTagFromPost = function (postId: string, tagId: string) {
      store.commit('deletePostTagRel', {
        postId,
        tagId
      })
    }

    const { t } = useI18n()

    return {
      getTagsByPostId: store.getters.getTagsByPostId,
      getCategoriesByPostId: store.getters.getCategoriesByPostId,

      showTagSelect,
      selectedPostId,
      openTagSelect,
      onTagSelectClose,

      showCategorySelect,
      selectedCategoryPostId,
      openCategorySelect,
      onCategorySelectClose,

      removeCategoryFromPost,
      removeTagFromPost,

      t
    }
  }
})
</script>

<style scoped>

</style>
