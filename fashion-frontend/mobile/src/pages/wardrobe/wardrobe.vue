<template>
  <view class="wardrobe">
    <!-- 顶部区域 -->
    <view class="top-area">
      <view class="back-button" @click="goBack">
        <view class="back-arrow"></view>
      </view>
      <view class="page-title">我的衣橱</view>
      <view class="empty-space"></view>
    </view>

    <!-- 衣橱内容区域 -->
    <view class="wardrobe-content">
      <!-- 分类标签 -->
      <view class="category-tabs">
        <view 
          v-for="category in categories" 
          :key="category.id"
          class="category-tab"
          :class="{ 'active': activeCategory === category.id }"
          @click="switchCategory(category.id)"
        >
          <text>{{ category.name }}</text>
        </view>
      </view>

      <!-- 衣服列表 -->
      <view class="clothes-list">
        <view 
          v-for="(item, index) in filteredClothes" 
          :key="index"
          class="clothes-item"
          @click="viewClothesDetail(item)"
        >
          <view class="clothes-image-container">
            <view class="hanger"></view>
            <image :src="item.imageUrl" mode="aspectFit" />
          </view>
          <view class="clothes-info">
            <text class="clothes-name">{{ item.name }}</text>
            <view class="clothes-tags">
              <text 
                v-for="(tag, tagIndex) in item.tags" 
                :key="tagIndex"
                class="clothes-tag"
              >{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="filteredClothes.length === 0">
          <view class="empty-icon">👔</view>
          <text class="empty-text">衣橱空空如也</text>
          <text class="empty-subtext">点击右下角按钮添加衣物</text>
        </view>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-button" @click="toggleAddMenu">
      <text>+</text>
    </view>

    <!-- 添加菜单 -->
    <view class="add-menu" :class="{ 'open': addMenuOpen }">
      <view class="add-menu-content">
        <view class="add-option" @click="takePhoto">
          <view class="add-option-icon">📷</view>
          <text class="add-option-text">拍照</text>
        </view>
        <view class="add-option" @click="chooseFromAlbum">
          <view class="add-option-icon">🖼️</view>
          <text class="add-option-text">从相册选择</text>
        </view>
      </view>
      <view class="add-menu-backdrop" @click="closeAddMenu"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式数据
const activeCategory = ref('all')
const addMenuOpen = ref(false)

// 分类数据
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'top', name: '上衣' },
  { id: 'bottom', name: '下装' },
  { id: 'dress', name: '裙装' },
  { id: 'shoes', name: '鞋子' },
  { id: 'accessory', name: '配饰' }
])

// 衣服数据
const clothes = ref([
  {
    id: 1,
    name: '白色T恤',
    category: 'top',
    tags: ['#棉', '#白色', '#休闲'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20t-shirt%20minimalist%20style&image_size=square'
  },
  {
    id: 2,
    name: '蓝色牛仔裤',
    category: 'bottom',
    tags: ['#牛仔', '#蓝色', '#休闲'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20jeans%20minimalist%20style&image_size=square'
  },
  {
    id: 3,
    name: '黑色连衣裙',
    category: 'dress',
    tags: ['#连衣裙', '#黑色', '#优雅'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20dress%20minimalist%20style&image_size=square'
  },
  {
    id: 4,
    name: '白色运动鞋',
    category: 'shoes',
    tags: ['#运动鞋', '#白色', '#舒适'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20sneakers%20minimalist%20style&image_size=square'
  },
  {
    id: 5,
    name: '灰色毛衣',
    category: 'top',
    tags: ['#毛衣', '#灰色', '#保暖'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20sweater%20minimalist%20style&image_size=square'
  },
  {
    id: 6,
    name: '卡其色裤子',
    category: 'bottom',
    tags: ['#裤子', '#卡其色', '#休闲'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=khaki%20pants%20minimalist%20style&image_size=square'
  }
])

// 计算属性
const filteredClothes = computed(() => {
  if (activeCategory.value === 'all') {
    return clothes.value
  }
  return clothes.value.filter(item => item.category === activeCategory.value)
})

// 方法
const goBack = () => {
  uni.navigateBack()
}

const switchCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const viewClothesDetail = (item) => {
  console.log('View clothes detail:', item)
  // 这里可以添加跳转到衣物详情页的逻辑
}

const toggleAddMenu = () => {
  addMenuOpen.value = !addMenuOpen.value
}

const closeAddMenu = () => {
  addMenuOpen.value = false
}

const takePhoto = () => {
  closeAddMenu()
  // 调用相机
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      console.log('Camera selected:', res)
      // 这里可以添加处理相机拍摄的逻辑
    },
    fail: (err) => {
      console.error('Camera error:', err)
    }
  })
}

const chooseFromAlbum = () => {
  closeAddMenu()
  // 从相册选择
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      console.log('Album selected:', res)
      // 这里可以添加处理相册选择的逻辑
    },
    fail: (err) => {
      console.error('Album error:', err)
    }
  })
}
</script>

<style scoped>
.wardrobe {
  position: relative;
  min-height: 100vh;
  background-color: var(--bg-primary);
  overflow-x: hidden;
}

/* 顶部区域 */
.top-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.back-button {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-arrow {
  width: 16rpx;
  height: 16rpx;
  border-left: 2rpx solid var(--text-primary);
  border-top: 2rpx solid var(--text-primary);
  transform: rotate(-45deg);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.empty-space {
  width: 40rpx;
}

/* 衣橱内容区域 */
.wardrobe-content {
  padding: var(--spacing-md);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  overflow-x: auto;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  background-color: var(--bg-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.category-tab.active {
  background-color: var(--primary-color);
  color: white;
}

.category-tab text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.category-tab.active text {
  color: white;
}

/* 衣服列表 */
.clothes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.clothes-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.clothes-item:active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.clothes-image-container {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: var(--spacing-md);
}

.hanger {
  width: 60rpx;
  height: 2rpx;
  background-color: var(--text-tertiary);
  position: relative;
  margin-bottom: var(--spacing-xs);
}

.hanger::before {
  content: '';
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid var(--text-tertiary);
  border-radius: 50%;
}

.hanger::after {
  content: '';
  position: absolute;
  top: 2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 2rpx;
  height: 20rpx;
  background-color: var(--text-tertiary);
}

.clothes-image-container image {
  width: 100rpx;
  height: 100rpx;
  margin-top: var(--spacing-xs);
}

.clothes-info {
  flex: 1;
}

.clothes-name {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.clothes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.clothes-tag {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  background-color: var(--bg-tertiary);
  padding: 2rpx var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.empty-subtext {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

/* 添加按钮 */
.add-button {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-md);
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 100;
}

.add-button:active {
  transform: scale(1.1);
  background-color: var(--bg-secondary);
}

.add-button text {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

/* 添加菜单 */
.add-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
}

.add-menu.open {
  pointer-events: auto;
}

.add-menu-content {
  position: absolute;
  bottom: var(--spacing-xxl);
  right: var(--spacing-md);
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transform: translateY(20px);
  opacity: 0;
  transition: all var(--transition-normal);
  pointer-events: none;
}

.add-menu.open .add-menu-content {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.add-option {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.add-option:active {
  background-color: var(--bg-secondary);
}

.add-option-icon {
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-md);
}

.add-option-text {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.add-menu-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.add-menu.open .add-menu-backdrop {
  opacity: 1;
  pointer-events: auto;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.empty-subtext {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 320px) {
  .clothes-image-container {
    width: 100rpx;
    height: 100rpx;
  }
  
  .clothes-image-container image {
    width: 80rpx;
    height: 80rpx;
  }
}

@media (min-width: 414px) {
  .clothes-image-container {
    width: 140rpx;
    height: 140rpx;
  }
  
  .clothes-image-container image {
    width: 120rpx;
    height: 120rpx;
  }
}
</style>