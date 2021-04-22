<template>
  <div v-if="isShow" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-40">
    <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

    <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      <div class="modal-content py-4 text-left px-6">
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">{{ title }}</p>
          <div class="modal-close cursor-pointer z-50" @click="onCancel">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                 viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>
        <div>
          <slot name="body"></slot>
        </div>

        <div class="flex justify-end pt-2 space-x-2">
          <button type="button"
                  class="flex items-center justify-center w-24
                px-4 py-2
                text-sm text-white bg-blue-600 rounded-md border-gray-200
                hover:bg-blue-700
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
                  @click="onOk"
          >
            <span>确定</span>
          </button>
          <button type="button"
                  class="flex items-center justify-center w-24
                px-4 py-2
                text-sm text-black bg-white-600 rounded-md border-gray-200 border-2
                hover:bg-white-700
                focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
                  @click="onCancel"
          >
            <span>取消</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: 'Modal'
    }
  },
  emits: ['ok', 'cancel'],
  setup (props, context) {
    const isShow = ref(false)
    const onCancel = function () {
      context.emit('cancel')
      isShow.value = false
    }
    const onOk = function () {
      context.emit('ok')
      isShow.value = false
    }
    const openModal = function () {
      isShow.value = true
    }

    return {
      isShow,
      onCancel,
      onOk,
      openModal
    }
  }
})
</script>

<style scoped>

</style>
