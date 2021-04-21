<template>
  <div>
    <div :key="category.id" class="category-items" :class="{'active': activeCategory === category.id}"
         @click="onCategoryClick(category.id)">
      <div class="w-full px-1 text-sm">
        <editable-text :value="category.name"
                       @value-change="(oldVal, newVal) => onCategoryItemModified(category.id, oldVal, newVal)"
        ></editable-text>
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
import EditableText from '@/components/EditableText.vue'

export default defineComponent({
  name: 'CategoryItem',
  components: { EditableText },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const activeCategory: Ref<string> = inject('ipActiveCategory', ref('none'))

    const onCategoryItemModified = function (categoryId: string, oldVal: string, newVal: string) {
      store.dispatch('setCategoryNameById', {
        categoryId: categoryId,
        name: newVal
      })
    }

    return {
      activeCategory,
      onCategoryClick: function (category: string) {
        if (activeCategory.value !== category) {
          activeCategory.value = category
        }
      },
      onCategoryItemModified,

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
