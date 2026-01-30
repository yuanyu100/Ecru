<template>
  <view class="login-container">
    <view class="login-header">
      <text class="app-name">穿搭推荐系统</text>
      <text class="app-slogan">让穿搭更智能，让生活更美好</text>
    </view>

    <view class="login-form">
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
          placeholder="请输入密码"
          placeholder-style="color: #909399"
          :password-visible="showPassword"
          @focus="onPasswordFocus"
          @blur="onPasswordBlur"
        />
        <text 
          class="password-toggle" 
          @tap="togglePassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </text>
      </view>

      <view class="form-actions">
        <text class="forgot-password" @tap="goToForgot">忘记密码？</text>
      </view>

      <button 
        class="login-btn" 
        @tap="handleLogin"
        :disabled="loading"
      >
        <text v-if="!loading">登录</text>
        <text v-else>登录中...</text>
      </button>

      <view class="register-link">
        <text>还没有账号？</text>
        <text class="register-text" @tap="goToRegister">立即注册</text>
      </view>
    </view>

    <view class="other-login">
      <text class="other-login-title">其他登录方式</text>
      <view class="login-icons">
        <text class="login-icon wechat" @tap="loginWithWechat">💚</text>
        <text class="login-icon phone" @tap="loginWithPhone">📱</text>
        <text class="login-icon qq" @tap="loginWithQQ">💙</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '../../../../shared/api.js'

// 表单数据
const form = reactive({
  email: '',
  password: ''
})

// 状态管理
const showPassword = ref(false)
const loading = ref(false)

// 切换密码可见性
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 密码输入框聚焦
const onPasswordFocus = () => {
  // 可以添加聚焦时的逻辑
}

// 密码输入框失焦
const onPasswordBlur = () => {
  // 可以添加失焦时的逻辑
}

// 处理登录
const handleLogin = async () => {
  // 表单验证
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

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    uni.showToast({
      title: '请输入正确的邮箱地址',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    // 调用登录API
    const response = await api.user.login({
      email: form.email,
      password: form.password
    })

    // 保存用户信息和token
    uni.setStorageSync('userInfo', {
      avatar: response.avatar || '',
      nickname: response.nickname,
      email: response.email
    })
    uni.setStorageSync('token', response.token)

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1500)
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败，请检查邮箱和密码',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  uni.navigateTo({
    url: '../register/register'
  })
}

// 跳转到忘记密码页面
const goToForgot = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 微信登录
const loginWithWechat = () => {
  uni.showToast({
    title: '微信登录功能开发中',
    icon: 'none'
  })
}

// 手机号登录
const loginWithPhone = () => {
  uni.showToast({
    title: '手机号登录功能开发中',
    icon: 'none'
  })
}

// QQ登录
const loginWithQQ = () => {
  uni.showToast({
    title: 'QQ登录功能开发中',
    icon: 'none'
  })
}
</script>

<style scoped>
.login-container {
  padding: 40rpx 32rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 60rpx;
  margin-top: 100rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16rpx;
  display: block;
}

.app-slogan {
  font-size: 24rpx;
  color: #606266;
  display: block;
}

/* 登录表单 */
.login-form {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 40rpx;
}

.form-item {
  position: relative;
  margin-bottom: 32rpx;
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
  text-align: right;
  margin-bottom: 40rpx;
}

.forgot-password {
  font-size: 22rpx;
  color: #409EFF;
}

.login-btn {
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

.login-btn:disabled {
  background-color: #c0c4cc;
}

.register-link {
  text-align: center;
  font-size: 24rpx;
  color: #606266;
}

.register-text {
  color: #409EFF;
  margin-left: 8rpx;
}

/* 其他登录方式 */
.other-login {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 40rpx;
}

.other-login-title {
  font-size: 22rpx;
  color: #909399;
  margin-bottom: 32rpx;
  position: relative;
}

.other-login-title::before {
  content: '';
  position: absolute;
  left: -100rpx;
  top: 50%;
  width: 80rpx;
  height: 1rpx;
  background-color: #ebeef5;
}

.other-login-title::after {
  content: '';
  position: absolute;
  right: -100rpx;
  top: 50%;
  width: 80rpx;
  height: 1rpx;
  background-color: #ebeef5;
}

.login-icons {
  display: flex;
  justify-content: space-around;
  width: 240rpx;
}

.login-icon {
  font-size: 64rpx;
  padding: 16rpx;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.login-icon.wechat {
  font-size: 72rpx;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .app-name {
    font-size: 40rpx;
  }
  
  .app-slogan {
    font-size: 22rpx;
  }
  
  .login-form {
    padding: 24rpx;
  }
  
  .input {
    font-size: 26rpx;
    height: 64rpx;
  }
  
  .login-btn {
    font-size: 28rpx;
    height: 72rpx;
  }
}
</style>