<template>
  <div>
    <div class="sidebar">
      <el-menu default-active="1">
        <router-link v-bind:to="'/home'">
          <el-menu-item index="1">
            <icon name="home"></icon>&nbsp;&nbsp;首页
          </el-menu-item>
        </router-link>
        <router-link v-bind:to="'/files'">
          <el-menu-item index="2">
            <icon name="list"></icon>&nbsp;&nbsp;文件
          </el-menu-item>
        </router-link>
        <router-link v-bind:to="'/sysinfo'">
          <el-menu-item index="3">
            <icon name="car"></icon>&nbsp;&nbsp;测试
          </el-menu-item>
        </router-link>
      </el-menu>
    </div>
    <div class="content">
      <div class="content-bg"></div>
      <router-view></router-view>
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
</style>
