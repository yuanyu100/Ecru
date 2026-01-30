<template>
  <view class="app-container">
    <router-view></router-view>
  </view>
</template>

<script>
import store from './store'

export default {
  name: 'App',
  components: {},
  onLaunch() {
    console.log('App launched')
  },
  onShow() {
    console.log('App shown')
  },
  onHide() {
    console.log('App hidden')
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 通用样式 */
button {
  outline: none;
  cursor: pointer;
}

input {
  outline: none;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6rpx;
  height: 6rpx;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>