<template>
  <div class="relative">
    <p @dblclick="onTextDblClick">{{ value }}</p>
    <input ref="editInput" v-if="isEdit" class="absolute top-0 z-20" v-model="editValue"
           @keyup.enter.prevent="onMaskClick">
    <div v-if="isEdit" class="fixed z-10 top-0 right-0 bottom-0 left-0"
         @click="onMaskClick"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'

export default defineComponent({
  name: 'EditableText',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  emits: ['valueChange'],
  setup (props, context) {
    const isEdit = ref(false)
    const editValue = ref('')
    const editInput = ref<HTMLInputElement | null>(null)
    const onTextDblClick = function () {
      editValue.value = props.value
      isEdit.value = true
      nextTick(() => {
        if (editInput.value !== null) {
          editInput.value.focus()
        }
      })
    }
    const onMaskClick = function () {
      isEdit.value = false
      if (editValue.value !== '' && editValue.value !== props.value) {
        context.emit('valueChange', props.value, editValue.value)
      }
    }
    return {
      isEdit,
      editValue,
      editInput,
      onTextDblClick,
      onMaskClick
    }
  }
})
</script>

<style scoped>

</style>
