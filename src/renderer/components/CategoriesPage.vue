<template>
  <div class="container">
    <div class="info">共有 {{ Object.keys(categoriesList).length }} 个分类</div>
    <template v-for="value,key in categoriesList">
      <el-badge :value="value.length" class="item">
        <el-button size="small">{{ key }}</el-button>
      </el-badge>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'file-categories-page',
  computed: {
    ...mapGetters([
      'categoriesList'
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
