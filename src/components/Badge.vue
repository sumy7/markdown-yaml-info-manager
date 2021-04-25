<template>
  <span class="whitespace-nowrap">
    <span class="inline-block rounded-l-md text-white
                  duration-300 text-xs font-bold
                  px-2 py-1 h-6
                  opacity-90 hover:opacity-100"
          :class="[normalClass, hoverClass]">
      <slot name="default"></slot>
    </span>
    <span class="inline-block rounded-r-md text-white
                  duration-300 text-xs font-bold
                  px-2 py-1 h-6 leading-6
                  opacity-90 hover:opacity-100
                  align-middle"
          :class="[normalClass, hoverClass]"
          @click="onCloseClick">
      <svg-icon class-name="w-4 h-4 align-middle" icon-class="times-solid"></svg-icon>
    </span>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'Badge',
  components: { SvgIcon },
  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },
  emits: ['close'],
  setup (props, context) {
    const normalClass = computed(() => `bg-${props.color}-400`)
    const hoverClass = computed(() => `hover:bg-${props.color}-500`)

    const onCloseClick = function () {
      context.emit('close')
    }
    return {
      normalClass,
      hoverClass,

      onCloseClick
    }
  }
})
</script>

<style scoped>

</style>
