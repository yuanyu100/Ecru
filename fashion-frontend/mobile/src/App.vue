<template>
  <view class="app-container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
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
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 触摸交互优化 */
.touchable {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
  user-select: none;
}

.touchable:active {
  opacity: 0.7;
  transform: scale(0.98);
}

/* 通用样式 */
button {
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

input {
  outline: none;
  -webkit-tap-highlight-color: transparent;
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

/* 响应式设计 */
@media (max-width: 320px) {
  :root {
    font-size: 12px;
  }
}

@media (min-width: 321px) and (max-width: 375px) {
  :root {
    font-size: 14px;
  }
}

@media (min-width: 376px) and (max-width: 414px) {
  :root {
    font-size: 15px;
  }
}

@media (min-width: 415px) {
  :root {
    font-size: 16px;
  }
}

/* 防止文本溢出 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 安全区域适配 */
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left, 0);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right, 0);
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}
</style>