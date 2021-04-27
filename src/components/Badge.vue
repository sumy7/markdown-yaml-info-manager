<template>
  <span class="whitespace-nowrap inline-block rounded-md align-middle"
        :class="borderClass"
        style="font-size: 0; line-height: 0; overflow: hidden;"
        @click="onSelectChange">
    <span class="inline-block
                  duration-300 text-xs font-bold
                  px-2 py-1 h-6
                  opacity-90 hover:opacity-100
                  align-middle"
          :class="{
                    [normalClass]: true,
                    [hoverClass]: true,
                    'rounded-l-md': closable,
                    'rounded-md': !closable
          }">
      <slot name="default"></slot>
    </span>
    <span v-if="closable" class="inline-block rounded-r-md
                  duration-300 text-xs font-bold
                  px-2 h-6 leading-6
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
    },
    closable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    borderType: {
      type: String,
      default: 'none'
    }
  },
  emits: ['close', 'change'],
  setup (props, context) {
    const normalClass = computed(() => props.selected ? 'bg-purple-400' : `bg-${props.color}-400`)
    const hoverClass = computed(() => props.selected ? 'bg-purple-500' : `hover:bg-${props.color}-500`)

    const borderClass = computed(() => {
      if (props.selected) {
        return ['border-2', 'border-purple-500', 'border-opacity-50', 'p-0.5']
      } else if (props.borderType === 'dot') {
        return ['border', 'border-gray-400', 'border-dashed']
      } else {
        return []
      }
    })

    const onCloseClick = function () {
      context.emit('close')
    }
    const onSelectChange = function () {
      context.emit('change', !props.selected)
    }
    return {
      normalClass,
      hoverClass,
      borderClass,

      onCloseClick,
      onSelectChange
    }
  }
})
</script>

<style scoped>

</style>
