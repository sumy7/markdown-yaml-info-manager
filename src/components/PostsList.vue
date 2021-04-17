<template>
  <div>
    <div v-for="post in posts" :key="post.postInfo.path"
         class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 py-4 my-2">
      <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
        <div class="flex justify-between items-center hidden sm:block">
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
          <div class="col-span-12 lg:col-span-8">
            <span v-for="tag in getTagsByPostId(post.id)" :key="tag.id"
                  class="inline-block rounded-full text-white
                          duration-300 text-xs font-bold
                          mr-1 md:mr-2 mb-2 px-2 md:px-4 py-1
                          opacity-90 hover:opacity-100"
                  :class="[tag.appearance.normal, tag.appearance.hover]">
              {{ tag.name }}
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

export default defineComponent({
  name: 'PostsList',
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const store = useStore()
    return {
      getTagsByPostId: store.getters.getTagsByPostId
    }
  }
})
</script>

<style scoped>

</style>
