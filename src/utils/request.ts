import axios from 'axios'
import config from '@/config/index'
import { notification } from 'antd'
import { store } from '@/utils/store'
import { TOKEN } from './constant'
import { logOutUtils } from '.'

const instance = axios.create({
  baseURL: config.baseUrl,
  headers: '',
})

instance.interceptors.request.use(
  async (request) => {
    await store.getItem(TOKEN).then((res) => {
      console.log(res, '请求传递的token')
      if (res) {
        request.headers = {
          Authorization: `Bearer ${res}`,
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
        logOutUtils()
        break
      default:
    }
    return Promise.reject(error)
  },
)

export { instance as http }
