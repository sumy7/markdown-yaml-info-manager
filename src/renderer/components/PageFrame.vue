<template>
  <div>
    <div class="sidebar">
      <el-menu default-active="1">
        <router-link v-bind:to="'/home'">
          <el-menu-item index="1">
            <icon name="home"></icon>&nbsp;&nbsp;首页
          </el-menu-item>
        </router-link>
        <router-link v-bind:to="'/sysinfo'">
          <el-menu-item index="2">
            <icon name="car"></icon>&nbsp;&nbsp;测试
          </el-menu-item>
        </router-link>
      </el-menu>
    </div>
    <div class="content">
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
  margin-left: 300px;
  position: relative;
  width: calc(100% - 300px);
  min-height: 100vh;
  background: radial-gradient( ellipse at top left,
  rgba(255, 255, 255, 1) 40%,
  rgba(229, 229, 229, .9) 100%);
}
</style>
