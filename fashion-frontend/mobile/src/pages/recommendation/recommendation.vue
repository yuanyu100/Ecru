<template>
  <view class="recommendation-container">
    <!-- 场景选择器 -->
    <view class="scene-selector">
      <scroll-view scroll-x="true" class="scene-scroll">
        <view 
          v-for="scene in scenes" 
          :key="scene.value"
          class="scene-item"
          :class="{ active: selectedScene === scene.value }"
          @tap="selectScene(scene.value)"
        >
          {{ scene.label }}
        </view>
      </scroll-view>
    </view>

    <!-- 天气选择器 -->
    <view class="weather-selector">
      <scroll-view scroll-x="true" class="weather-scroll">
        <view 
          v-for="weather in weathers" 
          :key="weather.value"
          class="weather-item"
          :class="{ active: selectedWeather === weather.value }"
          @tap="selectWeather(weather.value)"
        >
          <text class="weather-icon">{{ weather.icon }}</text>
          <text class="weather-label">{{ weather.label }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐列表 -->
    <view class="recommendation-list">
      <view v-if="loading" class="loading-container">
        <uni-loading-spinner type="spin" size="24"></uni-loading-spinner>
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="recommendations.length === 0" class="empty-container">
        <text class="empty-icon">📸</text>
        <text class="empty-text">暂无推荐</text>
        <text class="empty-subtext">请先添加衣物到衣橱</text>
      </view>
      <view v-else class="recommendation-items">
        <view 
          v-for="(recommendation, index) in recommendations" 
          :key="index"
          class="recommendation-card"
        >
          <view class="outfit-container">
            <view class="outfit-items">
              <view class="outfit-item top">
                <image 
                  :src="recommendation.top.imageUrl || 'https://via.placeholder.com/100'" 
                  :alt="recommendation.top.name"
                  class="item-image"
                />
                <text class="item-name">{{ recommendation.top.name }}</text>
              </view>
              <view class="outfit-item bottom">
                <image 
                  :src="recommendation.bottom.imageUrl || 'https://via.placeholder.com/100'" 
                  :alt="recommendation.bottom.name"
                  class="item-image"
                />
                <text class="item-name">{{ recommendation.bottom.name }}</text>
              </view>
              <view class="outfit-item shoes">
                <image 
                  :src="recommendation.shoes.imageUrl || 'https://via.placeholder.com/100'" 
                  :alt="recommendation.shoes.name"
                  class="item-image"
                />
                <text class="item-name">{{ recommendation.shoes.name }}</text>
              </view>
            </view>
          </view>
          <view class="recommendation-info">
            <view class="recommendation-header">
              <text class="style-tag">{{ recommendation.style }}</text>
              <text class="score">{{ recommendation.score }}分</text>
            </view>
            <text class="occasion">{{ recommendation.occasion }} · {{ recommendation.weather }}</text>
            <text class="reason">{{ recommendation.reason }}</text>
            <view class="recommendation-actions">
              <button class="action-btn like" @tap="likeRecommendation(index)">
                <text class="btn-icon">❤️</text>
                <text>喜欢</text>
              </button>
              <button class="action-btn share" @tap="shareRecommendation(index)">
                <text class="btn-icon">📤</text>
                <text>分享</text>
              </button>
              <button class="action-btn save" @tap="saveOutfit(index)">
                <text class="btn-icon">💾</text>
                <text>保存</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 刷新按钮 -->
    <view class="refresh-container">
      <button class="refresh-btn" @tap="refreshRecommendations">
        <text class="refresh-icon">🔄</text>
        <text>刷新推荐</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../../../shared/api.js'

// 状态管理
const selectedScene = ref('daily')
const selectedWeather = ref('sunny')
const recommendations = ref([])
const loading = ref(false)

// 场景选项
const scenes = [
  { label: '日常', value: 'daily' },
  { label: '工作', value: 'work' },
  { label: '聚会', value: 'party' },
  { label: '运动', value: 'sports' },
  { label: '约会', value: 'date' }
]

// 天气选项
const weathers = [
  { label: '晴天', value: 'sunny', icon: '☀️' },
  { label: '阴天', value: 'cloudy', icon: '☁️' },
  { label: '雨天', value: 'rainy', icon: '🌧️' },
  { label: '雪天', value: 'snowy', icon: '❄️' },
  { label: '大风', value: 'windy', icon: '💨' }
]

// 选择场景
const selectScene = (scene) => {
  selectedScene.value = scene
  fetchRecommendations()
}

// 选择天气
const selectWeather = (weather) => {
  selectedWeather.value = weather
  fetchRecommendations()
}

// 获取推荐
const fetchRecommendations = async () => {
  loading.value = true
  try {
    const params = {
      occasion: selectedScene.value,
      weather: selectedWeather.value
    }
    const data = await api.recommendation.getRecommendations(params)
    recommendations.value = data.recommendations || []
  } catch (error) {
    console.error('获取推荐失败:', error)
    // 使用模拟数据
    useMockData()
  } finally {
    loading.value = false
  }
}

// 刷新推荐
const refreshRecommendations = () => {
  fetchRecommendations()
}

// 喜欢推荐
const likeRecommendation = (index) => {
  uni.showToast({
    title: '已添加到喜欢',
    icon: 'success'
  })
}

// 分享推荐
const shareRecommendation = (index) => {
  uni.showActionSheet({
    itemList: ['分享到微信', '分享到朋友圈', '保存图片'],
    success: function(res) {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      })
    }
  })
}

// 保存搭配
const saveOutfit = (index) => {
  uni.showToast({
    title: '已保存到搭配库',
    icon: 'success'
  })
}

// 使用模拟数据
const useMockData = () => {
  recommendations.value = [
    {
      outfitId: '1',
      top: {
        itemId: '101',
        name: '白色T恤',
        imageUrl: 'https://via.placeholder.com/100'
      },
      bottom: {
        itemId: '201',
        name: '蓝色牛仔裤',
        imageUrl: 'https://via.placeholder.com/100'
      },
      shoes: {
        itemId: '301',
        name: '白色运动鞋',
        imageUrl: 'https://via.placeholder.com/100'
      },
      accessories: [],
      style: '休闲',
      occasion: '日常',
      weather: '晴天',
      reason: '这套搭配色彩协调，适合春季日常穿着',
      score: 95
    },
    {
      outfitId: '2',
      top: {
        itemId: '102',
        name: '浅蓝色衬衫',
        imageUrl: 'https://via.placeholder.com/100'
      },
      bottom: {
        itemId: '202',
        name: '灰色休闲裤',
        imageUrl: 'https://via.placeholder.com/100'
      },
      shoes: {
        itemId: '302',
        name: '棕色皮鞋',
        imageUrl: 'https://via.placeholder.com/100'
      },
      accessories: [],
      style: '商务休闲',
      occasion: '工作',
      weather: '晴天',
      reason: '简约大方的商务休闲风格，适合办公室穿着',
      score: 92
    }
  ]
}

// 页面加载时获取推荐
onMounted(() => {
  fetchRecommendations()
})
</script>

<style scoped>
.recommendation-container {
  padding: 16rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 场景选择器 */
.scene-selector {
  margin-bottom: 16rpx;
}

.scene-scroll {
  white-space: nowrap;
  padding-bottom: 8rpx;
}

.scene-item {
  display: inline-block;
  padding: 12rpx 24rpx;
  margin-right: 12rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #606266;
  border: 2rpx solid #e4e7ed;
}

.scene-item.active {
  background-color: #409EFF;
  color: #ffffff;
  border-color: #409EFF;
}

/* 天气选择器 */
.weather-selector {
  margin-bottom: 24rpx;
}

.weather-scroll {
  white-space: nowrap;
  padding-bottom: 8rpx;
}

.weather-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  margin-right: 16rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  min-width: 120rpx;
  border: 2rpx solid #e4e7ed;
}

.weather-item.active {
  background-color: #409EFF;
  color: #ffffff;
  border-color: #409EFF;
}

.weather-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.weather-label {
  font-size: 24rpx;
}

/* 推荐列表 */
.recommendation-list {
  margin-bottom: 24rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.loading-text {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #606266;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #606266;
  margin-bottom: 8rpx;
}

.empty-subtext {
  font-size: 24rpx;
  color: #909399;
}

.recommendation-items {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.recommendation-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.outfit-container {
  margin-bottom: 20rpx;
}

.outfit-items {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.outfit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
}

.item-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-bottom: 8rpx;
}

.item-name {
  font-size: 20rpx;
  color: #606266;
  text-align: center;
  line-height: 1.2;
}

.recommendation-info {
  border-top: 1rpx solid #ebeef5;
  padding-top: 16rpx;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.style-tag {
  font-size: 24rpx;
  color: #409EFF;
  font-weight: 500;
}

.score {
  font-size: 24rpx;
  color: #F56C6C;
  font-weight: 500;
}

.occasion {
  font-size: 22rpx;
  color: #909399;
  margin-bottom: 12rpx;
}

.reason {
  font-size: 24rpx;
  color: #606266;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.recommendation-actions {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 16rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  border: none;
  font-size: 20rpx;
  color: #606266;
}

.action-btn.like {
  color: #F56C6C;
}

.action-btn.share {
  color: #67C23A;
}

.action-btn.save {
  color: #E6A23C;
}

.btn-icon {
  font-size: 32rpx;
  margin-bottom: 4rpx;
}

/* 刷新按钮 */
.refresh-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}

.refresh-btn {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #409EFF;
  color: #ffffff;
  border-radius: 24rpx;
  border: none;
  font-size: 28rpx;
}

.refresh-icon {
  margin-right: 8rpx;
  font-size: 24rpx;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .scene-item {
    font-size: 24rpx;
    padding: 10rpx 20rpx;
  }
  
  .weather-item {
    min-width: 100rpx;
  }
  
  .weather-icon {
    font-size: 40rpx;
  }
  
  .weather-label {
    font-size: 22rpx;
  }
  
  .outfit-item {
    width: 100rpx;
  }
  
  .item-image {
    width: 80rpx;
    height: 80rpx;
  }
  
  .item-name {
    font-size: 18rpx;
  }
}
</style>