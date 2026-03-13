import axios from 'axios';
import { showToast } from 'vant';

// 1. 创建 axios 实例
const service = axios.create({
  // 这里写 /api，配合后面的 vite 跨域代理使用
  baseURL: '/api', 
  timeout: 10000 // 请求超时时间：10秒
});

// 2. 请求拦截器 (发请求前要做的事)
service.interceptors.request.use(
  config => {
    // 每次发请求前，检查本地缓存有没有 Token (登录凭证)
    const token = localStorage.getItem('token');
    if (token) {
      // 如果有，就塞到请求头里（具体字段名 'Authorization' 需后端确认）
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器 (后端返回数据后要做的事)
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 假设后端约定的成功状态码是 200 或 0 (需根据后端实际接口文档调整)
    if (res.code === 200 || res.code === 0) {
      return res.data; // 直接返回有用的数据部分
    } else {
      // 后端返回业务报错（如密码错误），统一弹出提示
      showToast(res.msg || '系统错误');
      
      // 如果状态码是 401，说明 Token 过期或者没登录
      if (res.code === 401) {
        localStorage.removeItem('token');
        // 可以加上跳转登录页的逻辑： window.location.href = '/login';
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
  },
  error => {
    // 服务器连不上、404、500 等严重的网络错误
    showToast(error.message || '网络异常，请稍后再试');
    return Promise.reject(error);
  }
);

export default service;