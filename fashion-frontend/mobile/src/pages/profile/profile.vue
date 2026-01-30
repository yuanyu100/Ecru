<template>
  <view class="profile-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-info">
        <image 
          :src="userInfo.avatar || 'https://via.placeholder.com/100'" 
          class="avatar"
          @tap="chooseAvatar"
        ></image>
        <view class="user-details">
          <text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
          <text class="email">{{ userInfo.email || '点击登录' }}</text>
        </view>
        <button 
          class="login-btn" 
          @tap="handleLogin"
          v-if="!isLoggedIn"
        >
          <text>登录</text>
        </button>
        <button 
          class="settings-btn" 
          @tap="openSettings"
          v-else
        >
          <text class="settings-icon">⚙️</text>
        </button>
      </view>
    </view>

    <!-- 统计信息 -->
    <view v-if="isLoggedIn" class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ stats.wardrobeCount }}</text>
        <text class="stat-label">衣橱单品</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.outfitCount }}</text>
        <text class="stat-label">搭配方案</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.favoriteCount }}</text>
        <text class="stat-label">收藏搭配</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.analysisCount }}</text>
        <text class="stat-label">分析次数</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="feature-section">
      <view class="feature-group">
        <text class="group-title">我的穿搭</text>
        <view class="feature-items">
          <view class="feature-item" @tap="navigateTo('wardrobe')">
            <text class="feature-icon">👗</text>
            <text class="feature-label">我的衣橱</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="navigateTo('outfits')">
            <text class="feature-icon">👔</text>
            <text class="feature-label">我的搭配</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="navigateTo('favorites')">
            <text class="feature-icon">❤️</text>
            <text class="feature-label">我的收藏</text>
            <text class="feature-arrow">→</text>
          </view>
        </view>
      </view>

      <view class="feature-group">
        <text class="group-title">设置与偏好</text>
        <view class="feature-items">
          <view class="feature-item" @tap="openStylePreferences">
            <text class="feature-icon">🎨</text>
            <text class="feature-label">风格偏好</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="openSizePreferences">
            <text class="feature-icon">📏</text>
            <text class="feature-label">尺码设置</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="openNotificationSettings">
            <text class="feature-icon">🔔</text>
            <text class="feature-label">通知设置</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="openPrivacySettings">
            <text class="feature-icon">🔒</text>
            <text class="feature-label">隐私设置</text>
            <text class="feature-arrow">→</text>
          </view>
        </view>
      </view>

      <view class="feature-group">
        <text class="group-title">其他</text>
        <view class="feature-items">
          <view class="feature-item" @tap="openAbout">
            <text class="feature-icon">ℹ️</text>
            <text class="feature-label">关于我们</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="openFeedback">
            <text class="feature-icon">💬</text>
            <text class="feature-label">意见反馈</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="openHelp">
            <text class="feature-icon">❓</text>
            <text class="feature-label">帮助中心</text>
            <text class="feature-arrow">→</text>
          </view>
          <view class="feature-item" @tap="logout" v-if="isLoggedIn">
            <text class="feature-icon">🚪</text>
            <text class="feature-label" style="color: #F56C6C;">退出登录</text>
            <text class="feature-arrow">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-section">
      <text class="version-text">版本 {{ appVersion }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../../../shared/api.js'

// 状态管理
const userInfo = ref({
  avatar: '',
  nickname: '',
  email: ''
})
const stats = ref({
  wardrobeCount: 0,
  outfitCount: 0,
  favoriteCount: 0,
  analysisCount: 0
})
const appVersion = ref('1.0.0')

// 计算属性
const isLoggedIn = computed(() => {
  return !!userInfo.value.email && userInfo.value.email !== '点击登录'
})

// 页面加载
onMounted(() => {
  loadUserData()
  loadStats()
})

// 加载用户数据
const loadUserData = () => {
  // 从本地存储获取用户信息
  const storedUser = uni.getStorageSync('userInfo')
  if (storedUser) {
    userInfo.value = storedUser
  }
}

// 加载统计数据
const loadStats = () => {
  // 模拟数据
  stats.value = {
    wardrobeCount: 42,
    outfitCount: 15,
    favoriteCount: 8,
    analysisCount: 23
  }
}

// 处理登录
const handleLogin = () => {
  uni.navigateTo({
    url: '../login/login'
  })
}

// 打开设置
const openSettings = () => {
  uni.showActionSheet({
    itemList: ['账号设置', '偏好设置', '系统设置'],
    success: function(res) {
      switch (res.tapIndex) {
        case 0:
          // 账号设置
          break
        case 1:
          // 偏好设置
          break
        case 2:
          // 系统设置
          break
      }
    }
  })
}

// 选择头像
const chooseAvatar = () => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
      uni.setStorageSync('userInfo', userInfo.value)
      uni.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

// 导航到其他页面
const navigateTo = (page) => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  switch (page) {
    case 'wardrobe':
      uni.switchTab({
        url: '../wardrobe/wardrobe'
      })
      break
    case 'outfits':
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
      break
    case 'favorites':
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
      break
  }
}

// 打开风格偏好设置
const openStylePreferences = () => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  uni.showModal({
    title: '风格偏好',
    content: '选择您喜欢的风格',
    showCancel: false,
    success: function() {
      uni.showToast({
        title: '偏好设置已保存',
        icon: 'success'
      })
    }
  })
}

// 打开尺码设置
const openSizePreferences = () => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  uni.showModal({
    title: '尺码设置',
    content: '设置您的常用尺码',
    showCancel: false,
    success: function() {
      uni.showToast({
        title: '尺码设置已保存',
        icon: 'success'
      })
    }
  })
}

// 打开通知设置
const openNotificationSettings = () => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  uni.showModal({
    title: '通知设置',
    content: '设置您的通知偏好',
    showCancel: false,
    success: function() {
      uni.showToast({
        title: '通知设置已保存',
        icon: 'success'
      })
    }
  })
}

// 打开隐私设置
const openPrivacySettings = () => {
  if (!isLoggedIn.value) {
    handleLogin()
    return
  }

  uni.showModal({
    title: '隐私设置',
    content: '管理您的隐私选项',
    showCancel: false,
    success: function() {
      uni.showToast({
        title: '隐私设置已保存',
        icon: 'success'
      })
    }
  })
}

// 打开关于我们
const openAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '穿搭推荐系统 v1.0.0\n基于Spring Boot + AI Agent\n\n让穿搭更智能，让生活更美好',
    showCancel: false
  })
}

// 打开意见反馈
const openFeedback = () => {
  uni.showModal({
    title: '意见反馈',
    content: '请输入您的反馈意见',
    editable: true,
    success: function(res) {
      if (res.confirm) {
        uni.showToast({
          title: '反馈提交成功',
          icon: 'success'
        })
      }
    }
  })
}

// 打开帮助中心
const openHelp = () => {
  uni.showModal({
    title: '帮助中心',
    content: '常见问题和使用指南',
    showCancel: false
  })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: function(res) {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
        
        // 重置用户信息
        userInfo.value = {
          avatar: '',
          nickname: '',
          email: ''
        }
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  padding: 16rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 用户信息区域 */
.user-info-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 20rpx;
}

.user-details {
  flex: 1;
}

.nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8rpx;
}

.email {
  font-size: 24rpx;
  color: #606266;
}

.login-btn {
  padding: 12rpx 24rpx;
  background-color: #409EFF;
  color: #ffffff;
  border-radius: 20rpx;
  border: none;
  font-size: 24rpx;
}

.settings-btn {
  padding: 12rpx;
  background-color: transparent;
  border: none;
}

.settings-icon {
  font-size: 36rpx;
}

/* 统计信息 */
.stats-section {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 20rpx;
  color: #606266;
}

/* 功能列表 */
.feature-section {
  margin-bottom: 32rpx;
}

.feature-group {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.group-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #303133;
  padding: 20rpx 24rpx 12rpx;
}

.feature-items {
  border-top: 1rpx solid #ebeef5;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #ebeef5;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  width: 40rpx;
  text-align: center;
}

.feature-label {
  flex: 1;
  font-size: 28rpx;
  color: #303133;
}

.feature-arrow {
  font-size: 24rpx;
  color: #909399;
}

/* 版本信息 */
.version-section {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
}

.version-text {
  font-size: 24rpx;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .nickname {
    font-size: 28rpx;
  }
  
  .email {
    font-size: 22rpx;
  }
  
  .stat-value {
    font-size: 28rpx;
  }
  
  .stat-label {
    font-size: 18rpx;
  }
  
  .feature-label {
    font-size: 26rpx;
  }
}
</style>