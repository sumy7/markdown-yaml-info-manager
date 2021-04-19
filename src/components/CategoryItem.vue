<template>
  <div>
    <div :key="category.id" class="category-items" :class="{'active': activeCategory === category.id}"
         @click="onCategoryClick(category.id)">
      <div class="w-full px-1">
        <p class="text-sm">{{ category.name }}</p>
      </div>
      <div class="w-16 text-right">
        <p class="text-sm">{{ getPostCategoryRelByCategoryId(category.id).length }}</p>
      </div>
    </div>
    <template v-if="category.children.length > 0">
      <div class="ml-4 mt-2">
        <category-item v-for="child in category.children" :key="child.id" :category="child"></category-item>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CategoryItem',
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const activeCategory: Ref<string> = inject('ipActiveCategory', ref('none'))
    return {
      activeCategory,
      onCategoryClick: function (category: string) {
        if (activeCategory.value !== category) {
          activeCategory.value = category
        }
      },

      getPostCategoryRelByCategoryId: store.getters.getPostCategoryRelByCategoryId
    }
  }
})
</script>

<style scoped>
.category-items {
  @apply flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-200
}

.active {
  @apply bg-gray-200
}
</style>
