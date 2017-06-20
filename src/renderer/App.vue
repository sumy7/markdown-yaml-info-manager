<template>
  <div id="app">
    <page-frame></page-frame>
  </div>
</template>

<script>
import PageFrame from './components/PageFrame'

export default {
  name: 'markdown-yaml-info-manager',
  components: { PageFrame }
}
</script>

<style>
.fa-icon {
  height: 1em;
  width: 1em;
  bottom: -0.125em;
  position: relative;
}

* {
  padding: 0;
  margin: 0;
}
</style>
