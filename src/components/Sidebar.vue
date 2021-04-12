<template>
  <div class="min-h-full bg-white rounded p-3">
    <ul class="space-y-2 text-sm">
      <li class="sidebar-items active">
        <span class="text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="book-solid"></svg-icon></span>
        <span>文章</span>
      </li>
      <li class="sidebar-items">
        <span class="text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="folder-solid"></svg-icon></span>
        <span>分类</span>
      </li>
      <li class="sidebar-items">
        <span class="text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="tags-solid"></svg-icon></span>
        <span>标签</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SvgIcon
  }
})
</script>

<style scoped>
.sidebar-items {
  @apply flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200
}

.active {
  @apply bg-gray-200
}
</style>
