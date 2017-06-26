<template>
  <div>
    <div class="sidebar">
      <el-menu default-active="1" :router="true">
        <el-menu-item index="1" :route="{ path: '/home' }">
          <icon name="home"></icon>&nbsp;&nbsp;首页
        </el-menu-item>
        <el-menu-item index="2" :route="{ path: '/files' }">
          <icon name="list"></icon>&nbsp;&nbsp;文件
        </el-menu-item>
        <el-menu-item index="2-0" :route="{ path: '/files/articles' }">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <icon name="file"></icon>&nbsp;&nbsp;【文章】整理
        </el-menu-item>
        <el-menu-item index="2-1" :route="{ path: '/files/categories' }">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <icon name="archive"></icon>&nbsp;&nbsp;【分类】整理
        </el-menu-item>
        <el-menu-item index="2-2" :route="{ path: '/files/tags' }">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <icon name="tags"></icon>&nbsp;&nbsp;【标签】整理
        </el-menu-item>
        <el-menu-item index="3" :route="{ path: '/sysinfo' }">
          <icon name="car"></icon>&nbsp;&nbsp;测试
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <div class="content-bg"></div>
      <lazy-render :maskClass="'loading-mask'" :tip="'正在加载，请稍后。。。'">
        <router-view></router-view>
      </lazy-render>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-frame'
}
</script>

<style>
a {
  text-decoration: none;
}

.sidebar {
  position: fixed;
  width: 300px;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #eef1f6;
}

.content {
  position: absolute;
  left: 300px;
  right: 0;
  top: 0;
  bottom: 0;
}

.content::before {
  content: "";
  display: inline-block;
}

.content-bg {
  position: fixed;
  top: 0;
  left: 300px;
  right: 0;
  bottom: 0;
  z-index: -1000;
  background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
}

.loading-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #ccc;
}
</style>
