// src/utils/request.js
import axios from 'axios';
import router from '@/router';

function isAuthMissingMessage(msg) {
  if (!msg || typeof msg !== 'string') return false;
  // 兼容后端常见提示：缺少请求头: Authorization / 未登录 / token 过期
  return (
    msg.includes('缺少请求头') ||
    msg.includes('Authorization') ||
    msg.includes('请先登录') ||
    msg.includes('未登录') ||
    msg.includes('登录已失效')
  );
}

function kickToLogin() {
  try {
    localStorage.removeItem('token');
  } catch (_) {}
  if (router.currentRoute?.value?.path !== '/login') {
    router
      .replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      .catch(() => {});
  }
}

// 创建 axios 实例：开发走 Vite 代理；生产默认 '' 由 Nginx 同域反代 /api，也可在 .env.production 配置 VITE_API_BASE_URL
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 10000, // 超时时间10秒
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}:`, {
        params: config.params,
        data: config.data,
        headers: config.headers
      });
    }


    // 假设登录后 token 存在 localStorage 中
    const token = localStorage.getItem('token');
    if (token) {
      // Sa-Token 默认不需要 Bearer 前缀，直接传纯粹的 token 字符串即可
      config.headers['Authorization'] = token;

      // 为了防止有些版本或自定义配置认不到，通常建议顺便加上小写的 token 字段，双保险
      config.headers['satoken'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (import.meta.env.DEV) {
      console.log(`[API响应] ${response.config.url}:`, {
        status: response.status,
        data: res,
        config: {
          method: response.config.method,
          url: response.config.url,
          params: response.config.params,
          data: response.config.data
        }
      });
    }

    // 原生数组响应
    if (Array.isArray(res)) {
      return res;
    }

    if (res && typeof res === 'object') {
      // 未使用 { code, data } 包装时（常见：直接返回 Page 或实体），信任 HTTP 状态
      if (!('code' in res)) {
        return res;
      }

      const codeOk =
        res.code == 200 ||
        res.code == 0 ||
        res.code == 1 ||
        res.code == 20000;

      if (codeOk) {
        if (res.data !== undefined && res.data !== null) {
          return res.data;
        }
        return {};
      }
    }

    const msg = (res && (res.msg || res.message)) || '系统错误';
    // 业务层未登录/过期：统一提示“请先登录”，并跳转登录页
    if (isAuthMissingMessage(msg)) {
      kickToLogin();
      return Promise.reject(new Error('请先登录'));
    }
    if (import.meta.env.DEV) {
      console.error(`[API错误] ${response.config.url}:`, msg, res);
    }
    return Promise.reject(new Error(msg));
  },
  (error) => {
    if (error.response) {
      const { data, status } = error.response;
      const pick =
        (typeof data === 'string' && data.trim()) ||
        data?.msg ||
        data?.message ||
        (typeof data?.error === 'string' ? data.error : '') ||
        '';
      const msg = pick || error.message || `HTTP ${status}`;
      // HTTP 层 token 失效（兼容 401/403 或后端用 500+msg 表示未登录）
      if (
        status === 401 ||
        status === 403 ||
        isAuthMissingMessage(msg)
      ) {
        kickToLogin();
        return Promise.reject(new Error('请先登录'));
      }
      if (import.meta.env.DEV) {
        console.error(`[API错误 ${status}] ${error.config?.url || '未知接口'}:`, {
          status,
          statusText: error.response.statusText,
          data,
          hint: msg !== error.message ? msg : undefined,
          config: {
            method: error.config?.method,
            url: error.config?.url,
            params: error.config?.params,
            data: error.config?.data,
            headers: error.config?.headers,
          },
        });
      }
      return Promise.reject(new Error(msg));
    }
    if (import.meta.env.DEV) {
      console.error('网络请求异常:', error.message, error);
    }
    return Promise.reject(error);
  }
);

export default request;