/**
 * 工具函数集合
 */

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  return date.toLocaleDateString('zh-CN', mergedOptions)
}

/**
 * 获取星期几
 * @param {Date} date - 日期对象
 * @returns {string} 星期几字符串
 */
export const getWeekday = (date) => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()]
}

/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机数
 */
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 显示加载状态
 * @param {Object} options - 选项
 * @returns {Function} 关闭加载状态的函数
 */
export const showLoading = (options = {}) => {
  const {
    title = '加载中...',
    mask = true
  } = options
  
  uni.showLoading({
    title,
    mask
  })
  
  return () => {
    uni.hideLoading()
  }
}

/**
 * 显示提示信息
 * @param {Object} options - 选项
 */
export const showToast = (options = {}) => {
  const {
    title = '操作成功',
    icon = 'success',
    duration = 2000,
    mask = false
  } = options
  
  uni.showToast({
    title,
    icon,
    duration,
    mask
  })
}

/**
 * 显示错误提示
 * @param {string} message - 错误信息
 */
export const showError = (message) => {
  showToast({
    title: message,
    icon: 'none'
  })
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
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

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait) => {
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

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
