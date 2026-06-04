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
let isRefreshToken = false
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
      if (!isRefreshToken) {
        isRefreshToken = true
        try {
          // 1. 获取 refreshToken
          if (!getRefreshToken()) {
            throw new Error('无刷新令牌，请重新登录')
          }

          await refreshToken()

          const token = getToken()
          originalConfig.headers.Authorization = `Bearer ${token}`
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
          isRefreshToken = false
        }
      } else {
        return new Promise((resolve) => {
          retryRequests.push((token: string) => {
            originalConfig.headers.Authorization = `Bearer ${token}`
            resolve(originalConfig)
          })
        })
      }
    }

    let errorMsg = ''
    const url = response?.config?.url || ''
    if (error.code === 'ECONNABORTED') {
      errorMsg = `请求超时：${url}，请稍后重试`
    } else if (error.response) {
      const status = error.response.status
      const serverMsg = error.response.data?.message || error.response.statusText
      switch (status) {
        case 404:
          errorMsg = `接口未找到：${url}（${status}）`
          break
        case 500:
          errorMsg = `服务器错误（${status}），请稍后重试`
          break
        case 403:
          errorMsg = `没有访问权限：${url}（${status}）`
          break
        default:
          errorMsg = serverMsg ? `${serverMsg}（${status}）` : `请求失败（${status}）`
      }
    } else {
      errorMsg = error.message || '网络错误，请检查网络连接'
    }
    ElMessage.error(errorMsg, { duration: 3000 })
    return Promise.reject(error)
  },
)
export default request
