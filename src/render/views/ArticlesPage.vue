<template>
  <div class="container">
    <div class="info">共有 {{ articlesList.length }} 篇文章</div>
    <el-table :data="articlesList" style="width: 100%">
      <el-table-column prop="id" label="#" width="50">
      </el-table-column>
      <el-table-column prop="title" label="文章标题">
      </el-table-column>
      <el-table-column label="时间" width="100">
        <template scope="scope">
          {{ scope.row.date | moment("YYYY-MM-DD") }}
        </template>
      </el-table-column>
      <el-table-column label="Category" width="220">
        <template scope="scope">
          <el-tag v-for="category in scope.row.categories" :key="category" :closable="true" :type="'gray'" @close="removeCategory(scope.row.id, category)">
            {{ category }}
          </el-tag>
          <el-input class="input-new-category" v-if="addNewType===0 && scope.row.id===addNewId" v-model="addNewInputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleAddNewInputConfirm" @blur="handleAddNewInputConfirm"></el-input>
          <el-button v-else class="button-new-category" size="small" @click="showAddNewInput(scope.row.id, 0)">+ 添加新分类</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Tag">
        <template scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" :closable="true" :type="'gray'" @close="removeTag(scope.row.id, tag)">
            {{ tag }}
          </el-tag>
          <el-input class="input-new-tag" v-if="addNewType===1 && scope.row.id===addNewId" v-model="addNewInputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleAddNewInputConfirm" @blur="handleAddNewInputConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showAddNewInput(scope.row.id, 1)">+ 添加新标签</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'file-articles-page',
  data() {
    return {
      addNewId: -1,
      addNewType: -1,
      addNewInputValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'articlesList'
    ])
  },
  methods: {
    showAddNewInput(id, type) {
      this.addNewType = type
      this.addNewId = id
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleAddNewInputConfirm() {
      let inputValue = this.addNewInputValue
      if (inputValue) {
        if (this.addNewType === 0) {
          this.$store.dispatch('addCategoryToArticle', { articleId: this.addNewId, category: inputValue })
        } else if (this.addNewType === 1) {
          this.$store.dispatch('addTagToArticle', { articleId: this.addNewId, tag: inputValue })
        }
      }
      this.addNewId = -1
      this.addNewType = -1
      this.addNewInputValue = ''
    },
    removeCategory(articleId, category) {
      this.$store.dispatch('removeCategoryFromArticle', { articleId, category })
    },
    removeTag(articleId, tag) {
      this.$store.dispatch('removeTagFromArticle', { articleId, tag })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}

.info {
  margin-bottom: 5px;
}

.el-tag {
  margin: 5px 2px;
}
</style>
