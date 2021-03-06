<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-bind="$attrs"/>
  <span v-else class="inline-block align-middle"><svg :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName"/>
  </svg></span>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { isExternal as checkExternal } from '@/utils/validate'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const isExternal = computed(() => {
      return checkExternal(props.iconClass)
    })

    const iconName = computed(() => {
      return `#icon-${props.iconClass}`
    })

    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`
      } else {
        return 'svg-icon'
      }
    })

    const styleExternalIcon = computed(() => {
      return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
      }
    })

    return {
      isExternal,
      iconName,
      svgClass,
      styleExternalIcon
    }
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.225em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
