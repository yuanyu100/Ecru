<template>
  <view class="ai-answer">
    <!-- 顶部区域 -->
    <view class="top-area">
      <view class="back-button" @click="goBack">
        <view class="back-arrow"></view>
      </view>
    </view>

    <!-- AI回答区域 -->
    <view class="answer-content">
      <view class="ai-thinking" v-if="isThinking">
        <view class="thinking-spinner"></view>
        <text class="thinking-text">AI正在思考...</text>
      </view>

      <view class="answer-container" v-else>
        <view class="answer-text fade-in">
          {{ aiAnswer.text }}
        </view>

        <!-- 视觉方案 -->
        <view class="visual-solutions">
          <view 
            v-for="(solution, index) in aiAnswer.solutions" 
            :key="index"
            class="solution-card image-hover"
            :class="{ 'primary': index === 0, 'secondary': index > 0 }"
            @click="selectSolution(index)"
          >
            <image :src="solution.imageUrl" mode="aspectFill" />
            <view class="solution-badge" v-if="index === 0">推荐</view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <view class="action-button" @click="adoptSolution">
            <view class="action-icon check-icon"></view>
            <text class="action-text">采用</text>
          </view>
          <view class="action-button" @click="refreshSolutions">
            <view class="action-icon refresh-icon"></view>
            <text class="action-text">换一换</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const isThinking = ref(true)
const aiAnswer = ref({
  text: '蓝色很衬今天的晴天。试试这套深蓝针织衫搭配浅色牛仔裤。',
  solutions: [
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20blue%20outfit%20elegant&image_size=portrait_4_3',
      isPrimary: true
    },
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20blue%20outfit%20zen%20style&image_size=portrait_4_3',
      isPrimary: false
    },
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20blue%20outfit%20minimalist&image_size=portrait_4_3',
      isPrimary: false
    }
  ]
})

// 生命周期钩子
onMounted(() => {
  // 模拟AI思考过程
  setTimeout(() => {
    isThinking.value = false
  }, 1500)
})

// 方法
const goBack = () => {
  uni.navigateBack()
}

const selectSolution = (index) => {
  console.log('Selected solution:', index)
  // 这里可以添加选择方案的逻辑
}

const adoptSolution = () => {
  console.log('Adopt solution')
  // 这里可以添加采用方案的逻辑
  uni.showToast({
    title: '已采用此方案',
    duration: 1500
  })
}

const refreshSolutions = () => {
  console.log('Refresh solutions')
  // 模拟刷新方案
  isThinking.value = true
  setTimeout(() => {
    // 生成新的方案图片
    aiAnswer.value.solutions = aiAnswer.value.solutions.map((solution, index) => ({
      ...solution,
      imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20outfit%20${Math.random()}&image_size=portrait_4_3`
    }))
    isThinking.value = false
  }, 1500)
}
</script>

<style scoped>
.ai-answer {
  position: relative;
  min-height: 100vh;
  background-color: var(--bg-primary);
  overflow-x: hidden;
}

/* 顶部区域 */
.top-area {
  padding: var(--spacing-lg) var(--spacing-md);
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

/* AI回答区域 */
.answer-content {
  padding: var(--spacing-xl) var(--spacing-md);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 思考状态 */
.ai-thinking {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.thinking-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--border-light);
  border-top: 4rpx solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.thinking-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  font-style: italic;
}

/* 回答容器 */
.answer-container {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.answer-text {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  line-height: 1.5;
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.answer-text::before {
  content: '';
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-bottom: 10rpx solid var(--bg-secondary);
}

/* 视觉方案 */
.visual-solutions {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  overflow-x: auto;
  padding-bottom: var(--spacing-md);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.visual-solutions::-webkit-scrollbar {
  display: none;
}

.solution-card {
  flex: 0 0 auto;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  position: relative;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.solution-card.primary {
  width: 280rpx;
  height: 360rpx;
}

.solution-card.secondary {
  width: 200rpx;
  height: 280rpx;
  align-self: flex-end;
}

.solution-card image {
  width: 100%;
  height: 100%;
}

.solution-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
  font-size: var(--font-size-xs);
  padding: 4rpx var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-lg);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: var(--spacing-sm);
}

.action-button:active {
  transform: scale(1.05);
  opacity: 0.8;
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
}

.check-icon::before {
  content: '';
  width: 20rpx;
  height: 10rpx;
  border-left: 2rpx solid var(--primary-color);
  border-bottom: 2rpx solid var(--primary-color);
  transform: rotate(-45deg);
}

.refresh-icon::before {
  content: '';
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid var(--text-secondary);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.action-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 320px) {
  .solution-card.primary {
    width: 240rpx;
    height: 320rpx;
  }
  
  .solution-card.secondary {
    width: 160rpx;
    height: 240rpx;
  }
  
  .answer-text {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 414px) {
  .solution-card.primary {
    width: 320rpx;
    height: 400rpx;
  }
  
  .solution-card.secondary {
    width: 240rpx;
    height: 320rpx;
  }
}
</style>