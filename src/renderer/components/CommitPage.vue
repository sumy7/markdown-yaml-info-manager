<template>
  <div class="container">
    <div>
      <el-steps :space="100" :active="steps" finish-status="success">
        <el-step title="欢迎"></el-step>
        <el-step title="总览"></el-step>
        <el-step title="确认写入"></el-step>
      </el-steps>
    </div>
    <div>
      <el-button style="margin: 12px;" @click="next" :disabled="steps>=3">下一步</el-button>
      <div class="button-info" v-if="steps===0">点击下一步，查看需要写入的文章</div>
      <div class="button-info" v-if="steps===1">点击下一步，预览文件被修改的部分</div>
      <div class="button-info" v-if="steps===2">点击下一步，开始写入文件</div>
      <div class="button-info" v-if="steps>=3">没有下一步了
        <el-button style="margin: 12px;" @click="goto1">返回</el-button>
      </div>
    </div>
    <div v-if="steps===0">
      <icon name="exclamation-triangle"></icon> 因涉及到文件操作，不敢轻举妄动，还是一步一步来吧
    </div>
    <div v-if="steps===1">
      <div style="margin-bottom: 10px;">共有 {{ changedArticleList.length }} 篇需要被修改的文章</div>
      <el-table :data="changedArticleList" style="width: 100%">
        <el-table-column prop="article.id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="article.title" label="文章标题">
        </el-table-column>
        <el-table-column label="分类修改" width="100">
          <template scope="scope">
            <i v-if="scope.row.categoryChange" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </template>
        </el-table-column>
        <el-table-column label="标签修改" width="100">
          <template scope="scope">
            <i v-if="scope.row.tagChange" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="steps===2">
      <div style="margin-bottom: 10px;">共有 {{ changedArticlePreview.length }} 篇需要被修改的文章</div>
      <el-table ref="multipleTable" :data="changedArticlePreview" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="title" label="文章标题">
        </el-table-column>
        <el-table-column type="expand">
          <template scope="scope">
            <pre>{{ scope.row.diff }}</pre>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="steps===3">
      <div>完成了 {{ changedArticlePreview.length }} 篇文章的修改，请用编辑器打开查看 </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const deepEqual = require('deep-equal')
const difflib = require('difflib')
const fs = require('hexo-fs')
const path = require('path')
const frontMatter = require('hexo-front-matter')

export default {
  name: 'file-commit-page',
  data() {
    return {
      steps: 0,
      changedArticleList: [],
      changedArticlePreview: [],
      dataSelection: []
    }
  },
  computed: {
    ...mapGetters({
      articlesList: 'articlesList',
      getFileById: 'getFileById',
      dictorySelected: 'directory'
    })
  },
  methods: {
    goto1() {
      this.steps = 0
    },
    handleSelectionChange(val) {
      this.dataSelection = val
    },
    next() {
      if (this.steps >= 4) return
      this.steps++
      if (this.steps === 1) {
        this.changedArticleList = []
        for (let article of this.articlesList) {
          const categoryEqual = deepEqual(article.categories, article.originCategories)
          const tagEqual = deepEqual(article.tags, article.originTags)
          if (!categoryEqual || !tagEqual) {
            this.changedArticleList.push({
              article: article,
              categoryChange: !categoryEqual,
              tagChange: !tagEqual
            })
          }
        }
        return
      }
      if (this.steps === 2) {
        for (let modifyArticle of this.changedArticleList) {
          const articleFile = this.getFileById(modifyArticle.article.id)
          if (articleFile) {
            const originFileContent = fs.readFileSync(path.join(this.dictorySelected, articleFile.filename))
            const parsedContent = frontMatter.parse(originFileContent)

            if (modifyArticle.categoryChange) {
              if (parsedContent.category) parsedContent['category'] = modifyArticle.article.categories
              else parsedContent['categories'] = modifyArticle.article.categories
            }
            if (modifyArticle.tagChange) {
              if (parsedContent.tag) parsedContent['tag'] = modifyArticle.article.tags
              else parsedContent['tags'] = modifyArticle.article.tags
            }
            const fileContent = frontMatter.stringify(parsedContent)
            const diff = difflib.unifiedDiff(originFileContent.split('\n'), fileContent.split('\n'), { fromfile: '原始内容', tofile: '修改内容', n: 1 })
            const diffcontext = []
            diffcontext.push(diff[0], diff[1], diff[2])
            for (var i = 3; i < diff.length; i++) {
              diffcontext.push(diff[i] + '\n')
            }
            this.changedArticlePreview.push({
              id: modifyArticle.article.id,
              title: modifyArticle.article.title,
              diff: diffcontext.join(''),
              changeTag: modifyArticle.tagChange,
              changeCategory: modifyArticle.categoryChange,
              tags: modifyArticle.article.tags,
              categories: modifyArticle.article.categories,
              state: 0
            })
          }
        }
      }
      if (this.steps === 3) {
        for (let modifyArticle of this.changedArticlePreview) {
          const articleFile = this.getFileById(modifyArticle.id)
          if (articleFile) {
            const originFileContent = fs.readFileSync(path.join(this.dictorySelected, articleFile.filename))
            const parsedContent = frontMatter.parse(originFileContent)

            if (modifyArticle.changeCategory) {
              if (parsedContent.category) parsedContent['category'] = modifyArticle.categories
              else parsedContent['categories'] = modifyArticle.categories
            }
            if (modifyArticle.changeTag) {
              if (parsedContent.tag) parsedContent['tag'] = modifyArticle.tags
              else parsedContent['tags'] = modifyArticle.tags
            }
            const fileContent = frontMatter.stringify(parsedContent)
            fs.writeFileSync(path.join(this.dictorySelected, articleFile.filename), fileContent)
            modifyArticle.state = 1
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}

.button-info {
  display: inline-block;
}
</style>
