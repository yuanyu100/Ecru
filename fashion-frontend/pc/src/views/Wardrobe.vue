<template>
  <div class="wardrobe">
    <!-- 顶部导航栏 -->
    <el-header height="60px" class="header">
      <div class="logo">穿搭推荐系统</div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-name">用户中心</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人资料</el-dropdown-item>
              <el-dropdown-item>系统设置</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 侧边导航栏 -->
    <el-container class="main-container">
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><PieChart /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/wardrobe">
            <el-icon><Collection /></el-icon>
            <span>衣橱管理</span>
          </el-menu-item>
          <el-menu-item index="/analysis">
            <el-icon><DataAnalysis /></el-icon>
            <span>分析报告</span>
          </el-menu-item>
          <el-menu-item index="/knowledge">
            <el-icon><Document /></el-icon>
            <span>知识库</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="content">
        <div class="page-header">
          <h1 class="page-title">衣橱管理</h1>
          <div class="page-actions">
            <el-button type="primary" size="small" @click="openAddItemDialog">
              <el-icon><Plus /></el-icon>
              <span>添加衣物</span>
            </el-button>
            <el-button type="success" size="small" @click="importItems">
              <el-icon><Upload /></el-icon>
              <span>批量导入</span>
            </el-button>
          </div>
        </div>

        <!-- 筛选区域 -->
        <el-card class="filter-card">
          <el-form :inline="true" class="filter-form">
            <el-form-item label="分类">
              <el-select v-model="filter.category" placeholder="选择分类">
                <el-option label="全部" value="" />
                <el-option label="上衣" value="上衣" />
                <el-option label="下装" value="下装" />
                <el-option label="鞋子" value="鞋子" />
                <el-option label="配饰" value="配饰" />
                <el-option label="外套" value="外套" />
              </el-select>
            </el-form-item>
            <el-form-item label="颜色">
              <el-select v-model="filter.color" placeholder="选择颜色">
                <el-option label="全部" value="" />
                <el-option label="红色" value="红色" />
                <el-option label="蓝色" value="蓝色" />
                <el-option label="黑色" value="黑色" />
                <el-option label="白色" value="白色" />
                <el-option label="灰色" value="灰色" />
              </el-select>
            </el-form-item>
            <el-form-item label="季节">
              <el-select v-model="filter.season" placeholder="选择季节">
                <el-option label="全部" value="" />
                <el-option label="春季" value="春季" />
                <el-option label="夏季" value="夏季" />
                <el-option label="秋季" value="秋季" />
                <el-option label="冬季" value="冬季" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filter.keyword" placeholder="搜索衣物名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchItems">搜索</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 衣物列表 -->
        <el-card class="wardrobe-card">
          <template #header>
            <div class="card-header">
              <span>衣物列表</span>
              <div class="item-count">{{ wardrobeItems.length }} 件衣物</div>
            </div>
          </template>
          
          <div class="wardrobe-grid">
            <div class="wardrobe-item" v-for="item in wardrobeItems" :key="item.id">
              <div class="item-image">
                <img :src="item.imageUrl" alt="衣物图片" />
                <div class="item-actions">
                  <el-button size="small" circle @click="editItem(item)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button size="small" type="danger" circle @click="deleteItem(item.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-brand">{{ item.brand }}</p>
                <div class="item-tags">
                  <el-tag size="small">{{ item.category }}</el-tag>
                  <el-tag size="small" type="info">{{ item.color.primary }}</el-tag>
                  <el-tag size="small" type="success">{{ item.material }}</el-tag>
                </div>
                <div class="item-frequency">
                  <span>搭配频率：</span>
                  <el-rate v-model="item.frequency" disabled show-score />
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[12, 24, 36, 48]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalItems"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-main>
    </el-container>

    <!-- 添加衣物对话框 -->
    <el-dialog
      v-model="addItemDialogVisible"
      title="添加衣物"
      width="500px"
    >
      <el-form :model="newItem" label-width="80px">
        <el-form-item label="衣物名称">
          <el-input v-model="newItem.name" placeholder="请输入衣物名称" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="newItem.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="newItem.category" placeholder="请选择分类">
            <el-option label="上衣" value="上衣" />
            <el-option label="下装" value="下装" />
            <el-option label="鞋子" value="鞋子" />
            <el-option label="配饰" value="配饰" />
            <el-option label="外套" value="外套" />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="newItem.color.primary" placeholder="请输入主色调" />
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="newItem.material" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="尺寸">
          <el-input v-model="newItem.size" placeholder="请输入尺寸" />
        </el-form-item>
        <el-form-item label="搭配频率">
          <el-rate v-model="newItem.frequency" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleImageUpload"
            accept="image/*"
          >
            <img v-if="newItem.imageUrl" :src="newItem.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addItemDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveItem">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PieChart, Collection, DataAnalysis, Document, Setting, Plus, Upload, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
const activeMenu = computed(() => useRoute().path)
const filter = ref({
  category: '',
  color: '',
  season: '',
  keyword: ''
})
const currentPage = ref(1)
const pageSize = ref(12)
const totalItems = ref(48)

// 衣物数据
const wardrobeItems = ref([
  {
    id: 1,
    name: '白色T恤',
    brand: '优衣库',
    category: '上衣',
    color: { primary: '白色', secondary: '' },
    material: '棉',
    size: 'M',
    frequency: 5,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20cotton%20t-shirt%20plain&image_size=square'
  },
  {
    id: 2,
    name: '牛仔裤',
    brand: 'Levis',
    category: '下装',
    color: { primary: '蓝色', secondary: '' },
    material: '牛仔布',
    size: 'M',
    frequency: 4,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20jeans%20classic%20fit&image_size=square'
  },
  {
    id: 3,
    name: '小白鞋',
    brand: 'Nike',
    category: '鞋子',
    color: { primary: '白色', secondary: '' },
    material: '帆布',
    size: '42',
    frequency: 5,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20canvas%20sneakers%20nike&image_size=square'
  },
  {
    id: 4,
    name: '黑色外套',
    brand: 'Zara',
    category: '外套',
    color: { primary: '黑色', secondary: '' },
    material: '羊毛',
    size: 'M',
    frequency: 3,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20wool%20blazer%20formal&image_size=square'
  },
  {
    id: 5,
    name: '灰色卫衣',
    brand: 'Adidas',
    category: '上衣',
    color: { primary: '灰色', secondary: '' },
    material: '棉混纺',
    size: 'M',
    frequency: 4,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20cotton%20blend%20hoodie&image_size=square'
  },
  {
    id: 6,
    name: '棕色皮带',
    brand: 'Gucci',
    category: '配饰',
    color: { primary: '棕色', secondary: '' },
    material: '皮革',
    size: '100cm',
    frequency: 3,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brown%20leather%20belt%20luxury&image_size=square'
  }
])

// 对话框状态
const addItemDialogVisible = ref(false)
const newItem = ref({
  name: '',
  brand: '',
  category: '',
  color: { primary: '', secondary: '' },
  material: '',
  size: '',
  frequency: 3,
  imageUrl: ''
})

// 方法
const searchItems = () => {
  // 实现搜索逻辑
  console.log('Searching with filter:', filter.value)
}

const resetFilter = () => {
  filter.value = {
    category: '',
    color: '',
    season: '',
    keyword: ''
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const openAddItemDialog = () => {
  addItemDialogVisible.value = true
  // 重置表单
  newItem.value = {
    name: '',
    brand: '',
    category: '',
    color: { primary: '', secondary: '' },
    material: '',
    size: '',
    frequency: 3,
    imageUrl: ''
  }
}

const saveItem = () => {
  // 实现保存逻辑
  console.log('Saving item:', newItem.value)
  addItemDialogVisible.value = false
}

const editItem = (item) => {
  console.log('Editing item:', item)
}

const deleteItem = (id) => {
  console.log('Deleting item:', id)
}

const importItems = () => {
  console.log('Importing items')
}

const handleImageUpload = (file) => {
  // 模拟图片上传
  newItem.value.imageUrl = URL.createObjectURL(file.raw)
}
</script>

<style scoped>
.wardrobe {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.user-name {
  cursor: pointer;
  color: #606266;
}

.main-container {
  flex: 1;
  margin-top: 60px;
}

.sidebar {
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 99;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.content {
  margin-left: 200px;
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wardrobe-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-count {
  color: #606266;
  font-size: 14px;
}

.wardrobe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.wardrobe-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fff;
}

.wardrobe-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  gap: 5px;
}

.wardrobe-item:hover .item-actions {
  opacity: 1;
}

.item-info {
  padding: 16px;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.item-brand {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.item-tags {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.item-frequency {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-frequency span {
  font-size: 14px;
  color: #606266;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #c0c4cc;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .content {
    margin-left: 60px;
  }
  
  .sidebar-menu span {
    display: none;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .wardrobe-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>