import axios from 'axios'
import config from '@/config/index'

const http = axios.create({
  baseURL: config.baseUrl,
})

export { http }
