<template>
  <view class="wardrobe">
    <!-- 顶部搜索和筛选 -->
    <view class="header-section">
      <view class="search-bar">
        <view class="search-input">
          <text class="search-icon">🔍</text>
          <input type="text" placeholder="搜索衣物" v-model="searchQuery" />
        </view>
        <button class="search-button" @click="searchItems">搜索</button>
      </view>
      <view class="filter-bar">
        <text class="filter-title">分类筛选：</text>
        <view class="filter-tabs">
          <text 
            class="filter-tab" 
            :class="{ active: activeCategory === 'all' }"
            @click="setCategory('all')"
          >
            全部
          </text>
          <text 
            class="filter-tab" 
            :class="{ active: activeCategory === 'top' }"
            @click="setCategory('top')"
          >
            上衣
          </text>
          <text 
            class="filter-tab" 
            :class="{ active: activeCategory === 'bottom' }"
            @click="setCategory('bottom')"
          >
            下装
          </text>
          <text 
            class="filter-tab" 
            :class="{ active: activeCategory === 'shoes' }"
            @click="setCategory('shoes')"
          >
            鞋子
          </text>
          <text 
            class="filter-tab" 
            :class="{ active: activeCategory === 'accessory' }"
            @click="setCategory('accessory')"
          >
            配饰
          </text>
        </view>
      </view>
    </view>

    <!-- 衣物列表 -->
    <view class="clothes-list">
      <view class="clothes-grid">
        <view class="clothes-item" v-for="item in filteredClothes" :key="item.id" @click="viewItemDetail(item.id)">
          <view class="clothes-image">
            <image :src="item.imageUrl" mode="aspectFill" />
            <view class="clothes-actions">
              <button class="action-button edit" @click.stop="editItem(item)">
                ✏️
              </button>
              <button class="action-button delete" @click.stop="deleteItem(item.id)">
                🗑️
              </button>
            </view>
          </view>
          <view class="clothes-info">
            <text class="clothes-name">{{ item.name }}</text>
            <text class="clothes-brand">{{ item.brand }}</text>
            <view class="clothes-tags">
              <text class="tag">{{ item.category }}</text>
              <text class="tag">{{ item.color.primary }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部添加按钮 -->
    <view class="add-button-container">
      <button class="add-button" @click="addNewItem">
        <text class="add-icon">+</text>
        <text class="add-text">添加衣物</text>
      </button>
    </view>

    <!-- 添加衣物对话框 -->
    <view class="modal" v-if="showAddModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">添加衣物</text>
          <button class="close-button" @click="showAddModal = false">✕</button>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">衣物名称</text>
            <input type="text" v-model="newItem.name" placeholder="请输入衣物名称" />
          </view>
          <view class="form-group">
            <text class="form-label">品牌</text>
            <input type="text" v-model="newItem.brand" placeholder="请输入品牌" />
          </view>
          <view class="form-group">
            <text class="form-label">分类</text>
            <picker range="{{ categories }}" v-model="newItem.categoryIndex">
              <view class="picker-content">
                {{ categories[newItem.categoryIndex] }}
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">颜色</text>
            <input type="text" v-model="newItem.color" placeholder="请输入颜色" />
          </view>
          <view class="form-group">
            <text class="form-label">材质</text>
            <input type="text" v-model="newItem.material" placeholder="请输入材质" />
          </view>
          <view class="form-group">
            <text class="form-label">上传图片</text>
            <button class="upload-button" @click="uploadImage">
              {{ newItem.imageUrl ? '更换图片' : '选择图片' }}
            </button>
            <view class="image-preview" v-if="newItem.imageUrl">
              <image :src="newItem.imageUrl" mode="aspectFill" />
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-button" @click="showAddModal = false">取消</button>
          <button class="confirm-button" @click="saveNewItem">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const searchQuery = ref('')
const activeCategory = ref('all')
const showAddModal = ref(false)

// 衣物数据
const clothes = ref([
  {
    id: 1,
    name: '白色T恤',
    brand: '优衣库',
    category: '上衣',
    color: { primary: '白色', secondary: '' },
    material: '棉',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20cotton%20t-shirt%20plain&image_size=square'
  },
  {
    id: 2,
    name: '牛仔裤',
    brand: 'Levis',
    category: '下装',
    color: { primary: '蓝色', secondary: '' },
    material: '牛仔布',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20jeans%20classic%20fit&image_size=square'
  },
  {
    id: 3,
    name: '小白鞋',
    brand: 'Nike',
    category: '鞋子',
    color: { primary: '白色', secondary: '' },
    material: '帆布',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20canvas%20sneakers%20nike&image_size=square'
  },
  {
    id: 4,
    name: '黑色外套',
    brand: 'Zara',
    category: '上衣',
    color: { primary: '黑色', secondary: '' },
    material: '羊毛',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20wool%20blazer%20formal&image_size=square'
  },
  {
    id: 5,
    name: '灰色卫衣',
    brand: 'Adidas',
    category: '上衣',
    color: { primary: '灰色', secondary: '' },
    material: '棉混纺',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20cotton%20blend%20hoodie&image_size=square'
  },
  {
    id: 6,
    name: '棕色皮带',
    brand: 'Gucci',
    category: '配饰',
    color: { primary: '棕色', secondary: '' },
    material: '皮革',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brown%20leather%20belt%20luxury&image_size=square'
  }
])

// 分类数据
const categories = ref(['上衣', '下装', '鞋子', '配饰', '外套'])

// 新衣物数据
const newItem = ref({
  name: '',
  brand: '',
  categoryIndex: 0,
  color: '',
  material: '',
  imageUrl: ''
})

// 计算属性
const filteredClothes = computed(() => {
  let result = clothes.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    const categoryMap = {
      top: '上衣',
      bottom: '下装',
      shoes: '鞋子',
      accessory: '配饰'
    }
    const category = categoryMap[activeCategory.value]
    result = result.filter(item => item.category === category)
  }
  
  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.brand.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 方法
const setCategory = (category) => {
  activeCategory.value = category
}

const searchItems = () => {
  console.log('Searching items with query:', searchQuery.value)
}

const viewItemDetail = (itemId) => {
  console.log('Viewing item detail:', itemId)
}

const editItem = (item) => {
  console.log('Editing item:', item)
}

const deleteItem = (itemId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这件衣物吗？',
    success: (res) => {
      if (res.confirm) {
        clothes.value = clothes.value.filter(item => item.id !== itemId)
        console.log('Item deleted:', itemId)
      }
    }
  })
}

const addNewItem = () => {
  showAddModal.value = true
  // 重置表单
  newItem.value = {
    name: '',
    brand: '',
    categoryIndex: 0,
    color: '',
    material: '',
    imageUrl: ''
  }
}

const uploadImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      newItem.value.imageUrl = res.tempFilePaths[0]
    }
  })
}

const saveNewItem = () => {
  if (!newItem.value.name || !newItem.value.brand) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  const item = {
    id: Date.now(),
    name: newItem.value.name,
    brand: newItem.value.brand,
    category: categories.value[newItem.value.categoryIndex],
    color: { primary: newItem.value.color, secondary: '' },
    material: newItem.value.material,
    imageUrl: newItem.value.imageUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=clothing%20placeholder&image_size=square'
  }
  
  clothes.value.push(item)
  showAddModal.value = false
  
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  })
}
</script>

<style scoped>
.wardrobe {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 100rpx;
}

/* 顶部搜索和筛选 */
.header-section {
  background-color: white;
  padding: 20rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 20rpx;
  padding: 12rpx 20rpx;
  display: flex;
  align-items: center;
}

.search-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
  color: #909399;
}

.search-input input {
  flex: 1;
  font-size: 24rpx;
  color: #303133;
}

.search-button {
  margin-left: 12rpx;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
}

.filter-bar {
  margin-top: 10rpx;
}

.filter-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12rpx;
  display: block;
}

.filter-tabs {
  display: flex;
  overflow-x: auto;
  gap: 12rpx;
  padding-bottom: 10rpx;
}

.filter-tab {
  font-size: 22rpx;
  color: #606266;
  background-color: #f5f7fa;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  white-space: nowrap;
}

.filter-tab.active {
  color: #409EFF;
  background-color: #ecf5ff;
}

/* 衣物列表 */
.clothes-list {
  padding: 20rpx;
}

.clothes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.clothes-item {
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.clothes-image {
  position: relative;
  width: 100%;
  height: 300rpx;
}

.clothes-image image {
  width: 100%;
  height: 100%;
}

.clothes-actions {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  display: flex;
  gap: 8rpx;
}

.action-button {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: none;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}

.action-button.edit {
  background-color: #E6A23C;
}

.action-button.delete {
  background-color: #F56C6C;
}

.clothes-info {
  padding: 16rpx;
}

.clothes-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4rpx;
  display: block;
}

.clothes-brand {
  font-size: 22rpx;
  color: #606266;
  margin-bottom: 8rpx;
  display: block;
}

.clothes-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  font-size: 20rpx;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
}

/* 底部添加按钮 */
.add-button-container {
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 30rpx;
  padding: 20rpx 40rpx;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.add-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.add-text {
  font-size: 24rpx;
  font-weight: bold;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-content {
  background-color: white;
  border-radius: 20rpx;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #e4e7ed;
}

.modal-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #303133;
}

.close-button {
  font-size: 28rpx;
  border: none;
  background: none;
  color: #909399;
}

.modal-body {
  padding: 20rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 24rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8rpx;
  display: block;
}

.form-group input {
  width: 100%;
  padding: 12rpx;
  border: 1px solid #dcdfe6;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.picker-content {
  padding: 12rpx;
  border: 1px solid #dcdfe6;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #303133;
}

.upload-button {
  width: 100%;
  padding: 12rpx;
  border: 1px dashed #dcdfe6;
  border-radius: 8rpx;
  background-color: #f5f7fa;
  font-size: 24rpx;
  color: #606266;
}

.image-preview {
  margin-top: 12rpx;
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.image-preview image {
  width: 100%;
  height: 100%;
}

.modal-footer {
  display: flex;
  gap: 12rpx;
  padding: 20rpx;
  border-top: 1px solid #e4e7ed;
}

.cancel-button {
  flex: 1;
  padding: 12rpx;
  border: 1px solid #dcdfe6;
  border-radius: 8rpx;
  background-color: white;
  font-size: 24rpx;
  color: #606266;
}

.confirm-button {
  flex: 1;
  padding: 12rpx;
  border: none;
  border-radius: 8rpx;
  background-color: #409EFF;
  font-size: 24rpx;
  color: white;
}
</style>