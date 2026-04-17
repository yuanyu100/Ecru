/**
 * 应用相关的组合式API
 */
import { ref, computed, onMounted } from 'vue'
import { formatDate, getWeekday, delay } from '../utils/tools'

/**
 * 使用日期和时间
 * @returns {Object} 日期相关的响应式数据和方法
 */
export const useDateTime = () => {
  const currentDate = ref('')
  const currentWeekday = ref('')
  const currentTime = ref('')

  const updateDateTime = () => {
    const now = new Date()
    currentDate.value = formatDate(now)
    currentWeekday.value = getWeekday(now)
    
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    currentTime.value = now.toLocaleTimeString('zh-CN', timeOptions)
  }

  onMounted(() => {
    updateDateTime()
    // 每分钟更新一次时间
    const timer = setInterval(updateDateTime, 60000)
    
    return () => {
      clearInterval(timer)
    }
  })

  return {
    currentDate,
    currentWeekday,
    currentTime,
    updateDateTime
  }
}

/**
 * 使用加载状态
 * @returns {Object} 加载状态相关的响应式数据和方法
 */
export const useLoading = () => {
  const isLoading = ref(false)
  const loadingMessage = ref('')

  const showLoading = (message = '加载中...') => {
    isLoading.value = true
    loadingMessage.value = message
  }

  const hideLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  const withLoading = async (fn, message = '加载中...') => {
    try {
      showLoading(message)
      const result = await fn()
      hideLoading()
      return result
    } catch (error) {
      hideLoading()
      throw error
    }
  }

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    withLoading
  }
}

/**
 * 使用错误处理
 * @returns {Object} 错误处理相关的响应式数据和方法
 */
export const useError = () => {
  const showError = ref(false)
  const errorMessage = ref('')

  const handleError = (message = '操作失败，请重试') => {
    showError.value = true
    errorMessage.value = message
  }

  const clearError = () => {
    showError.value = false
    errorMessage.value = ''
  }

  const withErrorHandling = async (fn, errorMessage = '操作失败，请重试') => {
    try {
      return await fn()
    } catch (error) {
      console.error('Error:', error)
      handleError(errorMessage)
      throw error
    }
  }

  return {
    showError,
    errorMessage,
    handleError,
    clearError,
    withErrorHandling
  }
}

/**
 * 使用OOTD推荐
 * @returns {Object} OOTD相关的响应式数据和方法
 */
export const useOOTD = () => {
  const currentOOTD = ref({
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20spring%20outfit%20with%20jeans%20and%20sweatshirt&image_size=portrait_4_3',
    title: '春季休闲搭配',
    description: '适合22°C的晴天，舒适又时尚',
    tags: ['休闲', '春季', '舒适'],
    score: 95
  })

  const ootdOptions = [
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20spring%20outfit%20with%20jeans%20and%20sweatshirt&image_size=portrait_4_3',
      title: '春季休闲搭配',
      description: '适合22°C的晴天，舒适又时尚',
      tags: ['休闲', '春季', '舒适'],
      score: 95
    },
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20spring%20dress%20outfit&image_size=portrait_4_3',
      title: '春季优雅裙装',
      description: '适合约会或聚会的优雅装扮',
      tags: ['优雅', '春季', '裙装'],
      score: 92
    },
    {
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20casual%20spring%20outfit&image_size=portrait_4_3',
      title: '春季 smart casual',
      description: '适合工作和休闲场合的百搭装扮',
      tags: ['smart', '春季', '百搭'],
      score: 94
    }
  ]

  const refreshOOTD = async () => {
    await delay(1000) // 模拟网络请求延迟
    const randomIndex = Math.floor(Math.random() * ootdOptions.length)
    currentOOTD.value = ootdOptions[randomIndex]
  }

  return {
    currentOOTD,
    refreshOOTD
  }
}

/**
 * 使用场景推荐
 * @returns {Object} 场景推荐相关的响应式数据和方法
 */
export const useScenes = () => {
  const scenes = ref([
    {
      id: 1,
      name: '日常通勤',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20casual%20outfit%20work&image_size=square'
    },
    {
      id: 2,
      name: '周末约会',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20date%20outfit%20weekend&image_size=square'
    },
    {
      id: 3,
      name: '运动健身',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20athletic%20outfit%20gym&image_size=square'
    },
    {
      id: 4,
      name: '派对聚会',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=party%20fashion%20outfit%20evening&image_size=square'
    }
  ])

  const getSceneById = (id) => {
    return scenes.value.find(scene => scene.id === id)
  }

  return {
    scenes,
    getSceneById
  }
}

/**
 * 使用穿搭趋势
 * @returns {Object} 穿搭趋势相关的响应式数据和方法
 */
export const useTrends = () => {
  const trends = ref([
    {
      id: 1,
      title: '2026春季流行色趋势',
      description: '今年春季最热门的色彩搭配方案',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%202026%20color%20trends%20fashion&image_size=landscape_4_3',
      source: '时尚杂志',
      date: '2026-01-20'
    },
    {
      id: 2,
      title: '复古风回潮',
      description: '80年代复古风格重新流行',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=80s%20retro%20fashion%20trend&image_size=landscape_4_3',
      source: '潮流博客',
      date: '2026-01-15'
    }
  ])

  const getTrendById = (id) => {
    return trends.value.find(trend => trend.id === id)
  }

  return {
    trends,
    getTrendById
  }
}
