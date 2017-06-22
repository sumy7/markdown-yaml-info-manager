<template>
  <div class="container">
    <div class="selecter">
      <el-input placeholder="请选择目录" :value="dictorySelected" :disabled="true">
        <template slot="prepend">
          <el-button type="primary" @click="showFileDialog()">选择目录</el-button>
        </template>
      </el-input>
    </div>
    <div class="datatable">
      <div>共有 {{tableData.length}} 条记录
        <span>
          <el-button type="primary" :disabled="tableData.length===0" @click="progressFileList()">开始处理</el-button>
        </span>
      </div>
      <el-table v-loading="isLoading" element-loading-text="拼命加载中" :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column prop="id" label="#" width="50"> </el-table-column>
        <el-table-column prop="filename" label="文件名"> </el-table-column>
        <el-table-column prop="filesize" label="文件大小" fixed="right" width="100"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const frontMatter = require('hexo-front-matter')
const fs = require('hexo-fs')
const path = require('path')

export default {
  name: 'file-listing-page',
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    dictorySelected() {
      return this.$store.getters.directory
    },
    tableData() {
      return this.$store.getters.files
    }
  },
  methods: {
    tableRowClassName(row, index) {
      if (row.state === 0) {
        return ''
      } else if (row.state === 1) {
        return 'info-row'
      } else if (row.state === 2) {
        return 'positive-row'
      } else if (row.state === 3) {
        return 'warning-row'
      }
      return ''
    },
    showFileDialog() {
      const dialog = require('electron').remote.dialog
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (filename) => {
        if (filename.length === 1) {
          this.$store.dispatch('changeDirectory', filename[0])
          this.listingFile(filename[0])
        }
      })
    },
    listingFile(filepath) {
      this.isLoading = true
      fs.readdir(filepath, (err, file) => {
        if (err) {
          this.isLoading = false
          return alert(err)
        }
        this.$store.dispatch('clearFiles')
        let tabledata = []
        let index = 0
        for (let filename of file) {
          const stat = fs.statSync(path.join(filepath, filename))
          if (stat.isFile()) {
            if (path.extname(filename).toLowerCase() === '.md') {
              tabledata.push({
                id: index++,
                filename: filename,
                filesize: stat.size,
                state: 0
              })
            }
          }
        }
        this.$store.dispatch('reveiveFiles', tabledata)
        this.isLoading = false
      })
    },
    progressFileList() {
      this.$store.dispatch('clearArticles')
      this.tableData.forEach((item) => {
        this.$store.dispatch('changeFileState', { id: item.id, state: 1 })
        const info = frontMatter.parse(fs.readFileSync(path.join(this.dictorySelected, item.filename)))
        if (info.category && !info.categories) {
          info.categories = info.category
          delete info.category
        }

        if (info.tag && !info.tags) {
          info.tags = info.tag
          delete info.tag
        }
        if (!info.date || !info.title || !info.tags || !info.categories) {
          console.log(info)
          this.$store.dispatch('changeFileState', { id: item.id, state: 3 })
        } else {
          let categories = info.categories || []
          let tags = info.tags || []

          if (!Array.isArray(categories)) categories = [categories]
          if (!Array.isArray(tags)) tags = [tags]

          this.$store.dispatch('addArticle', {
            id: item.id,
            title: info.title,
            date: info.date,
            categories: categories,
            tags: tags
          })
          this.$store.dispatch('changeFileState', { id: item.id, state: 2 })
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}

.datatable {
  margin-top: 10px;
}

.datatable .el-table {
  margin-top: 5px;
}
</style>
<style>
.datatable .el-table .info-row {
  background: #c9e5f5;
}

.datatable .el-table .positive-row {
  background: #e2f0e4;
}

.datatable .el-table .warning-row {
  background: #ffdb87;
}
</style>
