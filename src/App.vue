<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { REQUEST_APP_LOCALE_EVENT } from '@/utils/events'

export default defineComponent({
  setup () {
    // 初始化当前的语言环境
    window.ipcRenderer.send(REQUEST_APP_LOCALE_EVENT)
    return {}
  }
})
</script>

<style>
body {
  height: 100vh;
}

#app {
  height: 100vh;
}

/* disable selection */
:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

input, button, textarea, :focus {
  outline: none;
}

a:not([draggable=true]), img:not([draggable=true]) {
  -webkit-user-drag: none;
  user-drag: none; /* Technically not supported in Electron yet */
}

a[href^="http://"],
a[href^="https://"],
a[href^="ftp://"] {
  -webkit-user-drag: auto;
  user-drag: auto; /* Technically not supported in Electron yet */
}
</style>
