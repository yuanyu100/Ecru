<template>
  <view class="home">
    <!-- 顶部区域 -->
    <view class="top-area">
      <view class="menu-icon tap-effect" @click="toggleDrawer">
        <view class="menu-line"></view>
        <view class="menu-line"></view>
        <view class="menu-line"></view>
      </view>
      <view class="settings-icon tap-effect" @click="toggleDrawer">
        <view class="menu-line"></view>
        <view class="menu-line"></view>
        <view class="menu-line"></view>
      </view>
    </view>

    <!-- 核心交互区 -->
    <view class="center-stage" :class="{ 'expanded': isExpanded }">
      <view class="prompt-text" :class="{ 'fade-out': isFading, 'fade-in': !isFading }">
        {{ promptText }}
      </view>
      <view class="input-container">
        <input 
          v-model="userInput" 
          class="input"
          placeholder=""
          @keyup.enter="handleSubmit"
        />
      </view>
    </view>

    <!-- 推荐流区域 -->
    <view class="recommendation-flow" v-if="showRecommendations">
      <view class="today-picks" v-if="!isExpanded">
        <view 
          v-for="(item, index) in todayPicks" 
          :key="index"
          class="pick-card image-hover"
          @dblclick="handleLike(index)"
          @longpress="handleDislike(index)"
        >
          <image :src="item.imageUrl" mode="aspectFill" />
          <view v-if="item.isLiked" class="like-overlay">
            <view class="heart-icon heartbeat">❤</view>
          </view>
        </view>
      </view>
      
      <view class="all-recommendations waterfall" v-if="isExpanded">
        <view 
          v-for="(item, index) in allRecommendations" 
          :key="index"
          class="recommendation-card image-hover"
          :class="{ 'small': index % 2 === 0, 'large': index % 2 === 1 }"
          @dblclick="handleLikeRecommendation(index)"
          @longpress="handleDislikeRecommendation(index)"
        >
          <image :src="item.imageUrl" mode="aspectFill" />
          <view v-if="item.isLiked" class="like-overlay">
            <view class="heart-icon heartbeat">❤</view>
          </view>
        </view>
      </view>

      <!-- 展开/收起箭头 -->
      <view class="expand-arrow tap-effect" @click="toggleExpand">
        <text v-if="!isExpanded">⌄</text>
        <text v-else>⌃</text>
      </view>
    </view>

    <!-- 侧边抽屉 -->
    <view class="drawer" :class="{ 'open': drawerOpen }">
      <view class="drawer-content glass">
        <view class="drawer-header">
          <view class="user-avatar">
            <text>U</text>
          </view>
          <text class="drawer-title">菜单</text>
        </view>
        <view class="drawer-menu">
          <view class="menu-item" @click="navigateToWardrobe">
            <text>我的衣橱</text>
          </view>
          <view class="menu-item" @click="navigateToSaved">
            <text>收藏灵感</text>
          </view>
          <view class="menu-item" @click="navigateToFabricWiki">
            <text>面料百科</text>
          </view>
          <view class="menu-item" @click="toggleTheme">
            <text>主题设置</text>
          </view>
          <view class="menu-item" @click="navigateToAbout">
            <text>关于我们</text>
          </view>
        </view>
        <view class="drawer-footer">
          <text class="drawer-version">V2.0 极简版</text>
        </view>
      </view>
      <view class="drawer-backdrop" @click="closeDrawer"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-overlay">
      <view class="loading-spinner"></view>
      <text class="loading-text">思考中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const drawerOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const showRecommendations = ref(true)
const isExpanded = ref(false)
const promptText = ref('上海 18°C，微风。')
const isFading = ref(false)

// 提示文字列表
const promptTexts = ref([
  '今天心情如何呢？',
  '想穿什么？',
  '那件克莱因蓝裙子好久没穿了'
])

// 今日精选数据
const todayPicks = ref([
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20spring%20outfit%20zen%20style&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20casual%20outfit%20warm%20colors&image_size=portrait_4_3',
    isLiked: false
  }
])

// 全部推荐数据
const allRecommendations = ref([
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20spring%20outfit%20zen%20style&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20casual%20outfit%20warm%20colors&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20casual%20office%20outfit&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=weekend%20casual%20outfit%20relaxed&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20summer%20outfit&image_size=portrait_4_3',
    isLiked: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20evening%20outfit&image_size=portrait_4_3',
    isLiked: false
  }
])

// 生命周期钩子
onMounted(() => {
  // 循环切换提示文字
  let currentIndex = 0
  setInterval(() => {
    // 开始淡出效果
    isFading.value = true
    
    // 等待淡出完成后切换文字
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % promptTexts.value.length
      promptText.value = promptTexts.value[currentIndex]
      
      // 开始淡入效果
      setTimeout(() => {
        isFading.value = false
      }, 100)
    }, 800)
  }, 8000) // 延长切换间隔
})

// 方法
const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const handleSubmit = () => {
  if (userInput.value.trim()) {
    isLoading.value = true
    // 模拟AI思考
    setTimeout(() => {
      isLoading.value = false
      // 跳转到AI响应页
      uni.navigateTo({
        url: '/pages/ai-answer/ai-answer'
      })
      userInput.value = ''
    }, 1500)
  }
}

const handleLike = (index) => {
  todayPicks.value[index].isLiked = true
  // 模拟红心飞入动画
  setTimeout(() => {
    todayPicks.value[index].isLiked = false
  }, 1500)
}

const handleDislike = (index) => {
  // 模拟烟雾消散动画
  todayPicks.value[index].isDisliked = true
  setTimeout(() => {
    // 移除当前项并添加新项
    todayPicks.value.splice(index, 1)
    todayPicks.value.push({
      imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20outfit%20${Math.random()}&image_size=portrait_4_3`,
      isLiked: false
    })
  }, 800)
}

const handleLikeRecommendation = (index) => {
  allRecommendations.value[index].isLiked = true
  setTimeout(() => {
    allRecommendations.value[index].isLiked = false
  }, 1500)
}

const handleDislikeRecommendation = (index) => {
  allRecommendations.value[index].isDisliked = true
  setTimeout(() => {
    allRecommendations.value.splice(index, 1)
    allRecommendations.value.push({
      imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20outfit%20${Math.random()}&image_size=portrait_4_3`,
      title: '新推荐',
      tags: ['新', '推荐'],
      isLiked: false
    })
  }, 800)
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const toggleTheme = () => {
  // 模拟主题切换
  console.log('Toggle theme')
  closeDrawer()
}

const navigateToWardrobe = () => {
  uni.navigateTo({
    url: '/pages/wardrobe/wardrobe'
  })
  closeDrawer()
}

const navigateToSaved = () => {
  console.log('Navigate to saved')
  closeDrawer()
}

const navigateToFabricWiki = () => {
  console.log('Navigate to fabric wiki')
  closeDrawer()
}

const navigateToAbout = () => {
  console.log('Navigate to about')
  closeDrawer()
}
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  background-color: var(--bg-primary);
  overflow-x: hidden;
}

/* 顶部区域 */
.top-area {
  padding: var(--spacing-lg) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  position: relative;
  width: 100%;
}

.menu-icon, .settings-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  padding: 8rpx 0;
  z-index: 1000;
}

.menu-line {
  width: 100%;
  height: 2rpx;
  background-color: var(--text-primary);
  border-radius: 1rpx;
  transition: all 0.3s ease;
}

.settings-icon {
  opacity: 0.7;
}

/* 核心交互区 */
.center-stage {
  position: relative;
  padding: var(--spacing-lg) var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  height: calc(100vh - 100rpx);
  transition: all 0.5s ease;
}

.center-stage.expanded {
  transform: translateY(-50rpx);
}

.prompt-text {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
  line-height: 1.4;
  opacity: 1;
  transition: opacity 1.5s ease-in-out;
}

.prompt-text.fade-in {
  animation: fadeIn 2s ease-out forwards;
}

.prompt-text.fade-out {
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.input-container {
  width: 80%;
  max-width: 500rpx;
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md);
  border: none;
  border-bottom: 1px solid var(--border-normal);
  border-radius: 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  background-color: transparent;
  transition: border-color 0.3s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  text-align: center;
  height: 60rpx;
}

.input:focus {
  border-bottom-color: var(--primary-color);
  background-color: transparent;
}

.input::placeholder {
  color: var(--text-tertiary);
  font-style: italic;
}

/* 推荐流区域 */
.recommendation-flow {
  padding: 0;
  position: relative;
  margin-top: var(--spacing-lg);
}

.today-picks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.pick-card {
  width: 100%;
  height: 400rpx;
  border-radius: 0;
  overflow: hidden;
  position: relative;
}

.pick-card image {
  width: 100%;
  height: 100%;
}

.like-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.heart-icon {
  font-size: 80rpx;
  color: var(--accent-color);
}

/* 瀑布流布局 - 移除边距和突兀背景 */
.all-recommendations.waterfall {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rpx;
  margin-bottom: var(--spacing-xxl);
  padding: 0;
}

.recommendation-card {
  border-radius: 0;
  overflow: hidden;
  position: relative;
  background-color: transparent;
}

.recommendation-card.small {
  grid-row: span 1;
  aspect-ratio: 3/4;
}

.recommendation-card.large {
  grid-row: span 2;
  aspect-ratio: 3/5;
}

.recommendation-card image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 展开/收起箭头 */
.expand-arrow {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  font-size: 64rpx;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-md);
  transition: transform 0.3s ease, color 0.3s ease;
  z-index: 100;
  background-color: rgba(250, 250, 245, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-arrow:active {
  transform: scale(1.1);
  color: var(--text-primary);
}

/* 侧边抽屉 */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.drawer.open {
  pointer-events: auto;
}

.drawer-content {
  position: absolute;
  top: 0;
  left: -100%;
  width: 70%;
  height: 100%;
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: auto;
  overflow-y: auto;
  z-index: 1000;
}

.drawer.open .drawer-content {
  left: 0;
}

.drawer-header {
  margin-bottom: var(--spacing-xxl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.drawer-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.drawer-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.menu-item {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.menu-item:active {
  opacity: 0.7;
  transform: translateX(10rpx);
}

.menu-item text {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.drawer-footer {
  margin-top: var(--spacing-xxl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  text-align: center;
}

.drawer-version {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.drawer-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 999;
}

.drawer.open .drawer-backdrop {
  opacity: 1;
  pointer-events: auto;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(250, 250, 245, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--border-light);
  border-top: 4rpx solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-style: italic;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 淡入淡出切换动画 */
.prompt-text {
  transition: opacity 1.5s ease-in-out;
}

.prompt-text.fade-out {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 320px) {
  .center-stage {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .prompt-text {
    font-size: var(--font-size-lg);
  }
  
  .input-container {
    width: 90%;
  }
  
  .all-recommendations.waterfall {
    grid-template-columns: 1fr;
  }
  
  .expand-arrow {
    font-size: 48rpx;
    width: 64rpx;
    height: 64rpx;
  }
}

@media (min-width: 414px) {
  .center-stage {
    min-height: 350rpx;
  }
  
  .pick-card {
    height: 450rpx;
  }
}
</style>