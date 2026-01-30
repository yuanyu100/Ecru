// 工具函数集合

// 日期格式化
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 本地存储操作
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 深度克隆
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// 图片压缩
export function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(resolve, 'image/jpeg', quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

// 验证邮箱格式
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 验证密码强度
export function validatePassword(password) {
  // 至少8位，包含字母和数字
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
}

// 计算两个日期之间的天数
export function getDaysBetweenDates(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000
  const firstDate = new Date(date1)
  const secondDate = new Date(date2)
  return Math.round(Math.abs((firstDate - secondDate) / oneDay))
}

// 生成随机颜色
export function generateRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 格式化数字（添加千分位）
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 检测设备类型
export function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  return {
    isMobile,
    isTablet,
    isDesktop
  }
}

// 获取浏览器信息
export function getBrowserInfo() {
  const userAgent = navigator.userAgent
  let browserName = 'Unknown'
  let version = ''

  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)[1]
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1]
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari'
    version = userAgent.match(/Version\/(\d+\.\d+)/)[1]
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge'
    version = userAgent.match(/Edge\/(\d+\.\d+)/)[1]
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
    browserName = 'Internet Explorer'
    version = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1]
  }

  return {
    name: browserName,
    version
  }
}