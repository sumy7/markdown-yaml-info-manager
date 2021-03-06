<template>
  <div class="space-y-2">
    <div class="category-items" :class="{'active': activeCategory === 'none'}" @click="onCategoryClick('none')">
      <div class="w-4/5 px-1">
        <p class="text-sm">{{ t('category.all') }}</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ allPostCount }}</p>
      </div>
    </div>
    <div class="category-items" :class="{'active': activeCategory === '-1'}" @click="onCategoryClick('-1')">
      <div class="w-4/5 px-1">
        <p class="text-sm">{{ t('category.uncategorized') }}</p>
      </div>
      <div class="w-1/5 text-right">
        <p class="text-sm">{{ noCategoryPostCount }}</p>
      </div>
    </div>

    <div class="relative flex py-1 text-xs">
      <hr class="absolute border-gray-300 left-0 right-0 top-1/2">
      <div class="z-10 w-full"
           :class="{dragActive: isDragOver}"
           @drop.stop="onDrop"
           @dragenter.stop="onDragEnter"
           @dragover.stop.prevent=""
           @dragleave.stop="onDragLeave"
      >
        <span class="bg-white px-2">{{ t('category.categories') }}（{{ categoriesList.length }}）</span>
      </div>
      <div class="z-20 w-8" @click="toAddNewCategory">
        <span class="bg-white px-2"><svg-icon icon-class="plus-solid"></svg-icon></span>
      </div>
    </div>

    <div v-if="isAddNewCategory" class="px-3 py-2 text-sm rounded-md bg-gray-200">
      <editable-text ref="newCategoryEditItem" :value="t('category.untitled')"
                     @blur="(val) => onAddNewCategory(val)"
      ></editable-text>
    </div>

    <category-item v-for="category in categoriesList"
                   :key="category.id"
                   :category="category"
    ></category-item>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, provide, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { NO_CATEGORY_ID } from '@/store/categories'
import CategoryItem from '@/components/CategoryItem.vue'
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon.vue'
import EditableText from '@/components/EditableText.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'CategoriesList',
  components: {
    EditableText,
    SvgIcon,
    CategoryItem
  },
  emits: ['categoryChanged'],
  setup (props, context) {
    const activeCategory = ref('none')
    provide('ipActiveCategory', activeCategory)
    watch(activeCategory, (newVal, oldVal) => {
      context.emit('categoryChanged', oldVal, newVal)
    })

    const store = useStore()

    const isAddNewCategory = ref(false)
    const newCategoryEditItem = ref<null | typeof EditableText>(null)
    const toAddNewCategory = function () {
      isAddNewCategory.value = true
      nextTick(() => {
        if (newCategoryEditItem.value) {
          newCategoryEditItem.value.onTextDblClick()
        }
      })
    }
    const onAddNewCategory = function (categoryName: string) {
      store.commit('addCategory', [categoryName])
      isAddNewCategory.value = false
    }

    const isDragOver = ref(false)
    const onDrop = function (e: DragEvent) {
      isDragOver.value = false
      if (e && e.dataTransfer) {
        const type = e.dataTransfer.getData('type')
        if (type === 'category') {
          const categoryId = e.dataTransfer.getData('id')
          store.dispatch('moveCategory', {
            from: categoryId,
            to: null
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

    const { t } = useI18n()

    return {
      activeCategory,
      onCategoryClick: function (category: string) {
        if (activeCategory.value !== category) {
          activeCategory.value = category
        }
      },

      newCategoryEditItem,
      isAddNewCategory,
      toAddNewCategory,
      onAddNewCategory,

      isDragOver,
      onDrop,
      onDragEnter,
      onDragLeave,

      t,

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

.dragActive {
  @apply bg-blue-200
}

.dragActive > * {
  @apply pointer-events-none bg-transparent
}
</style>
