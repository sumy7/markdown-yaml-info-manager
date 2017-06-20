<template>
  <div class="container">
    <div class="selecter">
      <el-input placeholder="请选择目录" v-model="dictorySelected" :disabled="true">
        <template slot="prepend">
          <el-button type="primary" @click="showFileDialog()">选择目录</el-button>
        </template>
      </el-input>
    </div>
    <div class="datatable">
      <div>共有 {{tableData.length}} 条记录</div>
      <el-table v-loading="isLoading" element-loading-text="拼命加载中" :data="tableData" style="width: 100%">
        <el-table-column prop="filename" label="文件名"> </el-table-column>
        <el-table-column prop="filesize" label="文件大小" fixed="right" width="100"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'file-listing-page',
  data() {
    return {
      dictorySelected: '',
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    showFileDialog() {
      const dialog = require('electron').remote.dialog
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (filename) => {
        if (filename.length === 1) {
          this.dictorySelected = filename[0]
          this.listingFile(this.dictorySelected)
        }
      })
    },
    listingFile(filepath) {
      this.isLoading = true
      const fs = require('fs')
      const path = require('path')
      fs.readdir(filepath, (err, file) => {
        if (err) {
          this.isLoading = false
          return alert(err)
        }
        this.tableData = []
        for (let filename of file) {
          const stat = fs.statSync(path.join(filepath, filename))
          if (stat.isFile()) {
            if (path.extname(filename).toLowerCase() === '.md') {
              this.tableData.push({
                filename: filename,
                filesize: stat.size
              })
            }
          }
        }
        this.isLoading = false
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
</style>
