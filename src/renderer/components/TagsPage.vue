<template>
  <div class="container">
    <div class="info">共有 {{ Object.keys(tagsList).length }} 个标签</div>
    <template v-for="value,key in tagsList">
      <el-badge :value="value.length" class="item">
        <el-button size="small">{{ key }}</el-button>
      </el-badge>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'file-tags-page',
  computed: {
    ...mapGetters([
      'tagsList'
    ])
  },
  methods: {}
}
</script>

<style scoped>
.container {
  padding: 10px;
}

.info {
  margin-bottom: 20px;
}

.item {
  margin: 0 10px 10px 10px;
}
</style>
