<template>
  <view v-if="visible" class="loading-toast">
    <view class="loading-content">
      <view class="loading-spinner"></view>
      <text v-if="message" class="loading-message">{{ message }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.loading-content {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-sm);
}

.loading-message {
  color: white;
  font-size: var(--font-size-sm);
  text-align: center;
  line-height: 1.4;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>