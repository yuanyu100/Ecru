<template>
  <div class="settings">
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
        <h1 class="page-title">系统设置</h1>

        <!-- 设置选项卡 -->
        <el-card class="settings-card">
          <el-tabs v-model="activeTab" class="settings-tabs">
            <el-tab-pane label="账户设置" name="account">
              <div class="tab-content">
                <el-form :model="accountForm" label-width="120px" class="settings-form">
                  <el-form-item label="用户名">
                    <el-input v-model="accountForm.username" placeholder="请输入用户名" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="accountForm.email" placeholder="请输入邮箱" />
                  </el-form-item>
                  <el-form-item label="头像">
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="handleAvatarUpload"
                      accept="image/*"
                    >
                      <img v-if="accountForm.avatar" :src="accountForm.avatar" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="accountForm.password" type="password" placeholder="请输入新密码" />
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input v-model="accountForm.confirmPassword" type="password" placeholder="请确认新密码" />
                  </el-form-item>
                  <el-form-item label="风格偏好">
                    <el-select v-model="accountForm.stylePreferences" multiple placeholder="选择风格偏好">
                      <el-option label="休闲" value="休闲" />
                      <el-option label="商务" value="商务" />
                      <el-option label="运动" value="运动" />
                      <el-option label="时尚" value="时尚" />
                      <el-option label="复古" value="复古" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="常用尺码">
                    <el-input v-model="accountForm.usualSize" placeholder="请输入常用尺码" />
                  </el-form-item>
                  <el-form-item label="地区">
                    <el-input v-model="accountForm.region" placeholder="请输入地区" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveAccountSettings">保存设置</el-button>
                    <el-button @click="resetAccountForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="API配置" name="api">
              <div class="tab-content">
                <el-form :model="apiForm" label-width="120px" class="settings-form">
                  <el-form-item label="API基础URL">
                    <el-input v-model="apiForm.baseUrl" placeholder="请输入API基础URL" />
                  </el-form-item>
                  <el-form-item label="API密钥">
                    <el-input v-model="apiForm.apiKey" type="password" placeholder="请输入API密钥" />
                  </el-form-item>
                  <el-form-item label="超时设置">
                    <el-input-number v-model="apiForm.timeout" :min="1000" :max="30000" :step="1000" />
                    <span class="unit">毫秒</span>
                  </el-form-item>
                  <el-form-item label="请求重试">
                    <el-input-number v-model="apiForm.retryCount" :min="0" :max="5" :step="1" />
                    <span class="unit">次</span>
                  </el-form-item>
                  <el-form-item label="启用缓存">
                    <el-switch v-model="apiForm.enableCache" />
                  </el-form-item>
                  <el-form-item label="缓存时间">
                    <el-input-number v-model="apiForm.cacheTime" :min="0" :max="3600" :step="60" />
                    <span class="unit">秒</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveApiSettings">保存配置</el-button>
                    <el-button @click="testApiConnection">测试连接</el-button>
                    <el-button @click="resetApiForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数据管理" name="data">
              <div class="tab-content">
                <el-card class="data-card">
                  <h3 class="data-title">数据备份</h3>
                  <p class="data-description">定期备份数据可以防止数据丢失，建议每周至少备份一次。</p>
                  <el-button type="primary" @click="backupData">
                    <el-icon><Download /></el-icon>
                    <span>立即备份</span>
                  </el-button>
                  <el-button @click="restoreData">
                    <el-icon><Upload /></el-icon>
                    <span>恢复数据</span>
                  </el-button>
                </el-card>

                <el-card class="data-card" style="margin-top: 20px;">
                  <h3 class="data-title">数据清理</h3>
                  <p class="data-description">清理不需要的数据可以提高系统性能。</p>
                  <el-button type="warning" @click="cleanCache">
                    <el-icon><Delete /></el-icon>
                    <span>清理缓存</span>
                  </el-button>
                  <el-button type="danger" @click="cleanOldData">
                    <el-icon><Delete /></el-icon>
                    <span>清理旧数据</span>
                  </el-button>
                </el-card>

                <el-card class="data-card" style="margin-top: 20px;">
                  <h3 class="data-title">数据导出</h3>
                  <p class="data-description">将数据导出为Excel或CSV格式。</p>
                  <el-select v-model="exportFormat" placeholder="选择导出格式" style="width: 200px; margin-right: 10px;">
                    <el-option label="Excel" value="excel" />
                    <el-option label="CSV" value="csv" />
                  </el-select>
                  <el-button type="primary" @click="exportData">
                    <el-icon><Download /></el-icon>
                    <span>导出数据</span>
                  </el-button>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="系统信息" name="system">
              <div class="tab-content">
                <el-card class="system-card">
                  <h3 class="system-title">系统版本</h3>
                  <p class="system-info">当前版本: {{ systemInfo.version }}</p>
                  <p class="system-info">发布日期: {{ systemInfo.releaseDate }}</p>
                  <el-button @click="checkUpdate">检查更新</el-button>
                </el-card>

                <el-card class="system-card" style="margin-top: 20px;">
                  <h3 class="system-title">服务器信息</h3>
                  <p class="system-info">服务器地址: {{ systemInfo.serverAddress }}</p>
                  <p class="system-info">响应时间: {{ systemInfo.responseTime }}ms</p>
                  <p class="system-info">数据库状态: {{ systemInfo.databaseStatus }}</p>
                </el-card>

                <el-card class="system-card" style="margin-top: 20px;">
                  <h3 class="system-title">环境信息</h3>
                  <p class="system-info">浏览器: {{ systemInfo.browser }}</p>
                  <p class="system-info">操作系统: {{ systemInfo.os }}</p>
                  <p class="system-info">屏幕分辨率: {{ systemInfo.screenResolution }}</p>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PieChart, Collection, DataAnalysis, Document, Setting, Plus, Download, Upload, Delete } from '@element-plus/icons-vue'

// 响应式数据
const activeMenu = computed(() => useRoute().path)
const activeTab = ref('account')

// 账户设置表单
const accountForm = ref({
  username: '用户123',
  email: 'user@example.com',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture&image_size=square',
  password: '',
  confirmPassword: '',
  stylePreferences: ['休闲', '商务'],
  usualSize: 'M',
  region: '北京市'
})

// API配置表单
const apiForm = ref({
  baseUrl: 'http://localhost:8080/api',
  apiKey: '',
  timeout: 10000,
  retryCount: 3,
  enableCache: true,
  cacheTime: 300
})

// 导出格式
const exportFormat = ref('excel')

// 系统信息
const systemInfo = ref({
  version: '1.0.0',
  releaseDate: '2026-01-01',
  serverAddress: 'http://localhost:8080',
  responseTime: 120,
  databaseStatus: '正常',
  browser: 'Chrome 120.0.0.0',
  os: 'Windows 10',
  screenResolution: '1920x1080'
})

// 方法
const saveAccountSettings = () => {
  console.log('Saving account settings:', accountForm.value)
}

const resetAccountForm = () => {
  accountForm.value = {
    username: '用户123',
    email: 'user@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture&image_size=square',
    password: '',
    confirmPassword: '',
    stylePreferences: ['休闲', '商务'],
    usualSize: 'M',
    region: '北京市'
  }
}

const handleAvatarUpload = (file) => {
  accountForm.value.avatar = URL.createObjectURL(file.raw)
}

const saveApiSettings = () => {
  console.log('Saving API settings:', apiForm.value)
}

const testApiConnection = () => {
  console.log('Testing API connection')
}

const resetApiForm = () => {
  apiForm.value = {
    baseUrl: 'http://localhost:8080/api',
    apiKey: '',
    timeout: 10000,
    retryCount: 3,
    enableCache: true,
    cacheTime: 300
  }
}

const backupData = () => {
  console.log('Backing up data')
}

const restoreData = () => {
  console.log('Restoring data')
}

const cleanCache = () => {
  console.log('Cleaning cache')
}

const cleanOldData = () => {
  console.log('Cleaning old data')
}

const exportData = () => {
  console.log('Exporting data in format:', exportFormat.value)
}

const checkUpdate = () => {
  console.log('Checking for updates')
}
</script>

<style scoped>
.settings {
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

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.settings-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.settings-tabs {
  width: 100%;
}

.tab-content {
  padding: 20px 0;
}

.settings-form {
  max-width: 600px;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #c0c4cc;
}

.unit {
  margin-left: 10px;
  color: #909399;
}

.data-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.data-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.data-description {
  color: #606266;
  margin-bottom: 20px;
}

.system-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.system-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

.system-info {
  color: #606266;
  margin-bottom: 10px;
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
  
  .settings-form {
    max-width: 100%;
  }
}
</style>