<template>
  <view v-if="visible" class="error-toast" @click="handleClick">
    <view class="error-content">
      <view class="error-icon">
        <text>!</text>
      </view>
      <text class="error-message">{{ message }}</text>
      <view v-if="showClose" class="error-close" @click.stop="handleClose">
        <text>×</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '操作失败'
  },
  duration: {
    type: Number,
    default: 3000
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'click'])

const handleClose = () => {
  emit('close')
}

const handleClick = () => {
  emit('click')
}

onMounted(() => {
  if (props.visible && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
.error-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  max-width: 80%;
}

.error-content {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  position: relative;
}

.error-icon {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: var(--danger-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.error-message {
  color: white;
  font-size: var(--font-size-sm);
  line-height: 1.4;
  flex: 1;
}

.error-close {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.error-close:active {
  transform: scale(0.9);
  opacity: 0.8;
}
</style>