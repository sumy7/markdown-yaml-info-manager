<template>
  <div>
    <div :key="category.id" class="category-items"
         :class="{'active': activeCategory === category.id, 'dragActive': isDragOver}"
         @click="onCategoryClick(category.id)" draggable="true"
         @dragstart.stop="onDragStart"
         @drop.stop.prevent="onDragFinish"
         @dragenter.stop="onDragEnter"
         @dragover.stop.prevent=""
         @dragleave.stop="onDragLeave">
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
        <category-item v-for="child in sortedChildren" :key="child.id" :category="child"></category-item>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import EditableText from '@/components/EditableText.vue'
import _ from 'lodash'

export default defineComponent({
  name: 'CategoryItem',
  components: { EditableText },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const activeCategory: Ref<string> = inject('ipActiveCategory', ref('none'))

    const onCategoryItemModified = function (categoryId: string, oldVal: string, newVal: string) {
      store.dispatch('setCategoryNameById', {
        categoryId: categoryId,
        name: newVal
      })
    }

    const isDragOver = ref(false)
    const onDragStart = function (e: DragEvent) {
      if (e && e.dataTransfer) {
        e.dataTransfer.setData('type', 'category')
        e.dataTransfer.setData('id', props.category.id)
        e.dataTransfer.setData('name', props.category.name)
      }
    }
    const onDragFinish = function (e: DragEvent) {
      isDragOver.value = false
      if (e && e.dataTransfer) {
        const type = e.dataTransfer.getData('type')
        if (type === 'category') {
          const categoryId = e.dataTransfer.getData('id')
          store.dispatch('moveCategory', {
            from: categoryId,
            to: props.category.id
          })
        }
      }
    }
    const onDragEnter = function () {
      isDragOver.value = true
    }
    const onDragLeave = function () {
      isDragOver.value = false
    }

    return {
      activeCategory,
      onCategoryClick: function (category: string) {
        if (activeCategory.value !== category) {
          activeCategory.value = category
        }
      },
      onCategoryItemModified,

      isDragOver,
      onDragStart,
      onDragFinish,
      onDragEnter,
      onDragLeave,

      getPostCategoryRelByCategoryId: store.getters.getPostCategoryRelByCategoryId,
      sortedChildren: computed(() => _.sortBy(props.category.children, ['name']))
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

.dragActive {
  @apply bg-blue-200
}

.dragActive > * {
  @apply pointer-events-none
}
</style>
