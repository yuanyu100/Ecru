<template>
  <view class="register-container">
    <view class="register-header">
      <text class="app-name">注册账号</text>
      <text class="app-slogan">加入我们，开启智能穿搭之旅</text>
    </view>

    <view class="register-form">
      <view class="form-item">
        <text class="label">用户名</text>
        <input 
          v-model="form.nickname" 
          type="text" 
          class="input" 
          placeholder="请输入用户名"
          placeholder-style="color: #909399"
        />
      </view>

      <view class="form-item">
        <text class="label">邮箱</text>
        <input 
          v-model="form.email" 
          type="email" 
          class="input" 
          placeholder="请输入邮箱地址"
          placeholder-style="color: #909399"
        />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input 
          v-model="form.password" 
          type="password" 
          class="input" 
          placeholder="请输入密码（至少6位）"
          placeholder-style="color: #909399"
          :password-visible="showPassword"
        />
        <text 
          class="password-toggle" 
          @tap="togglePassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </text>
      </view>

      <view class="form-item">
        <text class="label">确认密码</text>
        <input 
          v-model="form.confirmPassword" 
          type="password" 
          class="input" 
          placeholder="请再次输入密码"
          placeholder-style="color: #909399"
          :password-visible="showConfirmPassword"
        />
        <text 
          class="password-toggle" 
          @tap="toggleConfirmPassword"
        >
          {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
        </text>
      </view>

      <view class="form-actions">
        <view class="agreement">
          <checkbox 
            v-model="agreeTerms"
            class="checkbox"
          />
          <text class="agreement-text">我已阅读并同意</text>
          <text class="agreement-link" @tap="showTerms">用户协议</text>
          <text class="agreement-text">和</text>
          <text class="agreement-link" @tap="showPrivacy">隐私政策</text>
        </view>
      </view>

      <button 
        class="register-btn" 
        @tap="handleRegister"
        :disabled="loading || !agreeTerms"
      >
        <text v-if="!loading">注册</text>
        <text v-else>注册中...</text>
      </button>

      <view class="login-link">
        <text>已有账号？</text>
        <text class="login-text" @tap="goToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '../../../../shared/api.js'

// 表单数据
const form = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 状态管理
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

// 切换密码可见性
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 切换确认密码可见性
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 处理注册
const handleRegister = async () => {
  // 表单验证
  if (!form.nickname) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none'
    })
    return
  }

  if (!form.email) {
    uni.showToast({
      title: '请输入邮箱地址',
      icon: 'none'
    })
    return
  }

  if (!form.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }

  if (form.password.length < 6) {
    uni.showToast({
      title: '密码长度至少6位',
      icon: 'none'
    })
    return
  }

  if (form.password !== form.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    uni.showToast({
      title: '请输入正确的邮箱地址',
      icon: 'none'
    })
    return
  }

  // 协议同意验证
  if (!agreeTerms.value) {
    uni.showToast({
      title: '请阅读并同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    // 调用注册API
    const response = await api.user.register({
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword
    })

    // 保存用户信息和token
    uni.setStorageSync('userInfo', {
      avatar: response.avatar || '',
      nickname: response.nickname,
      email: response.email
    })
    uni.setStorageSync('token', response.token)

    // 注册成功，返回上一页
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1500)
  } catch (error) {
    console.error('注册失败:', error)
    uni.showToast({
      title: '注册失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  uni.navigateTo({
    url: '../login/login'
  })
}

// 显示用户协议
const showTerms = () => {
  uni.showModal({
    title: '用户协议',
    content: '用户协议内容...\n\n欢迎使用穿搭推荐系统，本协议旨在规范您的使用行为，保护您的权益。',
    showCancel: false
  })
}

// 显示隐私政策
const showPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '隐私政策内容...\n\n我们重视您的隐私，本政策说明了我们如何收集、使用和保护您的个人信息。',
    showCancel: false
  })
}
</script>

<style scoped>
.register-container {
  padding: 40rpx 32rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 注册头部 */
.register-header {
  text-align: center;
  margin-bottom: 40rpx;
  margin-top: 80rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16rpx;
  display: block;
}

.app-slogan {
  font-size: 22rpx;
  color: #606266;
  display: block;
}

/* 注册表单 */
.register-form {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  position: relative;
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 24rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8rpx;
}

.input {
  width: 100%;
  height: 72rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #303133;
  background-color: #fafafa;
}

.input:focus {
  border-color: #409EFF;
  background-color: #ffffff;
}

.password-toggle {
  position: absolute;
  right: 20rpx;
  top: 60rpx;
  font-size: 32rpx;
}

.form-actions {
  margin-bottom: 40rpx;
}

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 22rpx;
  color: #606266;
}

.checkbox {
  margin-right: 8rpx;
  transform: scale(1.2);
}

.agreement-link {
  color: #409EFF;
  margin: 0 4rpx;
}

.register-btn {
  width: 100%;
  height: 80rpx;
  background-color: #409EFF;
  color: #ffffff;
  border-radius: 40rpx;
  border: none;
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.register-btn:disabled {
  background-color: #c0c4cc;
}

.login-link {
  text-align: center;
  font-size: 24rpx;
  color: #606266;
}

.login-text {
  color: #409EFF;
  margin-left: 8rpx;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .app-name {
    font-size: 36rpx;
  }
  
  .app-slogan {
    font-size: 20rpx;
  }
  
  .register-form {
    padding: 24rpx;
  }
  
  .input {
    font-size: 26rpx;
    height: 64rpx;
  }
  
  .register-btn {
    font-size: 28rpx;
    height: 72rpx;
  }
}
</style>