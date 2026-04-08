/**
 * 认证模块模拟数据
 */

// 登录成功响应
export const loginSuccess = {
  msg: '登录成功',
  code: 0,
  data: {
    token: 'mock-jwt-token-1234567890abcdef',
    user: {
      id: 1,
      phone: '13800138000',
      username: '测试用户',
      avatar: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
      balance: 1000.00,
      isRealAuth: true
    }
  },
  empty: false
};

// 注册成功响应
export const registerSuccess = {
  msg: '注册成功',
  code: 0,
  data: {
    token: 'mock-jwt-token-register-123456',
    user: {
      id: 2,
      phone: '13800138001',
      username: '新用户',
      avatar: '',
      balance: 0.00,
      isRealAuth: false
    }
  },
  empty: false
};

// 短信验证码发送成功
export const smsCodeSuccess = {
  msg: '验证码发送成功',
  code: 0,
  data: null,
  empty: true
};

// 退出登录成功
export const logoutSuccess = {
  msg: '退出成功',
  code: 0,
  data: null,
  empty: true
};