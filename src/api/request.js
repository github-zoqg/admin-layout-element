import axios from 'axios';
import emitter from '@/utils/mitt';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});
// 请求拦截器
service.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  return config;
});
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    if (response.data.code === 401) {
      emitter.emit('logout');
      return Promise.reject(response.data);
    }
    // 401 未登录，跳转到登录页
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
