import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import Toast from '@/utils/Toast'
import store from 'store'

const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? '/_api' : import.meta.env.VITE_API_BASE_URL,
    timeout: 10 * 1000, // 请求超时时间
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

// 添加请求拦截器
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.get('token')
    if (token) {
        config.headers['X-Access-Token'] = `${token}`
    }
    return config
})

// 添加响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const { code, msg, message, success } = response.data ?? {}
        const resolvedMsg = msg || message || 'An error occurred'

        console.log('ce111', code)

        if (code === 200 || code === 0 || success === true) {
            return response?.data?.result
        } else {
            console.log('code', 200)
            handleErrorCode(code, resolvedMsg)
            return Promise.reject(resolvedMsg)
        }
    },
    (error) => {
        const { status, response } = error

        handleErrorCode(response?.data?.code || status, response?.data?.msg || response?.data?.message)
        return Promise.reject(response?.data)
    }
)

// 错误处理
function handleErrorCode(code: number, msg: string = 'An error occurred') {
    switch (code) {
        case 401:
            console.error('Unauthorized: Please log in.')
            // 登录失效，跳转到统一登录页（仅生产环境）
            if (import.meta.env.MODE !== 'development') {
                window.location.href = 'https://devenv.luoniushan.com/eventapi/event/qwauth/login'
            }
            break
        case 500:
            Toast.error(msg || 'Server Error')
            break
        default:
            Toast.error(msg)
            break
    }
}

export default instance
