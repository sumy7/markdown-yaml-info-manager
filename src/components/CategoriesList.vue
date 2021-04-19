<template>
  <div class="space-y-2">
    <div class="category-items" :class="{'active': activeCategory === 'none'}" @click="onCategoryClick('none')">
      <div class="w-4/5 px-1">
        <p class="text-sm">全部文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ allPostCount }}</p>
      </div>
    </div>
    <div class="category-items" :class="{'active': activeCategory === '-1'}" @click="onCategoryClick('-1')">
      <div class="w-4/5 px-1">
        <p class="text-sm">未分类文章</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ noCategoryPostCount }}</p>
      </div>
    </div>

    <hr class="my-3 border-gray-300">

    <category-item v-for="category in categoriesList"
                   :key="category.id"
                   :category="category"
    ></category-item>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { NO_CATEGORY_ID } from '@/store/categories'
import CategoryItem from '@/components/CategoryItem.vue'
import _ from 'lodash'

export default defineComponent({
  name: 'CategoriesList',
  components: { CategoryItem },
  emits: ['categoryChanged'],
  setup (props, context) {
    const activeCategory = ref('none')
    provide('ipActiveCategory', activeCategory)
    watch(activeCategory, (newVal, oldVal) => {
      context.emit('categoryChanged', oldVal, newVal)
    })

    const store = useStore()
    return {
      activeCategory,
      onCategoryClick: function (category: string) {
        if (activeCategory.value !== category) {
          activeCategory.value = category
        }
      },

      categoriesList: computed(() => _.sortBy(store.getters.getCategoriesHierarchy, 'name')),
      allPostCount: computed(() => store.state.posts.fileInfos.length),
      noCategoryPostCount: computed(() => store.getters.getPostCategoryRelByCategoryId(NO_CATEGORY_ID).length)
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
