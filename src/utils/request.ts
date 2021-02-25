import axios from 'axios'
import config from '@/config/index'
import { notification } from 'antd'
import { store } from '@/utils/store'
import { TOKEN } from './constant'

const instance = axios.create({
  baseURL: config.baseUrl,
  headers: '',
})

instance.interceptors.request.use(
  async (request) => {
    await store.getItem(TOKEN).then((res) => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJ1c2VySWQiOjEwLCJpYXQiOjE2MTQyNjExNTQsImV4cCI6MTYxNDg2NTk1NH0.XoOxPrM-subLh4qMgqMaqh3dpYfoIfkp9dHAt3KggNE'
      if (res) {
        request.headers = {
          Authorization: `Bearer ${token}`,
        }
      }
    })
    return request
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { request } = error
    switch (request.status) {
      case 401:
        notification.open({
          message: '提示',
          description: request.responseText,
          type: 'error',
        })
        window.location.replace('/login')
        break
      default:
    }
    return Promise.reject(error)
  },
)

export { instance as http }
