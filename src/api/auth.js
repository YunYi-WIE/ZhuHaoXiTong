import request from '@/utils/request';

// 发送手机验证码
export const sendCodeApi = (phone) => {
  return request.post('/api/auth/sendCode', null, { params: { phone } });
};

// 账号密码登录
export const loginByPasswordApi = (data) => {
  return request.post('/api/auth/login/password', data);
};

// 手机验证码登录
export const loginByCodeApi = (data) => {
  return request.post('/api/auth/login/code', data);
};

// 🚀 新增：调用后端真实的微信一键登录接口
export const loginByWechatApi = (wxCode) => {
  // 根据 OpenAPI 文档，wxCode 是 query 参数，因此用 params 传递
  return request.post('/api/auth/login/wechat', null, { params: { wxCode } });
};