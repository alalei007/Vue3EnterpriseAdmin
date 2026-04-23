import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { refreshToken } from './user'
import { getRefreshToken, getToken, removeRefreshToken, removeToken } from '@/utils/storage'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 刷新token锁，避免重复刷新token
let isResfreshToken = false
// token刷新期间，需要重试的请求
let retryRequests: Array<Function> = []
const router = useRouter()
request.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  async (error: AxiosError) => {
    const originalConfig = { ...error.config, _retry: false }
    const response = error.response

    if (response?.status === 401 && !originalConfig._retry) {
      // 标记当前请求已重试，避免无限循环
      originalConfig._retry = true
      if (!isResfreshToken) {
        isResfreshToken = true
        try {
          // 1. 获取 refreshToken
          if (!getRefreshToken()) {
            throw new Error('无刷新令牌，请重新登录')
          }

          await refreshToken()

          const token = getToken()
          originalConfig.headers.Authorization = `Bear ${token}`
          retryRequests.forEach((cb) => {
            cb(token)
          })
          retryRequests = []
          return request(originalConfig)
        } catch (err) {
          removeToken()
          removeRefreshToken()
          router.push('/login')
          return Promise.reject(err)
        } finally {
          isResfreshToken = false
        }
      } else {
        return new Promise((resolve) => {
          retryRequests.push((token: string) => {
            originalConfig.headers.Authorization = `Bear ${token}`
            resolve(originalConfig)
          })
        })
      }
    }

    let errorMsg = ''
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMsg = '接口不存在，请检查接口地址'
          break
        case 500:
          errorMsg = '服务器内部错误，请稍后重试'
          break
        default:
          errorMsg = error.response.data?.message || '请求失败'
      }
    } else {
      errorMsg = '网络异常，请检查网络连接'
    }
    ElMessage.error(errorMsg)
    return Promise.reject(error)
  },
)
export default request
