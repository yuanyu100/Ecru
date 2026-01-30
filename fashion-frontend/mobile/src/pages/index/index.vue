<template>
  <view class="home">
    <!-- 顶部天气信息 -->
    <view class="weather-section">
      <view class="weather-info">
        <view class="weather-icon">
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunny%20weather%20icon&image_size=square" mode="aspectFit" />
        </view>
        <view class="weather-details">
          <view class="temperature">22°C</view>
          <view class="weather-desc">晴天</view>
          <view class="location">北京市</view>
        </view>
      </view>
      <view class="date-info">
        <view class="date">{{ currentDate }}</view>
        <view class="weekday">{{ currentWeekday }}</view>
      </view>
    </view>

    <!-- 今日OOTD推送 -->
    <view class="ootd-section">
      <view class="section-header">
        <text class="section-title">今日OOTD</text>
        <text class="section-more" @click="refreshOOTD">换一批</text>
      </view>
      <view class="ootd-card" @click="viewOOTDDetail">
        <view class="ootd-image">
          <image :src="currentOOTD.imageUrl" mode="aspectFill" />
        </view>
        <view class="ootd-info">
          <view class="ootd-title">{{ currentOOTD.title }}</view>
          <view class="ootd-description">{{ currentOOTD.description }}</view>
          <view class="ootd-tags">
            <text class="tag" v-for="tag in currentOOTD.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="ootd-score">
            <text class="score-label">推荐指数：</text>
            <text class="score">{{ currentOOTD.score }}分</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速拍照入口 -->
    <view class="camera-section">
      <view class="camera-card" @click="openCamera">
        <view class="camera-icon">
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=camera%20icon%20photography&image_size=square" mode="aspectFit" />
        </view>
        <view class="camera-text">
          <text class="camera-title">随手拍</text>
          <text class="camera-subtitle">快速分析穿搭</text>
        </view>
        <view class="camera-arrow">
          <text>→</text>
        </view>
      </view>
    </view>

    <!-- 场景推荐 -->
    <view class="scene-section">
      <view class="section-header">
        <text class="section-title">场景推荐</text>
        <text class="section-more" @click="viewAllScenes">查看全部</text>
      </view>
      <view class="scene-grid">
        <view class="scene-item" v-for="scene in scenes" :key="scene.id" @click="viewSceneRecommendations(scene.id)">
          <view class="scene-image">
            <image :src="scene.imageUrl" mode="aspectFill" />
          </view>
          <view class="scene-name">{{ scene.name }}</view>
        </view>
      </view>
    </view>

    <!-- 穿搭趋势 -->
    <view class="trend-section">
      <view class="section-header">
        <text class="section-title">穿搭趋势</text>
        <text class="section-more" @click="viewAllTrends">查看全部</text>
      </view>
      <view class="trend-list">
        <view class="trend-item" v-for="trend in trends" :key="trend.id" @click="viewTrendDetail(trend.id)">
          <view class="trend-image">
            <image :src="trend.imageUrl" mode="aspectFill" />
          </view>
          <view class="trend-info">
            <text class="trend-title">{{ trend.title }}</text>
            <text class="trend-description">{{ trend.description }}</text>
            <view class="trend-meta">
              <text class="trend-source">{{ trend.source }}</text>
              <text class="trend-date">{{ trend.date }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const currentDate = ref('')
const currentWeekday = ref('')

// OOTD数据
const currentOOTD = ref({
  imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20spring%20outfit%20with%20jeans%20and%20sweatshirt&image_size=portrait_4_3',
  title: '春季休闲搭配',
  description: '适合22°C的晴天，舒适又时尚',
  tags: ['休闲', '春季', '舒适'],
  score: 95
})

// 场景推荐数据
const scenes = ref([
  {
    id: 1,
    name: '日常通勤',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20casual%20outfit%20work&image_size=square'
  },
  {
    id: 2,
    name: '周末约会',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20date%20outfit%20weekend&image_size=square'
  },
  {
    id: 3,
    name: '运动健身',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20athletic%20outfit%20gym&image_size=square'
  },
  {
    id: 4,
    name: '派对聚会',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=party%20fashion%20outfit%20evening&image_size=square'
  }
])

// 穿搭趋势数据
const trends = ref([
  {
    id: 1,
    title: '2026春季流行色趋势',
    description: '今年春季最热门的色彩搭配方案',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%202026%20color%20trends%20fashion&image_size=landscape_4_3',
    source: '时尚杂志',
    date: '2026-01-20'
  },
  {
    id: 2,
    title: '复古风回潮',
    description: '80年代复古风格重新流行',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=80s%20retro%20fashion%20trend&image_size=landscape_4_3',
    source: '潮流博客',
    date: '2026-01-15'
  }
])

// 生命周期钩子
onMounted(() => {
  updateCurrentDate()
})

// 方法
const updateCurrentDate = () => {
  const now = new Date()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  currentDate.value = now.toLocaleDateString('zh-CN', options)
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
}

const refreshOOTD = () => {
  // 模拟刷新OOTD
  console.log('Refreshing OOTD')
}

const viewOOTDDetail = () => {
  // 跳转到OOTD详情页
  console.log('Viewing OOTD detail')
}

const openCamera = () => {
  // 调用相机
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      console.log('Camera selected:', res)
    }
  })
}

const viewSceneRecommendations = (sceneId) => {
  console.log('Viewing scene recommendations:', sceneId)
}

const viewAllScenes = () => {
  console.log('Viewing all scenes')
}

const viewTrendDetail = (trendId) => {
  console.log('Viewing trend detail:', trendId)
}

const viewAllTrends = () => {
  console.log('Viewing all trends')
}
</script>

<style scoped>
.home {
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 天气信息 */
.weather-section {
  background-color: #409EFF;
  color: white;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-info {
  display: flex;
  align-items: center;
}

.weather-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}

.weather-icon image {
  width: 100%;
  height: 100%;
}

.temperature {
  font-size: 40rpx;
  font-weight: bold;
}

.weather-desc {
  font-size: 28rpx;
  margin-top: 4rpx;
}

.location {
  font-size: 24rpx;
  margin-top: 4rpx;
  opacity: 0.9;
}

.date-info {
  text-align: right;
}

.date {
  font-size: 28rpx;
  font-weight: bold;
}

.weekday {
  font-size: 24rpx;
  margin-top: 4rpx;
  opacity: 0.9;
}

/* 通用 section 样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #303133;
}

.section-more {
  font-size: 24rpx;
  color: #409EFF;
}

/* OOTD 部分 */
.ootd-section {
  margin-top: 20rpx;
}

.ootd-card {
  background-color: white;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.ootd-image {
  width: 100%;
  height: 400rpx;
}

.ootd-image image {
  width: 100%;
  height: 100%;
}

.ootd-info {
  padding: 20rpx;
}

.ootd-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8rpx;
}

.ootd-description {
  font-size: 24rpx;
  color: #606266;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.ootd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.tag {
  font-size: 20rpx;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
}

.ootd-score {
  display: flex;
  align-items: center;
}

.score-label {
  font-size: 22rpx;
  color: #606266;
}

.score {
  font-size: 24rpx;
  font-weight: bold;
  color: #67C23A;
  margin-left: 8rpx;
}

/* 相机部分 */
.camera-section {
  margin-top: 20rpx;
}

.camera-card {
  background-color: white;
  margin: 0 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.camera-icon {
  width: 100rpx;
  height: 100rpx;
  margin-right: 30rpx;
}

.camera-icon image {
  width: 100%;
  height: 100%;
}

.camera-text {
  flex: 1;
}

.camera-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #303133;
  display: block;
  margin-bottom: 8rpx;
}

.camera-subtitle {
  font-size: 24rpx;
  color: #606266;
  display: block;
}

.camera-arrow {
  font-size: 32rpx;
  color: #909399;
}

/* 场景推荐部分 */
.scene-section {
  margin-top: 20rpx;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 0 20rpx;
}

.scene-item {
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.scene-image {
  width: 100%;
  height: 200rpx;
}

.scene-image image {
  width: 100%;
  height: 100%;
}

.scene-name {
  font-size: 24rpx;
  font-weight: bold;
  color: #303133;
  padding: 16rpx;
  text-align: center;
}

/* 趋势部分 */
.trend-section {
  margin-top: 20rpx;
  margin-bottom: 100rpx;
}

.trend-list {
  padding: 0 20rpx;
}

.trend-item {
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.trend-image {
  width: 100%;
  height: 240rpx;
}

.trend-image image {
  width: 100%;
  height: 100%;
}

.trend-info {
  padding: 20rpx;
}

.trend-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #303133;
  display: block;
  margin-bottom: 8rpx;
}

.trend-description {
  font-size: 24rpx;
  color: #606266;
  display: block;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.trend-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-source {
  font-size: 20rpx;
  color: #909399;
}

.trend-date {
  font-size: 20rpx;
  color: #909399;
}
</style>