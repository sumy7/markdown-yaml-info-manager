<template>
  <div class="container">
    <div class="info">共有 {{ categoriesList.length }} 个分类</div>
    <div class="searchBox">
      <el-input v-model="searchKey" placeholder="过滤" icon="search"></el-input>
    </div>
  
    <div class="categories-container">
      <template v-for="category in orderBy(filterBy(categoriesList, searchKey, 'name'), 'name')">
        <el-badge :value="category.list.length" class="item">
          <el-button size="small" @click.native="selectCategory(category.name)">{{ category.name }}</el-button>
        </el-badge>
      </template>
    </div>
  
    <el-table :data="listData" style="width: 100%" :empty-text="'请先选中一个分类'">
      <el-table-column prop="id" label="#" width="50">
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column label="Category" width="300">
        <template scope="scope">
          <el-tag v-for="category in scope.row.categories" :key="category" :closable="true" :type="'gray'" @close="removeCategory(scope.row.id, category)">
            {{category}}
          </el-tag>
          <el-input class="input-new-category" v-if="scope.row.id===addNewCategoryId" v-model="addNewCategoryInputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleAddNewCategoryInputConfirm" @blur="handleAddNewCategoryInputConfirm"></el-input>
          <el-button v-else class="button-new-category" size="small" @click="showAddNewCategoryInput(scope.row.id)">+ 添加新分类</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'file-categories-page',
  data() {
    return {
      categorySelected: '',
      addNewCategoryId: -1,
      addNewCategoryInputValue: '',
      searchKey: '',
      listData: []
    }
  },
  computed: {
    ...mapGetters([
      'categoriesList',
      'getArticleByCategoryName'
    ])
  },
  methods: {
    selectCategory(category) {
      this.categorySelected = category
      this.listData = this.getArticleByCategoryName(this.categorySelected)
    },
    showAddNewCategoryInput(id) {
      this.addNewCategoryId = id
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleAddNewCategoryInputConfirm() {
      let inputValue = this.addNewCategoryInputValue
      if (inputValue) {
        this.$store.dispatch('addCategoryToArticle', { articleId: this.addNewCategoryId, category: inputValue })
      }
      this.addNewCategoryId = -1
      this.addNewCategoryInputValue = ''
    },
    removeCategory(articleId, category) {
      this.$store.dispatch('removeCategoryFromArticle', { articleId, category })
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

.categories-container {
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

.button-new-category {
  padding: 5px 6px;
  margin: 2px;
  width: 85px;
}

.input-new-category {
  width: 85px;
}
</style>
