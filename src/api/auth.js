import request from '@/utils/request';

/**
 * 2.1.1 账号密码登录
 * @param {Object} data { phone, password, smsCode }
 * 注意：文档标注这三个字段均为必须 (true)
 */
export const loginByPasswordApi = (data) => {
  const payload = {
    phone: data.phone || '',
    password: data.password || '',
    // 须与 /api/auth/sms-code 返回一致；勿使用占位默认值，否则服务端校验必失败
    smsCode: data.smsCode != null ? String(data.smsCode) : '',
  };

  return request.post('/api/auth/login/password', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * 2.1.3 手机号注册
 * @param {Object} data { phone, password, smsCode }
 */
export const registerByPhoneApi = (data) => {
  const payload = {
    phone: data.phone || '',
    password: data.password || '',
    smsCode: data.smsCode != null ? String(data.smsCode) : '',
  };

  return request.post('/api/auth/register/phone', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * 2.1.4 获取短信验证码
 * @param {string} phone 手机号
 * 注意：该接口要求使用 Query 参数
 */
export const sendCodeApi = (phone) => {
  return request.get('/api/auth/sms-code', {
    params: { phone } // 🚀 Axios 会将其拼接到 URL 后: ?phone=xxx
  });
};

/**
 * 2.1.2 退出登录
 */
export const logoutApi = () => {
  return request.post('/api/auth/logout');
};

/**
 * 2.2.1 管理员手机号密码登录
 * @param {Object} data { phone, password, smsCode }
 */
export const adminLoginApi = (data) => {
  const payload = {
    phone: data.phone || '',
    password: data.password || '',
    smsCode: data.smsCode != null ? String(data.smsCode) : '',
  };

  return request.post('/admin/auth/login/password', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * 2.2.2 管理员退出登录
 */
export const adminLogoutApi = () => {
  return request.post('/admin/auth/logout');
};

export const getWechatLoginConfigApi = () => {
  return request.get('/api/auth/wechat/config');
};

export const loginByWechatApi = (code) => {
  return request.post('/api/auth/login/wechat', { code }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};