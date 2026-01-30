<template>
  <view class="analysis-container">
    <!-- 分析类型选择器 -->
    <view class="analysis-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @tap="selectTab(tab.value)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 视频分析 -->
    <view v-if="activeTab === 'video'" class="video-analysis">
      <view class="upload-section">
        <button class="upload-btn" @tap="selectVideo">
          <text class="upload-icon">🎬</text>
          <text class="upload-text">选择视频</text>
        </button>
        <button class="record-btn" @tap="recordVideo">
          <text class="record-icon">📹</text>
          <text class="record-text">拍摄视频</text>
        </button>
      </view>

      <view v-if="videoFile" class="video-preview">
        <video 
          :src="videoFile.tempFilePath" 
          class="video-player"
          controls
          autoplay
          muted
        ></video>
        <view class="video-info">
          <text class="video-name">{{ videoFile.name }}</text>
          <text class="video-size">{{ formatSize(videoFile.size) }}</text>
        </view>
        <button class="analyze-btn" @tap="analyzeVideo">
          <text class="analyze-icon">🔍</text>
          <text>开始分析</text>
        </button>
      </view>

      <view v-if="videoAnalysisResult" class="analysis-result">
        <view class="result-header">
          <text class="result-title">视频分析结果</text>
          <text class="result-score">{{ videoAnalysisResult.overallScore }}分</text>
        </view>

        <view class="analysis-details">
          <view class="detail-item">
            <text class="detail-label">色彩搭配</text>
            <view class="score-bar">
              <view class="score-fill" :style="{ width: videoAnalysisResult.colorAnalysis.score + '%' }"></view>
            </view>
            <text class="detail-score">{{ videoAnalysisResult.colorAnalysis.score }}分</text>
            <text class="detail-comment">{{ videoAnalysisResult.colorAnalysis.comment }}</text>
          </view>

          <view class="detail-item">
            <text class="detail-label">妆容分析</text>
            <view class="score-bar">
              <view class="score-fill" :style="{ width: videoAnalysisResult.makeupAnalysis.score + '%' }"></view>
            </view>
            <text class="detail-score">{{ videoAnalysisResult.makeupAnalysis.score }}分</text>
            <text class="detail-comment">{{ videoAnalysisResult.makeupAnalysis.comment }}</text>
          </view>

          <view class="detail-item">
            <text class="detail-label">气质分析</text>
            <view class="score-bar">
              <view class="score-fill" :style="{ width: videoAnalysisResult.temperamentAnalysis.score + '%' }"></view>
            </view>
            <text class="detail-score">{{ videoAnalysisResult.temperamentAnalysis.score }}分</text>
            <text class="detail-comment">{{ videoAnalysisResult.temperamentAnalysis.comment }}</text>
            <text class="suggested-style">推荐风格：{{ videoAnalysisResult.temperamentAnalysis.suggestedStyle }}</text>
          </view>
        </view>

        <view class="clothing-items">
          <text class="section-title">服装分析</text>
          <view 
            v-for="(item, index) in videoAnalysisResult.clothingItems" 
            :key="index"
            class="clothing-item"
          >
            <text class="item-time">{{ item.frame }}</text>
            <view class="item-details">
              <text class="item-type">{{ item.type }}</text>
              <text class="item-color">{{ item.color }}</text>
              <text class="item-material">{{ item.material }}</text>
              <text class="item-style">{{ item.style }}</text>
            </view>
          </view>
        </view>

        <view class="professional-comment">
          <text class="comment-title">专业评价</text>
          <text class="comment-content">{{ videoAnalysisResult.professionalComment }}</text>
        </view>

        <view class="action-buttons">
          <button class="action-btn share" @tap="shareResult">
            <text class="btn-icon">📤</text>
            <text>分享结果</text>
          </button>
          <button class="action-btn save" @tap="saveResult">
            <text class="btn-icon">💾</text>
            <text>保存分析</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 面料分析 -->
    <view v-if="activeTab === 'fabric'" class="fabric-analysis">
      <view class="upload-section">
        <button class="upload-btn" @tap="selectImage">
          <text class="upload-icon">📷</text>
          <text class="upload-text">选择图片</text>
        </button>
        <button class="capture-btn" @tap="captureImage">
          <text class="capture-icon">📸</text>
          <text class="capture-text">拍摄照片</text>
        </button>
      </view>

      <view v-if="fabricImage" class="image-preview">
        <image 
          :src="fabricImage.tempFilePath" 
          class="preview-image"
          mode="aspectFit"
        ></image>
        <button class="analyze-btn" @tap="analyzeFabric">
          <text class="analyze-icon">🔍</text>
          <text>分析面料</text>
        </button>
      </view>

      <view v-if="fabricAnalysisResult" class="analysis-result">
        <view class="result-header">
          <text class="result-title">面料分析结果</text>
          <text class="result-confidence">{{ fabricAnalysisResult.confidence }}% 置信度</text>
        </view>

        <view class="fabric-info">
          <view class="info-item">
            <text class="info-label">面料类型</text>
            <text class="info-value">{{ fabricAnalysisResult.material }}</text>
          </view>

          <view class="characteristics">
            <text class="section-title">面料特性</text>
            <view 
              v-for="(value, key) in fabricAnalysisResult.characteristics" 
              :key="key"
              class="characteristic-item"
            >
              <text class="characteristic-label">{{ getCharacteristicLabel(key) }}</text>
              <view class="score-bar">
                <view class="score-fill" :style="{ width: value + '%' }"></view>
              </view>
              <text class="characteristic-value">{{ value }}</text>
            </view>
          </view>

          <view class="care-guide">
            <text class="section-title">护理指南</text>
            <text class="care-content">{{ fabricAnalysisResult.careGuide }}</text>
          </view>

          <view class="suitable-occasions">
            <text class="section-title">适合场合</text>
            <view class="occasion-tags">
              <text 
                v-for="(occasion, index) in fabricAnalysisResult.suitableOccasions" 
                :key="index"
                class="occasion-tag"
              >
                {{ occasion }}
              </text>
            </view>
          </view>
        </view>

        <view class="action-buttons">
          <button class="action-btn share" @tap="shareResult">
            <text class="btn-icon">📤</text>
            <text>分享结果</text>
          </button>
          <button class="action-btn save" @tap="saveResult">
            <text class="btn-icon">💾</text>
            <text>保存分析</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 穿搭分析 -->
    <view v-if="activeTab === 'outfit'" class="outfit-analysis">
      <view class="upload-section">
        <button class="upload-btn" @tap="selectOutfitImage">
          <text class="upload-icon">📷</text>
          <text class="upload-text">选择穿搭照片</text>
        </button>
        <button class="capture-btn" @tap="captureOutfitImage">
          <text class="capture-icon">📸</text>
          <text class="capture-text">拍摄穿搭</text>
        </button>
      </view>

      <view v-if="outfitImage" class="image-preview">
        <image 
          :src="outfitImage.tempFilePath" 
          class="preview-image"
          mode="aspectFit"
        ></image>
        <button class="analyze-btn" @tap="analyzeOutfit">
          <text class="analyze-icon">🔍</text>
          <text>分析穿搭</text>
        </button>
      </view>

      <view v-if="outfitAnalysisResult" class="analysis-result">
        <view class="result-header">
          <text class="result-title">穿搭分析结果</text>
          <text class="result-overall">{{ getOverallEvaluation(outfitAnalysisResult.evaluation) }}</text>
        </view>

        <view class="clothing-items">
          <text class="section-title">服装单品</text>
          <view 
            v-for="(item, index) in outfitAnalysisResult.clothingItems" 
            :key="index"
            class="clothing-item"
          >
            <text class="item-type">{{ item.type }}</text>
            <text class="item-color">{{ item.color }}</text>
            <text class="item-material">{{ item.material }}</text>
            <text class="item-style">{{ item.style }}</text>
          </view>
        </view>

        <view class="evaluation-details">
          <text class="section-title">穿搭评价</text>
          <view 
            v-for="(score, key) in outfitAnalysisResult.evaluation" 
            :key="key"
            v-if="typeof score === 'number'"
            class="evaluation-item"
          >
            <text class="evaluation-label">{{ getEvaluationLabel(key) }}</text>
            <view class="score-bar">
              <view class="score-fill" :style="{ width: score + '%' }"></view>
            </view>
            <text class="evaluation-score">{{ score }}分</text>
          </view>
        </view>

        <view class="suggestions">
          <text class="section-title">改进建议</text>
          <view 
            v-for="(suggestion, index) in outfitAnalysisResult.evaluation.suggestions" 
            :key="index"
            class="suggestion-item"
          >
            <text class="suggestion-icon">💡</text>
            <text class="suggestion-text">{{ suggestion }}</text>
          </view>
        </view>

        <view class="recommendations">
          <text class="section-title">推荐搭配</text>
          <view 
            v-for="(recommendation, index) in outfitAnalysisResult.recommendations" 
            :key="index"
            class="recommendation-item"
          >
            <text class="recommendation-name">{{ recommendation.name }}</text>
            <text class="recommendation-reason">{{ recommendation.reason }}</text>
          </view>
        </view>

        <view class="action-buttons">
          <button class="action-btn share" @tap="shareResult">
            <text class="btn-icon">📤</text>
            <text>分享结果</text>
          </button>
          <button class="action-btn save" @tap="saveResult">
            <text class="btn-icon">💾</text>
            <text>保存分析</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <uni-loading-spinner type="spin" size="32"></uni-loading-spinner>
      <text class="loading-text">{{ loadingText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../../../shared/api.js'

// 状态管理
const activeTab = ref('video')
const videoFile = ref(null)
const fabricImage = ref(null)
const outfitImage = ref(null)
const videoAnalysisResult = ref(null)
const fabricAnalysisResult = ref(null)
const outfitAnalysisResult = ref(null)
const loading = ref(false)
const loadingText = ref('')

// 分析类型选项
const tabs = [
  { label: '视频分析', value: 'video', icon: '🎬' },
  { label: '面料分析', value: 'fabric', icon: '🧵' },
  { label: '穿搭分析', value: 'outfit', icon: '👗' }
]

// 选择分析类型
const selectTab = (tab) => {
  activeTab.value = tab
}

// 选择视频
const selectVideo = () => {
  uni.chooseVideo({
    sourceType: ['album'],
    maxDuration: 60,
    camera: 'back',
    success: (res) => {
      videoFile.value = res
    },
    fail: (err) => {
      console.error('选择视频失败:', err)
    }
  })
}

// 拍摄视频
const recordVideo = () => {
  uni.chooseVideo({
    sourceType: ['camera'],
    maxDuration: 60,
    camera: 'back',
    success: (res) => {
      videoFile.value = res
    },
    fail: (err) => {
      console.error('拍摄视频失败:', err)
    }
  })
}

// 选择图片
const selectImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      fabricImage.value = res.tempFiles[0]
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
    }
  })
}

// 拍摄照片
const captureImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      fabricImage.value = res.tempFiles[0]
    },
    fail: (err) => {
      console.error('拍摄照片失败:', err)
    }
  })
}

// 选择穿搭照片
const selectOutfitImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      outfitImage.value = res.tempFiles[0]
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
    }
  })
}

// 拍摄穿搭照片
const captureOutfitImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      outfitImage.value = res.tempFiles[0]
    },
    fail: (err) => {
      console.error('拍摄照片失败:', err)
    }
  })
}

// 分析视频
const analyzeVideo = async () => {
  if (!videoFile.value) return

  loading.value = true
  loadingText.value = '分析视频中...'

  try {
    // 模拟分析结果
    setTimeout(() => {
      videoAnalysisResult.value = {
        videoId: '123',
        status: 'completed',
        overallScore: 88,
        colorAnalysis: {
          score: 85,
          comment: '色彩搭配和谐，红色与黑色的对比鲜明且经典'
        },
        makeupAnalysis: {
          score: 90,
          comment: '妆容与服装风格匹配度高，眼妆突出个性'
        },
        temperamentAnalysis: {
          score: 88,
          comment: '整体造型展现出自信干练的气质',
          suggestedStyle: '职场女性风格'
        },
        clothingItems: [
          {
            frame: '00:01:23',
            type: '外套',
            color: '红色',
            material: '羊毛',
            style: '修身'
          },
          {
            frame: '00:02:45',
            type: '裙子',
            color: '黑色',
            material: '丝绸',
            style: '铅笔裙'
          }
        ],
        professionalComment: '这套红色羊毛外套搭配黑色丝绸铅笔裙的组合非常经典，适合职场女性。色彩对比鲜明但不张扬，展现出自信干练的气质。建议搭配简约的金色饰品，提升整体造型的精致感。'
      }
      loading.value = false
    }, 3000)
  } catch (error) {
    console.error('视频分析失败:', error)
    uni.showToast({
      title: '分析失败，请重试',
      icon: 'none'
    })
    loading.value = false
  }
}

// 分析面料
const analyzeFabric = async () => {
  if (!fabricImage.value) return

  loading.value = true
  loadingText.value = '分析面料中...'

  try {
    // 模拟分析结果
    setTimeout(() => {
      fabricAnalysisResult.value = {
        analysisId: '456',
        material: '棉',
        confidence: 95,
        characteristics: {
          warmth: 60,
          breathability: 90,
          comfort: 85,
          durability: 75
        },
        careGuide: '棉织物可机洗，建议使用中性洗涤剂，水温不超过40℃，避免暴晒。',
        suitableOccasions: ['日常', '休闲', '夏季']
      }
      loading.value = false
    }, 2000)
  } catch (error) {
    console.error('面料分析失败:', error)
    uni.showToast({
      title: '分析失败，请重试',
      icon: 'none'
    })
    loading.value = false
  }
}

// 分析穿搭
const analyzeOutfit = async () => {
  if (!outfitImage.value) return

  loading.value = true
  loadingText.value = '分析穿搭中...'

  try {
    // 模拟分析结果
    setTimeout(() => {
      outfitAnalysisResult.value = {
        analysisId: '789',
        clothingItems: [
          {
            type: '上衣',
            color: '红色',
            material: '棉',
            style: '休闲'
          },
          {
            type: '下装',
            color: '蓝色',
            material: '牛仔布',
            style: '休闲'
          }
        ],
        evaluation: {
          colorMatch: 85,
          styleConsistency: 90,
          occasionAppropriateness: 80,
          suggestions: [
            '色彩搭配协调，整体风格统一',
            '建议搭配白色运动鞋，增加时尚感'
          ]
        },
        recommendations: [
          {
            itemId: '配饰ID',
            name: '项链',
            reason: '可以提升整体造型的精致感'
          }
        ]
      }
      loading.value = false
    }, 2500)
  } catch (error) {
    console.error('穿搭分析失败:', error)
    uni.showToast({
      title: '分析失败，请重试',
      icon: 'none'
    })
    loading.value = false
  }
}

// 分享结果
const shareResult = () => {
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

// 保存结果
const saveResult = () => {
  uni.showToast({
    title: '已保存分析结果',
    icon: 'success'
  })
}

// 格式化文件大小
const formatSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

// 获取面料特性标签
const getCharacteristicLabel = (key) => {
  const labels = {
    warmth: '保暖性',
    breathability: '透气性',
    comfort: '舒适度',
    durability: '耐用性'
  }
  return labels[key] || key
}

// 获取评价标签
const getEvaluationLabel = (key) => {
  const labels = {
    colorMatch: '色彩搭配',
    styleConsistency: '风格一致性',
    occasionAppropriateness: '场合适宜性'
  }
  return labels[key] || key
}

// 获取整体评价
const getOverallEvaluation = (evaluation) => {
  const scores = Object.values(evaluation).filter(v => typeof v === 'number')
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
  if (average >= 90) return '优秀'
  if (average >= 80) return '良好'
  if (average >= 70) return '一般'
  return '需要改进'
}
</script>

<style scoped>
.analysis-container {
  padding: 16rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 分析类型选择器 */
.analysis-tabs {
  display: flex;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.tab-item.active {
  background-color: #409EFF;
  color: #ffffff;
}

.tab-icon {
  font-size: 32rpx;
  margin-bottom: 4rpx;
}

.tab-label {
  font-size: 24rpx;
  font-weight: 500;
}

/* 上传区域 */
.upload-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32rpx;
}

.upload-btn, .record-btn, .capture-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  border: 2rpx dashed #dcdfe6;
  font-size: 24rpx;
  color: #606266;
  min-width: 200rpx;
}

.upload-icon, .record-icon, .capture-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.upload-text, .record-text, .capture-text {
  font-size: 22rpx;
}

/* 视频预览 */
.video-preview {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.video-player {
  width: 100%;
  height: 400rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

.video-info {
  margin-bottom: 16rpx;
}

.video-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4rpx;
}

.video-size {
  font-size: 22rpx;
  color: #909399;
}

/* 图片预览 */
.image-preview {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

/* 分析按钮 */
.analyze-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  background-color: #409EFF;
  color: #ffffff;
  border-radius: 24rpx;
  border: none;
  font-size: 28rpx;
  margin-top: 16rpx;
}

.analyze-icon {
  margin-right: 8rpx;
  font-size: 24rpx;
}

/* 分析结果 */
.analysis-result {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #ebeef5;
}

.result-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.result-score, .result-confidence, .result-overall {
  font-size: 28rpx;
  font-weight: 500;
  color: #409EFF;
}

/* 分析详情 */
.analysis-details {
  margin-bottom: 32rpx;
}

.detail-item {
  margin-bottom: 24rpx;
}

.detail-label {
  font-size: 26rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8rpx;
}

.score-bar {
  width: 100%;
  height: 12rpx;
  background-color: #f0f2f5;
  border-radius: 6rpx;
  margin-bottom: 8rpx;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background-color: #67C23A;
  border-radius: 6rpx;
  transition: width 0.3s;
}

.detail-score {
  font-size: 24rpx;
  color: #67C23A;
  margin-bottom: 8rpx;
}

.detail-comment {
  font-size: 22rpx;
  color: #606266;
  line-height: 1.4;
}

.suggested-style {
  font-size: 22rpx;
  color: #409EFF;
  margin-top: 8rpx;
}

/* 服装列表 */
.clothing-items {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16rpx;
}

.clothing-item {
  background-color: #f5f7fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
}

.item-time {
  font-size: 20rpx;
  color: #909399;
  margin-bottom: 8rpx;
}

.item-type {
  font-size: 24rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4rpx;
}

.item-color, .item-material, .item-style {
  font-size: 22rpx;
  color: #606266;
  margin-bottom: 4rpx;
}

/* 专业评价 */
.professional-comment {
  margin-bottom: 32rpx;
}

.comment-content {
  font-size: 24rpx;
  color: #606266;
  line-height: 1.5;
  background-color: #f5f7fa;
  padding: 16rpx;
  border-radius: 8rpx;
}

/* 面料信息 */
.fabric-info {
  margin-bottom: 32rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 24rpx;
  color: #606266;
}

.info-value {
  font-size: 24rpx;
  font-weight: 500;
  color: #303133;
}

/* 特性列表 */
.characteristics {
  margin-bottom: 24rpx;
}

.characteristic-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.characteristic-label {
  width: 120rpx;
  font-size: 22rpx;
  color: #606266;
}

.characteristic-item .score-bar {
  flex: 1;
  margin: 0 16rpx;
}

.characteristic-value {
  width: 40rpx;
  font-size: 22rpx;
  color: #67C23A;
  text-align: right;
}

/* 护理指南 */
.care-guide {
  margin-bottom: 24rpx;
}

.care-content {
  font-size: 22rpx;
  color: #606266;
  line-height: 1.5;
  background-color: #f5f7fa;
  padding: 16rpx;
  border-radius: 8rpx;
}

/* 适合场合 */
.suitable-occasions {
  margin-bottom: 24rpx;
}

.occasion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.occasion-tag {
  padding: 8rpx 16rpx;
  background-color: #ecf5ff;
  color: #409EFF;
  border-radius: 16rpx;
  font-size: 20rpx;
}

/* 评价详情 */
.evaluation-details {
  margin-bottom: 32rpx;
}

.evaluation-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.evaluation-label {
  width: 150rpx;
  font-size: 22rpx;
  color: #606266;
}

.evaluation-item .score-bar {
  flex: 1;
  margin: 0 16rpx;
}

.evaluation-score {
  width: 40rpx;
  font-size: 22rpx;
  color: #67C23A;
  text-align: right;
}

/* 建议列表 */
.suggestions {
  margin-bottom: 32rpx;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  padding: 16rpx;
  background-color: #f0f9eb;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.suggestion-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
  margin-top: 4rpx;
}

.suggestion-text {
  flex: 1;
  font-size: 22rpx;
  color: #606266;
  line-height: 1.4;
}

/* 推荐列表 */
.recommendations {
  margin-bottom: 32rpx;
}

.recommendation-item {
  padding: 16rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.recommendation-name {
  font-size: 24rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8rpx;
}

.recommendation-reason {
  font-size: 22rpx;
  color: #606266;
  line-height: 1.4;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 24rpx;
  border-radius: 8rpx;
  border: none;
  font-size: 22rpx;
  min-width: 120rpx;
}

.action-btn.share {
  background-color: #ecf5ff;
  color: #409EFF;
}

.action-btn.save {
  background-color: #fdf6ec;
  color: #E6A23C;
}

.btn-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .upload-btn, .record-btn, .capture-btn {
    min-width: 160rpx;
    padding: 20rpx;
  }
  
  .upload-icon, .record-icon, .capture-icon {
    font-size: 36rpx;
  }
  
  .upload-text, .record-text, .capture-text {
    font-size: 20rpx;
  }
  
  .video-player {
    height: 300rpx;
  }
  
  .preview-image {
    width: 240rpx;
    height: 240rpx;
  }
  
  .result-title {
    font-size: 28rpx;
  }
  
  .result-score, .result-confidence, .result-overall {
    font-size: 24rpx;
  }
}
</style>