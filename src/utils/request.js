import axios from 'axios';
import { showToast } from 'vant';

const service = axios.create({
  baseURL: '', // 因为我们在 vite.config.js 配置了代理，这里留空即可
  timeout: 15000, 
});

// 请求拦截器：自动携带 Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：统一处理后端返回格式
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 根据接口文档，SaResult 的 code 为 200 代表成功
    if (res.code === 200) {
      return res.data;
    } else {
      showToast(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
  },
  error => {
    showToast(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;