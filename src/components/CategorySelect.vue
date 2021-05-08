<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 z-40" style="background: rgba(0, 0, 0, 0.3);">
    <div class="h-full w-full flex justify-center items-center" @click.stop.self="closeCategorySelect">
      <div class="bg-white w-96 shadow-lg rounded-lg overflow-hidden w-500">
        <div class="flex items-center px-2 py-4">
          <div class="flex-grow">
            <div class="flex justify-center items-center">
              <h4 class="font-normal px-2 leading-tight w-full">{{ t('category.select') }}</h4>
              <span class="w-8 text-gray-400 hover:text-gray-600"
                    @click="closeCategorySelect"><svg-icon icon-class="times-solid"></svg-icon></span>
            </div>
            <input type="text" v-model="selectInputText" :placeholder="t('category.search')"
                   class="my-2 w-full text-sm bg-grey-white text-grey-darkest rounded h-10 p-3 focus:outline-none border border-grey-light rounded"/>
            <div class="w-full h-64 overflow-auto">
              <label v-for="category in allCategories" :key="category.id"
                     class="category-items flex items-center px-2 py-1 hover:bg-gray-200 rounded-md">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-purple-600 flex-shrink-0"
                       :value="category.id" :checked="selectedCategories.indexOf(category.id) >= 0"
                       @input="onCategorySelectChange(category.id)">
                <span class="ml-2 text-gray-700 flex-shrink-0">{{ category.name }}</span>
                <span class="category-path text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap hidden">&nbsp;- {{
                    category.path.join(' / ')
                  }}</span>
              </label>
              <label v-if="isNotFoundCategory"
                     class="category-items flex items-center px-2 py-1 hover:bg-gray-200 rounded-md">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-purple-600 flex-shrink-0"
                       value="-1" @input="addNewCategoryToPost">
                <span class="ml-2 text-gray-700 flex-shrink-0">{{ t('category.new') }} "{{ selectInputText }}"</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'CategorySelect',
  components: {
    SvgIcon
  },
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup (props, context) {
    const store = useStore()

    const selectInputText = ref('')

    const closeCategorySelect = function () {
      context.emit('close')
    }
    const allCategories = computed(() => _(store.getters.getAllCategories)
      .filter((cat) => cat.name.indexOf(selectInputText.value) >= 0)
      .sortBy((cat) => cat.path.join(''))
      .value())
    const selectedCategories = computed(() => {
      return _(store.getters.getPostCategoryRelByPostId(props.postId))
        .map('categoryId')
        .value()
    })
    const isNotFoundCategory = computed(() => {
      return selectInputText.value !== '' && !store.getters.findCategoryByNamePath([selectInputText.value])
    })
    const onCategorySelectChange = function (categoryId: string) {
      const selected = selectedCategories.value.indexOf(categoryId) >= 0
      if (selected) {
        store.dispatch('deletePostCategoryRel', {
          postId: props.postId,
          categoryId: categoryId
        })
      } else {
        store.dispatch('addPostCategoryRel', {
          postId: props.postId,
          categoryId: categoryId
        })
      }
    }
    const addNewCategoryToPost = function () {
      store.commit('addCategory', [selectInputText.value])
      const newCategory = store.getters.findCategoryByNamePath([selectInputText.value])
      if (newCategory) {
        store.dispatch('addPostCategoryRel', {
          postId: props.postId,
          categoryId: newCategory.id
        })
      }
    }

    const { t } = useI18n()

    return {
      selectInputText,
      closeCategorySelect,

      allCategories,
      selectedCategories,
      isNotFoundCategory,
      onCategorySelectChange,
      addNewCategoryToPost,

      t
    }
  }
})
</script>

<style scoped>
.category-items:hover .category-path {
  @apply inline-block
}
</style>
