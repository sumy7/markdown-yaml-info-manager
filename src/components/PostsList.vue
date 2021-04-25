<template>
  <div>
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
          <div class="col-span-12">
            <span class="inline-block mr-1 px-2 py-1 align-top">
              <svg-icon class-name="w-4 h-4" icon-class="folder-solid"></svg-icon>
            </span>
            <badge v-for="category in getCategoriesByPostId(post.id)" :key="category.id"
                   @click="removeCategoryFromPost(post.id, category.id)">
              {{ category.path.join(' / ') }}
            </badge>
          </div>
        </div>
        <div class="grid grid-cols-2 mt-2 my-auto">
          <div class="col-span-12">
            <span class="inline-block mr-1 px-2 py-1 align-top">
              <svg-icon class-name="w-4 h-4" icon-class="tags-solid"></svg-icon>
            </span>
            <span class="space-x-2">
              <badge v-for="tag in getTagsByPostId(post.id)" :key="tag.id"
                     :color="tag.color"
                     @close="removeTagFromPost(post.id, tag.id)">
                {{ tag.name }}
              </badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import SvgIcon from '@/components/SvgIcon.vue'
import Badge from '@/components/Badge.vue'

export default defineComponent({
  name: 'PostsList',
  components: {
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

    return {
      getTagsByPostId: store.getters.getTagsByPostId,
      getCategoriesByPostId: store.getters.getCategoriesByPostId,

      removeCategoryFromPost,
      removeTagFromPost
    }
  }
})
</script>

<style scoped>

</style>
