<template>
  <div class="dashboard">
    <!-- 顶部导航栏 -->
    <el-header height="60px" class="header">
      <div class="logo">
        <el-icon><TrendCharts /></el-icon>
        <span>穿搭推荐系统</span>
      </div>
      <div class="user-info">
        <el-dropdown trigger="click" @click="handleUserMenuClick">
          <span class="user-name">
            <el-avatar size="small" class="user-avatar">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20icon&image_size=square" alt="用户头像" />
            </el-avatar>
            <span class="user-text">用户中心</span>
            <el-icon class="user-arrow"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Setting /></el-icon>
                <span>系统设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 侧边导航栏 -->
    <el-container class="main-container">
      <el-aside :width="sidebarWidth" class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <div class="sidebar-toggle" @click="toggleSidebar">
            <el-icon><ArrowLeft v-if="!isSidebarCollapsed" /><ArrowRight v-else /></el-icon>
          </div>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          :collapse="isSidebarCollapsed"
          :collapse-transition="false"
        >
          <el-menu-item index="/dashboard">
            <el-icon><PieChart /></el-icon>
            <template #title>
              <span>仪表盘</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/wardrobe">
            <el-icon><Collection /></el-icon>
            <template #title>
              <span>衣橱管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/analysis">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>
              <span>分析报告</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/knowledge">
            <el-icon><Document /></el-icon>
            <template #title>
              <span>知识库</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <template #title>
              <span>系统设置</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main :class="{ 'content-collapsed': isSidebarCollapsed }" class="content">
        <div class="page-header">
          <h1 class="page-title">仪表盘</h1>
          <div class="page-meta">
            <span class="current-date">{{ currentDate }}</span>
            <span class="weather-info">
              <el-icon><Sunny /></el-icon>
              <span>22°C 晴天</span>
            </span>
          </div>
        </div>

        <!-- 数据概览卡片 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6" :xs="12" :sm="12" :md="6">
            <el-card class="stat-card" hoverable>
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon class="stat-icon-inner"><Collection /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ wardrobeCount }}</div>
                  <div class="stat-label">衣橱总数</div>
                </div>
                <div class="stat-trend">
                  <el-icon><ArrowUp /></el-icon>
                  <span>5.2%</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" :xs="12" :sm="12" :md="6">
            <el-card class="stat-card" hoverable>
              <div class="stat-content">
                <div class="stat-icon stat-icon-green">
                  <el-icon class="stat-icon-inner"><MagicStick /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ outfitCount }}</div>
                  <div class="stat-label">搭配方案</div>
                </div>
                <div class="stat-trend">
                  <el-icon><ArrowUp /></el-icon>
                  <span>12.8%</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" :xs="12" :sm="12" :md="6">
            <el-card class="stat-card" hoverable>
              <div class="stat-content">
                <div class="stat-icon stat-icon-orange">
                  <el-icon class="stat-icon-inner"><Star /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ favoriteCount }}</div>
                  <div class="stat-label">收藏搭配</div>
                </div>
                <div class="stat-trend">
                  <el-icon><ArrowUp /></el-icon>
                  <span>8.5%</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" :xs="12" :sm="12" :md="6">
            <el-card class="stat-card" hoverable>
              <div class="stat-content">
                <div class="stat-icon stat-icon-purple">
                  <el-icon class="stat-icon-inner"><DataLine /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ analysisCount }}</div>
                  <div class="stat-label">分析报告</div>
                </div>
                <div class="stat-trend">
                  <el-icon><ArrowUp /></el-icon>
                  <span>3.7%</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="20" class="chart-row">
          <el-col :span="12" :xs="24" :sm="24" :md="12">
            <el-card class="chart-card" hoverable>
              <template #header>
                <div class="card-header">
                  <span>衣橱分类统计</span>
                  <el-dropdown size="small">
                    <el-button type="text" size="small">
                      <span>最近30天</span>
                      <el-icon><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>最近7天</el-dropdown-item>
                        <el-dropdown-item>最近30天</el-dropdown-item>
                        <el-dropdown-item>最近90天</el-dropdown-item>
                        <el-dropdown-item>今年</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
              <div id="categoryChart" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="24" :md="12">
            <el-card class="chart-card" hoverable>
              <template #header>
                <div class="card-header">
                  <span>穿搭风格分布</span>
                  <el-dropdown size="small">
                    <el-button type="text" size="small">
                      <span>最近30天</span>
                      <el-icon><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>最近7天</el-dropdown-item>
                        <el-dropdown-item>最近30天</el-dropdown-item>
                        <el-dropdown-item>最近90天</el-dropdown-item>
                        <el-dropdown-item>今年</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
              <div id="styleChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 推荐预览 -->
        <el-card class="recommendation-card" hoverable>
          <template #header>
            <div class="card-header">
              <span>今日推荐</span>
              <el-button type="primary" size="small" @click="refreshRecommendations" :loading="isRefreshing">
                <el-icon v-if="!isRefreshing"><Refresh /></el-icon>
                <el-icon v-else><Loading /></el-icon>
                <span>{{ isRefreshing ? '刷新中...' : '刷新推荐' }}</span>
              </el-button>
            </div>
          </template>
          <div class="recommendation-list">
            <el-row :gutter="20">
              <el-col :span="8" :xs="24" :sm="12" :md="8" v-for="(outfit, index) in recommendations" :key="index">
                <el-card class="outfit-card" hoverable @click="viewOutfitDetail(outfit)">
                  <div class="outfit-image">
                    <img :src="outfit.imageUrl" alt="搭配图片" />
                    <div class="outfit-overlay">
                      <el-button type="primary" size="small" class="overlay-button">
                        <el-icon><View /></el-icon>
                        <span>查看详情</span>
                      </el-button>
                    </div>
                  </div>
                  <div class="outfit-info">
                    <h3 class="outfit-title">{{ outfit.title }}</h3>
                    <p class="outfit-description">{{ outfit.description }}</p>
                    <div class="outfit-tags">
                      <el-tag size="small" :type="tagTypes[index % tagTypes.length]" v-for="tag in outfit.tags" :key="tag">{{ tag }}</el-tag>
                    </div>
                    <div class="outfit-actions">
                      <el-button type="success" size="small" @click.stop="toggleFavorite(outfit)">
                        <el-icon><Star v-if="outfit.isFavorite" /><StarFilled v-else /></el-icon>
                        <span>{{ outfit.isFavorite ? '已收藏' : '收藏' }}</span>
                      </el-button>
                      <el-button size="small" @click.stop="shareOutfit(outfit)">
                        <el-icon><Share /></el-icon>
                        <span>分享</span>
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import {
  PieChart, Collection, DataAnalysis, Document, Setting,
  TrendCharts, ArrowDown, User, SwitchButton, ArrowLeft, ArrowRight,
  Star, StarFilled, Refresh, Loading, View, Share, Sunny,
  MagicStick, DataLine
} from '@element-plus/icons-vue'

// 响应式数据
const wardrobeCount = ref(128)
const outfitCount = ref(36)
const favoriteCount = ref(12)
const analysisCount = ref(8)
const currentDate = ref('')
const isSidebarCollapsed = ref(false)
const isRefreshing = ref(false)
const tagTypes = ['primary', 'success', 'warning', 'info', 'danger']

// 推荐数据
const recommendations = ref([
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20spring%20outfit%20with%20jeans%20and%20sweatshirt&image_size=square',
    title: '春季休闲搭配',
    description: '适合15-25度的日常穿着',
    tags: ['休闲', '春季', '舒适'],
    isFavorite: false
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20professional%20outfit%20for%20work&image_size=square',
    title: '商务正装搭配',
    description: '适合职场办公场合',
    tags: ['商务', '正式', '专业'],
    isFavorite: true
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sporty%20athletic%20outfit%20for%20exercise&image_size=square',
    title: '运动健身搭配',
    description: '适合户外运动和健身',
    tags: ['运动', '健身', '透气'],
    isFavorite: false
  }
])

// 计算属性
const route = useRoute()
const activeMenu = computed(() => route.path)
const sidebarWidth = computed(() => isSidebarCollapsed.value ? '60px' : '200px')

// 生命周期钩子
onMounted(() => {
  // 初始化当前日期
  updateCurrentDate()
  // 初始化图表
  initCategoryChart()
  initStyleChart()
})

// 更新当前日期
function updateCurrentDate() {
  const now = new Date()
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  currentDate.value = now.toLocaleDateString('zh-CN', options)
}

// 切换侧边栏
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 处理用户菜单点击
function handleUserMenuClick() {
  console.log('User menu clicked')
}

// 刷新推荐
function refreshRecommendations() {
  isRefreshing.value = true
  // 模拟网络请求
  setTimeout(() => {
    // 随机打乱推荐顺序
    recommendations.value = [...recommendations.value].sort(() => Math.random() - 0.5)
    // 随机更新收藏状态
    recommendations.value.forEach(outfit => {
      outfit.isFavorite = Math.random() > 0.5
    })
    isRefreshing.value = false
  }, 1000)
}

// 查看搭配详情
function viewOutfitDetail(outfit) {
  console.log('View outfit detail:', outfit)
}

// 切换收藏状态
function toggleFavorite(outfit) {
  outfit.isFavorite = !outfit.isFavorite
  console.log('Toggle favorite:', outfit)
}

// 分享搭配
function shareOutfit(outfit) {
  console.log('Share outfit:', outfit)
}

// 初始化分类图表
function initCategoryChart() {
  const chartDom = document.getElementById('categoryChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '衣橱分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45, name: '上衣', itemStyle: { color: '#409EFF' } },
          { value: 30, name: '下装', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '鞋子', itemStyle: { color: '#E6A23C' } },
          { value: 15, name: '配饰', itemStyle: { color: '#909399' } },
          { value: 18, name: '外套', itemStyle: { color: '#F56C6C' } }
        ]
      }
    ]
  }

  myChart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 初始化风格图表
function initStyleChart() {
  const chartDom = document.getElementById('styleChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '穿搭风格',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 40, name: '休闲', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '商务', itemStyle: { color: '#67C23A' } },
          { value: 15, name: '运动', itemStyle: { color: '#E6A23C' } },
          { value: 10, name: '时尚', itemStyle: { color: '#909399' } },
          { value: 10, name: '其他', itemStyle: { color: '#F56C6C' } }
        ]
      }
    ]
  }

  myChart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo el-icon {
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  cursor: pointer;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-name:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  margin-right: 8px;
}

.user-text {
  font-size: 14px;
}

.user-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

/* 主容器 */
.main-container {
  flex: 1;
  margin-top: 60px;
  display: flex;
}

/* 侧边导航栏 */
.sidebar {
  background-color: #fff;
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 100;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.sidebar-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-toggle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background-color: #f5f7fa;
}

.sidebar-toggle el-icon {
  font-size: 16px;
  color: #606266;
}

.sidebar-menu {
  height: calc(100% - 50px);
  border-right: none;
  padding: 16px 0;
}

.sidebar-menu .el-menu-item {
  height: 52px;
  line-height: 52px;
  margin: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.sidebar-menu .el-menu-item el-icon {
  font-size: 18px;
}

.sidebar-collapsed {
  width: 80px !important;
}

.sidebar-collapsed .sidebar-toggle {
  justify-content: center;
}

.sidebar-collapsed .el-menu-item span {
  display: none;
}

.sidebar-collapsed .el-menu-item {
  justify-content: center;
  gap: 0;
}

/* 主内容区域 */
.content {
  margin-left: 200px;
  padding: 24px;
  min-height: calc(100vh - 60px);
  transition: all 0.3s ease;
  background-color: #f5f7fa;
}

.content-collapsed {
  margin-left: 80px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.page-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #606266;
}

.current-date {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.weather-info el-icon {
  color: #E6A23C;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  height: 140px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #ecf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-green {
  background-color: #f0f9eb;
}

.stat-icon-orange {
  background-color: #fdf6ec;
}

.stat-icon-purple {
  background-color: #f3f0ff;
}

.stat-icon-inner {
  font-size: 28px;
  color: #409EFF;
}

.stat-icon-green .stat-icon-inner {
  color: #67C23A;
}

.stat-icon-orange .stat-icon-inner {
  color: #E6A23C;
}

.stat-icon-purple .stat-icon-inner {
  color: #909399;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #67C23A;
  font-weight: 500;
}

.stat-trend el-icon {
  font-size: 12px;
}

/* 图表区域 */
.chart-row {
  margin-bottom: 24px;
}

.chart-card {
  height: 420px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.chart {
  height: 360px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header span {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

/* 推荐卡片 */
.recommendation-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.recommendation-list {
  margin-top: 20px;
}

.outfit-card {
  height: 440px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.outfit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.outfit-image {
  height: 220px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
}

.outfit-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.outfit-card:hover .outfit-image img {
  transform: scale(1.05);
}

.outfit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.outfit-card:hover .outfit-overlay {
  opacity: 1;
}

.overlay-button {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.outfit-card:hover .overlay-button {
  transform: translateY(0);
}

.outfit-info {
  padding: 0 16px 16px;
}

.outfit-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.outfit-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.outfit-tags {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.outfit-actions {
  display: flex;
  gap: 8px;
}

.outfit-actions el-button {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content {
    margin-left: 180px;
  }
  
  .sidebar {
    width: 180px !important;
  }
  
  .content-collapsed {
    margin-left: 80px;
  }
}

@media (max-width: 992px) {
  .stats-row el-col {
    margin-bottom: 16px;
  }
  
  .chart-row el-col {
    margin-bottom: 16px;
  }
  
  .recommendation-list el-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }
  
  .logo span {
    display: none;
  }
  
  .user-text {
    display: none;
  }
  
  .content {
    margin-left: 80px;
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .sidebar {
    width: 80px !important;
  }
  
  .sidebar-menu .el-menu-item span {
    display: none;
  }
  
  .sidebar-menu .el-menu-item {
    justify-content: center;
    gap: 0;
  }
  
  .stat-content {
    padding: 0 16px;
    gap: 16px;
  }
  
  .stat-number {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .content {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar-collapsed {
    transform: translateX(0);
  }
}
</style>