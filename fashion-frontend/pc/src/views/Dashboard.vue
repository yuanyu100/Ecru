<template>
  <div class="dashboard">
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
        <h1 class="page-title">仪表盘</h1>

        <!-- 数据概览卡片 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ wardrobeCount }}</div>
                <div class="stat-label">衣橱总数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ outfitCount }}</div>
                <div class="stat-label">搭配方案</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ favoriteCount }}</div>
                <div class="stat-label">收藏搭配</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ analysisCount }}</div>
                <div class="stat-label">分析报告</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="20" class="chart-row">
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>衣橱分类统计</span>
                </div>
              </template>
              <div id="categoryChart" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>穿搭风格分布</span>
                </div>
              </template>
              <div id="styleChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 推荐预览 -->
        <el-card class="recommendation-card">
          <template #header>
            <div class="card-header">
              <span>今日推荐</span>
              <el-button type="primary" size="small">刷新推荐</el-button>
            </div>
          </template>
          <div class="recommendation-list">
            <el-row :gutter="20">
              <el-col :span="8" v-for="(outfit, index) in recommendations" :key="index">
                <el-card class="outfit-card">
                  <div class="outfit-image">
                    <img :src="outfit.imageUrl" alt="搭配图片" />
                  </div>
                  <div class="outfit-info">
                    <h3 class="outfit-title">{{ outfit.title }}</h3>
                    <p class="outfit-description">{{ outfit.description }}</p>
                    <div class="outfit-tags">
                      <el-tag size="small" v-for="tag in outfit.tags" :key="tag">{{ tag }}</el-tag>
                    </div>
                    <div class="outfit-actions">
                      <el-button type="success" size="small">收藏</el-button>
                      <el-button size="small">查看详情</el-button>
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
import { PieChart, Collection, DataAnalysis, Document, Setting } from '@element-plus/icons-vue'

// 响应式数据
const wardrobeCount = ref(128)
const outfitCount = ref(36)
const favoriteCount = ref(12)
const analysisCount = ref(8)

// 推荐数据
const recommendations = ref([
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20spring%20outfit%20with%20jeans%20and%20sweatshirt&image_size=square',
    title: '春季休闲搭配',
    description: '适合15-25度的日常穿着',
    tags: ['休闲', '春季', '舒适']
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20professional%20outfit%20for%20work&image_size=square',
    title: '商务正装搭配',
    description: '适合职场办公场合',
    tags: ['商务', '正式', '专业']
  },
  {
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sporty%20athletic%20outfit%20for%20exercise&image_size=square',
    title: '运动健身搭配',
    description: '适合户外运动和健身',
    tags: ['运动', '健身', '透气']
  }
])

// 路由相关
const route = useRoute()
const activeMenu = computed(() => route.path)

// 生命周期钩子
onMounted(() => {
  // 初始化图表
  initCategoryChart()
  initStyleChart()
})

// 初始化分类图表
function initCategoryChart() {
  const chartDom = document.getElementById('categoryChart')
  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '衣橱分类',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 45, name: '上衣' },
          { value: 30, name: '下装' },
          { value: 20, name: '鞋子' },
          { value: 15, name: '配饰' },
          { value: 18, name: '外套' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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
  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '穿搭风格',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 40, name: '休闲' },
          { value: 25, name: '商务' },
          { value: 15, name: '运动' },
          { value: 10, name: '时尚' },
          { value: 10, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
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
  z-index: 100;
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

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart {
  height: 340px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-list {
  margin-top: 20px;
}

.outfit-card {
  height: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.outfit-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 16px;
}

.outfit-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.outfit-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.outfit-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
}

.outfit-tags {
  margin-bottom: 16px;
}

.outfit-actions {
  display: flex;
  gap: 8px;
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
}
</style>