<template>
  <div class="container">
    <div class="info">共有 {{ tagsList.length }} 个标签</div>
    <div class="searchBox">
      <el-input v-model="searchKey" placeholder="过滤" icon="search"></el-input>
    </div>
  
    <div class="tags-container">
      <template v-for="tag in orderBy(filterBy(tagsList, searchKey, 'name'), 'name')">
        <el-badge :value="tag.list.length" class="item">
          <el-button size="small" @click.native="selectTag(tag.name)">{{ tag.name }}</el-button>
        </el-badge>
      </template>
    </div>
  
    <el-table :data="listData" style="width: 100%" :empty-text="'请先选中一个标签'">
      <el-table-column prop="id" label="#" width="50">
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column label="Tags" width="300">
        <template scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" :closable="true" :type="'gray'" @close="removeTag(scope.row.id, tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="scope.row.id===addNewTagId" v-model="addNewTagInputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleAddNewTagInputConfirm" @blur="handleAddNewTagInputConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showAddNewTagInput(scope.row.id)">+ 添加新标签</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'file-tags-page',
  data() {
    return {
      tagSelected: '',
      addNewTagId: -1,
      addNewTagInputValue: '',
      searchKey: '',
      listData: []
    }
  },
  computed: {
    ...mapGetters([
      'tagsList',
      'getArticleByTagName'
    ])
  },
  methods: {
    selectTag(tag) {
      this.tagSelected = tag
      this.listData = this.getArticleByTagName(this.tagSelected)
    },
    showAddNewTagInput(id) {
      this.addNewTagId = id
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleAddNewTagInputConfirm() {
      let inputValue = this.addNewTagInputValue
      if (inputValue) {
        this.$store.dispatch('addTagToArticle', { articleId: this.addNewTagId, tag: inputValue })
      }
      this.addNewTagId = -1
      this.addNewTagInputValue = ''
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
  margin-bottom: 20px;
}

.item {
  margin: 0 10px 10px 10px;
}

.searchBox {
  width: 300px;
  margin-bottom: 20px;
}

.tags-container {
  padding: 10px 0;
  max-height: 300px;
  overflow: auto;
  margin-bottom: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
}
</style>

<style>
.el-tag {
  margin: 2px 2px;
}

.button-new-tag {
  padding: 5px 6px;
  margin: 2px;
  width: 85px;
}

.input-new-tag {
  width: 85px;
}
</style>
