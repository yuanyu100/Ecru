<template>
  <div class="knowledge">
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
          <h1 class="page-title">知识库</h1>
          <div class="page-actions">
            <el-button type="primary" size="small" @click="importKnowledge">
              <el-icon><Upload /></el-icon>
              <span>导入知识</span>
            </el-button>
            <el-button type="success" size="small" @click="addKnowledge">
              <el-icon><Plus /></el-icon>
              <span>添加知识</span>
            </el-button>
          </div>
        </div>

        <!-- 搜索区域 -->
        <el-card class="search-card">
          <el-form :inline="true" class="search-form">
            <el-form-item>
              <el-input v-model="searchQuery" placeholder="搜索知识" clearable style="width: 300px;">
                <template #append>
                  <el-button type="primary" @click="searchKnowledge">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="知识类型">
              <el-select v-model="searchType" placeholder="选择类型">
                <el-option label="全部" value="" />
                <el-option label="面料" value="fabric" />
                <el-option label="风格" value="style" />
                <el-option label="搭配" value="match" />
                <el-option label="护理" value="care" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 知识内容区域 -->
        <el-container class="knowledge-container">
          <!-- 左侧分类树 -->
          <el-aside width="200px" class="category-sidebar">
            <el-card class="category-card">
              <template #header>
                <span>知识分类</span>
              </template>
              <el-tree
                :data="categories"
                :props="categoryProps"
                :default-expanded-keys="['1']"
                @node-click="handleCategoryClick"
              />
            </el-card>
          </el-aside>

          <!-- 中间知识列表 -->
          <el-main class="knowledge-list-container">
            <el-card class="list-card">
              <template #header>
                <div class="card-header">
                  <span>知识列表</span>
                  <div class="list-count">{{ knowledgeList.length }} 条知识</div>
                </div>
              </template>
              <el-table :data="knowledgeList" style="width: 100%">
                <el-table-column prop="title" label="标题" min-width="200">
                  <template #default="scope">
                    <a href="javascript:void(0)" @click="viewKnowledge(scope.row)">{{ scope.row.title }}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="100">
                  <template #default="scope">
                    <el-tag :type="getTypeTagType(scope.row.type)">{{ scope.row.typeText }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="source" label="来源" width="150" />
                <el-table-column prop="publishDate" label="发布日期" width="120" />
                <el-table-column prop="relevance" label="相关度" width="100">
                  <template #default="scope">
                    <el-progress :percentage="scope.row.relevance" :color="getRelevanceColor(scope.row.relevance)" :stroke-width="8" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="small" @click="editKnowledge(scope.row)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteKnowledge(scope.row.id)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalKnowledge"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-card>
          </el-main>

          <!-- 右侧知识详情 -->
          <el-aside width="400px" class="detail-sidebar" v-if="selectedKnowledge">
            <el-card class="detail-card">
              <template #header>
                <div class="detail-header">
                  <span>知识详情</span>
                  <el-button size="small" @click="closeDetail">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
              </template>
              <div class="detail-content">
                <h2 class="detail-title">{{ selectedKnowledge.title }}</h2>
                <div class="detail-meta">
                  <el-tag :type="getTypeTagType(selectedKnowledge.type)">{{ selectedKnowledge.typeText }}</el-tag>
                  <span class="detail-source">{{ selectedKnowledge.source }}</span>
                  <span class="detail-date">{{ selectedKnowledge.publishDate }}</span>
                </div>
                <div class="detail-body">
                  {{ selectedKnowledge.content }}
                </div>
                <div class="detail-tags" v-if="selectedKnowledge.tags && selectedKnowledge.tags.length > 0">
                  <el-tag size="small" v-for="tag in selectedKnowledge.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
                </div>
                <div class="detail-actions">
                  <el-button type="primary" size="small">
                    <el-icon><Star /></el-icon>
                    <span>收藏</span>
                  </el-button>
                  <el-button size="small">
                    <el-icon><Share /></el-icon>
                    <span>分享</span>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PieChart, Collection, DataAnalysis, Document, Setting, Upload, Plus, Search, Edit, Delete, Close, Star, Share } from '@element-plus/icons-vue'

// 响应式数据
const activeMenu = computed(() => useRoute().path)
const searchQuery = ref('')
const searchType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalKnowledge = ref(128)
const selectedKnowledge = ref(null)

// 分类数据
const categories = ref([
  {
    id: '1',
    label: '面料知识',
    children: [
      { id: '1-1', label: '天然纤维' },
      { id: '1-2', label: '合成纤维' },
      { id: '1-3', label: '混纺面料' }
    ]
  },
  {
    id: '2',
    label: '穿搭风格',
    children: [
      { id: '2-1', label: '休闲风格' },
      { id: '2-2', label: '商务风格' },
      { id: '2-3', label: '运动风格' }
    ]
  },
  {
    id: '3',
    label: '搭配技巧',
    children: [
      { id: '3-1', label: '色彩搭配' },
      { id: '3-2', label: '季节搭配' },
      { id: '3-3', label: '场合搭配' }
    ]
  },
  {
    id: '4',
    label: '衣物护理',
    children: [
      { id: '4-1', label: '日常护理' },
      { id: '4-2', label: '特殊面料护理' },
      { id: '4-3', label: '收纳技巧' }
    ]
  }
])

const categoryProps = {
  children: 'children',
  label: 'label'
}

// 知识数据
const knowledgeList = ref([
  {
    id: '1',
    title: '羊毛面料的特点与保养',
    type: 'fabric',
    typeText: '面料',
    source: '专业服装知识库',
    publishDate: '2026-01-20',
    relevance: 95,
    content: '羊毛是一种天然纤维，具有良好的保暖性和透气性。羊毛服装应使用中性洗涤剂手洗，避免机洗和暴晒，建议平铺晾干。',
    tags: ['羊毛', '保养', '天然纤维']
  },
  {
    id: '2',
    title: '春季色彩搭配指南',
    type: 'style',
    typeText: '风格',
    source: '时尚杂志',
    publishDate: '2026-01-15',
    relevance: 90,
    content: '春季是色彩复苏的季节，本指南将为你介绍2026年春季流行的色彩搭配方案，包括明亮的 pastel 色调和自然的大地色系。',
    tags: ['春季', '色彩搭配', '流行趋势']
  },
  {
    id: '3',
    title: '牛仔裤的搭配技巧',
    type: 'match',
    typeText: '搭配',
    source: '时尚博客',
    publishDate: '2026-01-10',
    relevance: 85,
    content: '牛仔裤是百搭单品，本教程将教你如何根据不同场合和季节搭配牛仔裤，从休闲到正式，从春季到冬季。',
    tags: ['牛仔裤', '搭配技巧', '日常穿搭']
  },
  {
    id: '4',
    title: '丝绸衣物的护理方法',
    type: 'care',
    typeText: '护理',
    source: '衣物护理专家',
    publishDate: '2026-01-05',
    relevance: 88,
    content: '丝绸是一种高贵的面料，需要特殊的护理方法。本指南将详细介绍丝绸衣物的清洗、熨烫和收纳技巧。',
    tags: ['丝绸', '护理', '高端面料']
  }
])

// 方法
const getTypeTagType = (type) => {
  const typeMap = {
    fabric: 'primary',
    style: 'success',
    match: 'warning',
    care: 'info'
  }
  return typeMap[type] || 'default'
}

const getRelevanceColor = (value) => {
  if (value >= 90) return '#67C23A'
  if (value >= 80) return '#E6A23C'
  return '#F56C6C'
}

const searchKnowledge = () => {
  console.log('Searching knowledge:', searchQuery.value, searchType.value)
}

const handleCategoryClick = (category) => {
  console.log('Category clicked:', category)
}

const viewKnowledge = (knowledge) => {
  selectedKnowledge.value = knowledge
}

const closeDetail = () => {
  selectedKnowledge.value = null
}

const editKnowledge = (knowledge) => {
  console.log('Editing knowledge:', knowledge)
}

const deleteKnowledge = (id) => {
  console.log('Deleting knowledge:', id)
}

const importKnowledge = () => {
  console.log('Importing knowledge')
}

const addKnowledge = () => {
  console.log('Adding knowledge')
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.knowledge {
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

.search-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.knowledge-container {
  height: calc(100vh - 200px);
}

.category-sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.category-card {
  height: 100%;
  box-shadow: none;
  border: none;
}

.knowledge-list-container {
  flex: 1;
  padding: 0 20px;
  overflow: auto;
}

.list-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-count {
  color: #606266;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.detail-sidebar {
  background-color: #f5f7fa;
  border-left: 1px solid #e4e7ed;
  overflow: auto;
}

.detail-card {
  height: 100%;
  box-shadow: none;
  border: none;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.detail-source {
  color: #606266;
  font-size: 14px;
}

.detail-date {
  color: #909399;
  font-size: 14px;
}

.detail-body {
  line-height: 1.6;
  color: #303133;
  margin-bottom: 20px;
}

.detail-tags {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-actions {
  display: flex;
  gap: 10px;
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
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .knowledge-container {
    flex-direction: column;
    height: auto;
  }
  
  .category-sidebar {
    width: 100% !important;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 20px;
  }
  
  .knowledge-list-container {
    padding: 20px 0;
  }
  
  .detail-sidebar {
    width: 100% !important;
    border-left: none;
    border-top: 1px solid #e4e7ed;
    margin-top: 20px;
  }
}
</style>