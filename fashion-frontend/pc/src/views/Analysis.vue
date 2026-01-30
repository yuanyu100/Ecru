<template>
  <div class="analysis">
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
          <h1 class="page-title">分析报告</h1>
          <div class="page-actions">
            <el-button type="primary" size="small" @click="uploadAnalysis">
              <el-icon><Upload /></el-icon>
              <span>上传分析</span>
            </el-button>
            <el-button type="success" size="small" @click="exportReport">
              <el-icon><Download /></el-icon>
              <span>导出报告</span>
            </el-button>
          </div>
        </div>

        <!-- 分析类型选择 -->
        <el-card class="filter-card">
          <el-tabs v-model="activeTab" class="analysis-tabs">
            <el-tab-pane label="面料分析" name="fabric">
              <div class="tab-content">
                <el-form :inline="true" class="filter-form">
                  <el-form-item label="面料类型">
                    <el-select v-model="fabricFilter.type" placeholder="选择面料">
                      <el-option label="全部" value="" />
                      <el-option label="棉" value="棉" />
                      <el-option label="羊毛" value="羊毛" />
                      <el-option label="丝绸" value="丝绸" />
                      <el-option label="亚麻" value="亚麻" />
                      <el-option label="牛仔布" value="牛仔布" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="季节">
                    <el-select v-model="fabricFilter.season" placeholder="选择季节">
                      <el-option label="全部" value="" />
                      <el-option label="春季" value="春季" />
                      <el-option label="夏季" value="夏季" />
                      <el-option label="秋季" value="秋季" />
                      <el-option label="冬季" value="冬季" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="analyzeFabric">分析</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="穿搭分析" name="outfit">
              <div class="tab-content">
                <el-form :inline="true" class="filter-form">
                  <el-form-item label="场合">
                    <el-select v-model="outfitFilter.occasion" placeholder="选择场合">
                      <el-option label="全部" value="" />
                      <el-option label="日常" value="日常" />
                      <el-option label="商务" value="商务" />
                      <el-option label="派对" value="派对" />
                      <el-option label="运动" value="运动" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="风格">
                    <el-select v-model="outfitFilter.style" placeholder="选择风格">
                      <el-option label="全部" value="" />
                      <el-option label="休闲" value="休闲" />
                      <el-option label="正式" value="正式" />
                      <el-option label="时尚" value="时尚" />
                      <el-option label="运动" value="运动" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="analyzeOutfit">分析</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="视频分析" name="video">
              <div class="tab-content">
                <el-upload
                  class="video-upload"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleVideoUpload"
                  accept="video/*"
                >
                  <el-button type="primary">
                    <el-icon><Upload /></el-icon>
                    <span>上传视频</span>
                  </el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 MP4、MOV 格式，最大 100MB
                    </div>
                  </template>
                </el-upload>
                <el-button type="primary" @click="analyzeVideo" style="margin-top: 10px;">
                  开始分析
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 分析结果 -->
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>分析结果</span>
              <el-button size="small" @click="refreshAnalysis">
                <el-icon><Refresh /></el-icon>
                <span>刷新</span>
              </el-button>
            </div>
          </template>

          <!-- 面料分析结果 -->
          <div v-if="activeTab === 'fabric'" class="fabric-analysis">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="result-card">
                  <h3 class="result-title">面料特性分析</h3>
                  <div class="fabric-characteristics">
                    <div class="characteristic-item">
                      <span class="characteristic-label">保暖性：</span>
                      <el-progress :percentage="fabricAnalysis.warmth" :color="getProgressColor(fabricAnalysis.warmth)" />
                    </div>
                    <div class="characteristic-item">
                      <span class="characteristic-label">透气性：</span>
                      <el-progress :percentage="fabricAnalysis.breathability" :color="getProgressColor(fabricAnalysis.breathability)" />
                    </div>
                    <div class="characteristic-item">
                      <span class="characteristic-label">舒适度：</span>
                      <el-progress :percentage="fabricAnalysis.comfort" :color="getProgressColor(fabricAnalysis.comfort)" />
                    </div>
                    <div class="characteristic-item">
                      <span class="characteristic-label">耐用性：</span>
                      <el-progress :percentage="fabricAnalysis.durability" :color="getProgressColor(fabricAnalysis.durability)" />
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="result-card">
                  <h3 class="result-title">适合场合</h3>
                  <div class="suitable-occasions">
                    <el-tag v-for="occasion in fabricAnalysis.suitableOccasions" :key="occasion" size="large" effect="dark">
                      {{ occasion }}
                    </el-tag>
                  </div>
                  <h3 class="result-title" style="margin-top: 20px;">护理建议</h3>
                  <p class="care-guide">{{ fabricAnalysis.careGuide }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 穿搭分析结果 -->
          <div v-if="activeTab === 'outfit'" class="outfit-analysis">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="result-card">
                  <h3 class="result-title">穿搭评分</h3>
                  <div class="outfit-scores">
                    <div class="score-item">
                      <span class="score-label">色彩搭配：</span>
                      <el-rate v-model="outfitAnalysis.colorMatch" disabled show-score />
                    </div>
                    <div class="score-item">
                      <span class="score-label">风格一致性：</span>
                      <el-rate v-model="outfitAnalysis.styleConsistency" disabled show-score />
                    </div>
                    <div class="score-item">
                      <span class="score-label">场合适宜性：</span>
                      <el-rate v-model="outfitAnalysis.occasionAppropriateness" disabled show-score />
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="result-card">
                  <h3 class="result-title">改进建议</h3>
                  <ul class="suggestions">
                    <li v-for="(suggestion, index) in outfitAnalysis.suggestions" :key="index">
                      {{ suggestion }}
                    </li>
                  </ul>
                  <h3 class="result-title" style="margin-top: 20px;">推荐搭配</h3>
                  <div class="recommended-items">
                    <div class="recommended-item" v-for="(item, index) in outfitAnalysis.recommendations" :key="index">
                      <img :src="item.imageUrl" alt="推荐物品" />
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 视频分析结果 -->
          <div v-if="activeTab === 'video'" class="video-analysis">
            <el-card class="result-card">
              <h3 class="result-title">视频分析结果</h3>
              <div class="video-result">
                <div class="video-preview">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20video%20analysis%20interface&image_size=landscape_16_9" alt="视频预览" />
                </div>
                <div class="analysis-details">
                  <div class="analysis-item">
                    <span class="analysis-label">色彩分析：</span>
                    <div class="analysis-value">
                      <el-rate v-model="videoAnalysis.colorAnalysis.score" disabled show-score />
                      <p>{{ videoAnalysis.colorAnalysis.comment }}</p>
                    </div>
                  </div>
                  <div class="analysis-item">
                    <span class="analysis-label">妆容分析：</span>
                    <div class="analysis-value">
                      <el-rate v-model="videoAnalysis.makeupAnalysis.score" disabled show-score />
                      <p>{{ videoAnalysis.makeupAnalysis.comment }}</p>
                    </div>
                  </div>
                  <div class="analysis-item">
                    <span class="analysis-label">气质分析：</span>
                    <div class="analysis-value">
                      <el-rate v-model="videoAnalysis.temperamentAnalysis.score" disabled show-score />
                      <p>{{ videoAnalysis.temperamentAnalysis.comment }}</p>
                      <p class="suggested-style">推荐风格：{{ videoAnalysis.temperamentAnalysis.suggestedStyle }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="professional-comment">
                <h4>专业评价</h4>
                <p>{{ videoAnalysis.professionalComment }}</p>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-main>
    </el-container>

    <!-- 上传分析对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传分析"
      width="500px"
    >
      <el-upload
        class="image-upload"
        action="#"
        :auto-upload="false"
        :on-change="handleImageUpload"
        accept="image/*"
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          <span>选择图片</span>
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            支持 JPG、PNG 格式，最大 10MB
          </div>
        </template>
      </el-upload>
      <div class="upload-preview" v-if="uploadImageUrl">
        <img :src="uploadImageUrl" alt="预览图片" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">上传分析</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PieChart, Collection, DataAnalysis, Document, Setting, Upload, Download, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const activeMenu = computed(() => useRoute().path)
const activeTab = ref('fabric')

// 筛选条件
const fabricFilter = ref({
  type: '',
  season: ''
})

const outfitFilter = ref({
  occasion: '',
  style: ''
})

// 分析数据
const fabricAnalysis = ref({
  warmth: 75,
  breathability: 85,
  comfort: 90,
  durability: 70,
  suitableOccasions: ['日常', '休闲', '春季', '秋季'],
  careGuide: '棉织物可机洗，建议使用中性洗涤剂，水温不超过40℃，避免暴晒。'
})

const outfitAnalysis = ref({
  colorMatch: 4,
  styleConsistency: 5,
  occasionAppropriateness: 4,
  suggestions: [
    '色彩搭配协调，整体风格统一',
    '建议搭配白色运动鞋，增加时尚感',
    '可以添加一条简单的项链提升精致度'
  ],
  recommendations: [
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20sneakers%20fashion&image_size=square',
      name: '白色运动鞋'
    },
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=simple%20gold%20necklace&image_size=square',
      name: '金色项链'
    }
  ]
})

const videoAnalysis = ref({
  colorAnalysis: {
    score: 4,
    comment: '色彩搭配和谐，红色与黑色的对比鲜明且经典'
  },
  makeupAnalysis: {
    score: 5,
    comment: '妆容与服装风格匹配度高，眼妆突出个性'
  },
  temperamentAnalysis: {
    score: 4,
    comment: '整体造型展现出自信干练的气质',
    suggestedStyle: '职场女性风格'
  },
  professionalComment: '这套红色羊毛外套搭配黑色丝绸铅笔裙的组合非常经典，适合职场女性。色彩对比鲜明但不张扬，展现出自信干练的气质。建议搭配简约的金色饰品，提升整体造型的精致感。'
})

// 对话框状态
const uploadDialogVisible = ref(false)
const uploadImageUrl = ref('')

// 方法
const getProgressColor = (value) => {
  if (value >= 80) return '#67C23A'
  if (value >= 60) return '#E6A23C'
  return '#F56C6C'
}

const analyzeFabric = () => {
  console.log('Analyzing fabric with filter:', fabricFilter.value)
}

const analyzeOutfit = () => {
  console.log('Analyzing outfit with filter:', outfitFilter.value)
}

const analyzeVideo = () => {
  console.log('Analyzing video')
}

const refreshAnalysis = () => {
  console.log('Refreshing analysis')
}

const uploadAnalysis = () => {
  uploadDialogVisible.value = true
}

const exportReport = () => {
  console.log('Exporting report')
}

const handleImageUpload = (file) => {
  uploadImageUrl.value = URL.createObjectURL(file.raw)
}

const handleVideoUpload = (file) => {
  console.log('Video uploaded:', file)
}

const submitUpload = () => {
  console.log('Submitting upload')
  uploadDialogVisible.value = false
}
</script>

<style scoped>
.analysis {
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

.analysis-tabs {
  width: 100%;
}

.tab-content {
  padding: 20px 0;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.analysis-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-card {
  margin-bottom: 20px;
}

.result-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.characteristic-item {
  margin-bottom: 15px;
}

.characteristic-label {
  display: block;
  margin-bottom: 5px;
  color: #606266;
}

.fabric-characteristics {
  margin-top: 20px;
}

.score-item {
  margin-bottom: 15px;
}

.score-label {
  display: block;
  margin-bottom: 5px;
  color: #606266;
}

.suggestions {
  margin-left: 20px;
}

.suggestions li {
  margin-bottom: 10px;
  color: #606266;
}

.recommended-items {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.recommended-item {
  text-align: center;
}

.recommended-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 5px;
}

.video-result {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.video-preview {
  flex: 1;
}

.video-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.analysis-details {
  flex: 1;
}

.analysis-item {
  margin-bottom: 20px;
}

.analysis-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #303133;
}

.analysis-value p {
  margin-top: 5px;
  color: #606266;
}

.suggested-style {
  color: #409EFF !important;
  font-weight: bold;
}

.professional-comment {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.professional-comment h4 {
  margin-bottom: 10px;
  color: #303133;
}

.professional-comment p {
  color: #606266;
  line-height: 1.6;
}

.upload-preview {
  margin-top: 20px;
  text-align: center;
}

.upload-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
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
  
  .video-result {
    flex-direction: column;
  }
  
  .recommended-items {
    flex-wrap: wrap;
  }
}
</style>