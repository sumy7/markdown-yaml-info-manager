<template>
  <div class="min-h-full bg-white rounded p-3">
    <ul class="space-y-2 text-sm">
      <li class="sidebar-items" :class="{'active': activeMenu === 'posts'}" @click="onMenuClicked('posts')">
        <span class="w-4 text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="book-solid"></svg-icon></span>
        <span class="w-4/5">{{ t('post._') }}</span>
        <span class="w-1/5 text-right">{{ postCount }}</span>
      </li>
      <li class="sidebar-items" :class="{'active': activeMenu === 'categories'}" @click="onMenuClicked('categories')">
        <span class="w-4 text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="folder-solid"></svg-icon></span>
        <span class="w-4/5">{{ t('category._') }}</span>
        <span class="w-1/5 text-right">{{ categoryCount }}</span>
      </li>
      <li class="sidebar-items" :class="{'active': activeMenu === 'tags'}" @click="onMenuClicked('tags')">
        <span class="w-4 text-gray-600"><svg-icon class-name="w-4 h-4" icon-class="tags-solid"></svg-icon></span>
        <span class="w-4/5">{{ t('tag._') }}</span>
        <span class="w-1/5 text-right">{{ tagCount }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SvgIcon
  },
  props: {
    active: {
      type: String,
      default: 'posts'
    }
  },
  emits: ['activeChanged'],
  setup (props, context) {
    const activeMenu = ref(props.active)
    const onMenuClicked = function (menu: string) {
      if (activeMenu.value !== menu) {
        context.emit('activeChanged', activeMenu.value, menu)
      }
      activeMenu.value = menu
    }

    const store = useStore()

    const { t } = useI18n()

    return {
      activeMenu,
      onMenuClicked,
      postCount: computed(() => store.getters.getPostCount),
      categoryCount: computed(() => store.state.categories.categories.length - 1),
      tagCount: computed(() => store.state.tags.tags.length - 1),

      t
    }
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
