<template>
  <div>
    <div v-for="post in posts" :key="post.path" class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 py-4 my-2">
      <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
        <div class="flex justify-between items-center hidden sm:block">
          <span class="font-light text-gray-600">{{ post.date }}</span>
        </div>
        <div class="mt-2">
          <p :title="post.title" class="text-lg text-gray-700 font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">{{ post.title }}</p>
          <p :title="post.fileName" class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">{{ post.fileName }}</p>
        </div>
        <div class="grid grid-cols-2 mt-4 my-auto">
          <div class="col-span-12 lg:col-span-8">
            <span class="inline-block rounded-full text-white
                            bg-red-400 hover:bg-red-500 duration-300
                            text-xs font-bold
                            mr-1 md:mr-2 mb-2 px-2 md:px-4 py-1
                            opacity-90 hover:opacity-100">
              Caching
            </span>
            <span class="inline-block rounded-full text-white
                            bg-yellow-400 hover:bg-yellow-500 duration-300
                            text-xs font-bold
                            mr-1 md:mr-2 mb-2 px-2 md:px-4 py-1
                            opacity-90 hover:opacity-100">
              RabbitMQ
            </span>
            <span class="inline-block rounded-full text-white
                            bg-green-400 hover:bg-green-500 duration-300
                            text-xs font-bold
                            mr-1 md:mr-2 mb-2 px-2 md:px-4 py-1
                            opacity-90 hover:opacity-100">
              Memcached
            </span>
            <span class="inline-block rounded-full text-white
                            bg-blue-400 hover:bg-blue-500 duration-300
                            text-xs font-bold
                            mr-1 md:mr-2 mb-2 px-2 md:px-4 py-1
                            opacity-90 hover:opacity-100">
              Redis
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PostsList',
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    return {
    }
  }
})
</script>

<style scoped>

</style>
