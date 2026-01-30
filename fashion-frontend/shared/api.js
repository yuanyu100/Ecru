import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== '200') {
      // 处理错误响应
      console.error('API Error:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// API方法封装
const api = {
  // 用户相关
  user: {
    register: (data) => apiClient.post('/v1/users/register', data),
    login: (data) => apiClient.post('/v1/users/login', data),
    getUserInfo: (userId) => apiClient.get(`/v1/users/${userId}`),
    updatePreferences: (userId, data) => apiClient.put(`/v1/users/${userId}/preferences`, data)
  },
  
  // 衣橱管理
  wardrobe: {
    addItem: (data) => apiClient.post('/v1/wardrobe/items', data),
    getItems: (params) => apiClient.get('/v1/wardrobe/items', { params }),
    updateItem: (itemId, data) => apiClient.put(`/v1/wardrobe/items/${itemId}`, data),
    deleteItem: (itemId) => apiClient.delete(`/v1/wardrobe/items/${itemId}`),
    uploadImage: (itemId, formData) => apiClient.post(`/v1/wardrobe/items/${itemId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    setFrequency: (itemId, data) => apiClient.put(`/v1/wardrobe/items/${itemId}/frequency`, data)
  },
  
  // 穿搭推荐
  recommendation: {
    getRecommendations: (params) => apiClient.get('/v1/recommendations', { params }),
    analyzeOutfit: (formData) => apiClient.post('/v1/recommendations/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    getOutfits: (params) => apiClient.get('/v1/recommendations/outfits', { params })
  },
  
  // 视频分析
  video: {
    analyze: (formData) => apiClient.post('/v1/video/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    getResult: (videoId) => apiClient.get(`/v1/video/${videoId}/result`)
  },
  
  // 知识库
  knowledge: {
    search: (params) => apiClient.get('/v1/knowledge/search', { params }),
    getFabric: (fabricId) => apiClient.get(`/v1/knowledge/fabric/${fabricId}`),
    getGuide: (guideId) => apiClient.get(`/v1/knowledge/guides/${guideId}`)
  },
  
  // 商户与商品
  merchant: {
    follow: (merchantId) => apiClient.post(`/v1/merchants/${merchantId}/follow`),
    getNewArrivals: (merchantId) => apiClient.get(`/v1/merchants/${merchantId}/new-arrivals`),
    searchProducts: (params) => apiClient.get('/v1/products/search', { params })
  },
  
  // 面料分析
  fabric: {
    analyze: (formData) => apiClient.post('/v1/fabric/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    getLibrary: () => apiClient.get('/v1/fabric/library')
  }
}

export default api