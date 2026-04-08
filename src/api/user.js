import request from '@/utils/request';

/**
 * 2.7.1 获取用户基本信息
 * @returns {Promise} 返回用户基本信息
 */
export const getUserInfo = () => {
  return request.get('/api/user/info');
};

/**
 * 2.7.2 修改用户基本信息
 * @param {Object} data - 用户信息更新参数
 * @param {string} data.username - 用户昵称/用户名
 * @param {string} data.avatar - 头像
 * @param {number} data.gender - 性别
 * @returns {Promise}
 */
export const updateUserInfo = (data) => {
  return request.post('/api/user/info/update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * 2.8.1 查询当前用户实名信息
 * @returns {Promise} 返回用户实名信息
 */
export const getUserRealInfo = () => {
  return request.get('/api/user/real-info');
};

/**
 * 2.8.2 新增实名信息
 * @param {Object} data - 实名信息参数
 * @param {string} data.realName - 真实姓名
 * @param {string} data.idCard - 身份证号
 * @param {string} data.phone - 手机号
 * @param {string} data.bankCard - 银行卡号（可选）
 * @returns {Promise}
 */
export const createUserRealInfo = (data) => {
  return request.post('/api/user/real-info', data);
};

/**
 * 2.8.3 修改实名信息
 * @param {number} id - 实名信息ID
 * @param {Object} data - 实名信息参数
 * @param {string} data.realName - 真实姓名
 * @param {string} data.idCard - 身份证号
 * @param {string} data.phone - 手机号
 * @param {string} data.bankCard - 银行卡号（可选）
 * @returns {Promise}
 */
export const updateUserRealInfo = (id, data) => {
  return request.put(`/api/user/real-info/${id}`, data);
};

/**
 * 2.8.4 删除实名信息
 * @param {number} id - 实名信息ID
 * @returns {Promise}
 */
export const deleteUserRealInfo = (id) => {
  return request.delete(`/api/user/real-info/${id}`);
};

/**
 * 2.8.5 激活钱包
 * @param {number} id - 实名信息ID
 * @param {Object} data - 钱包激活参数
 * @param {string} data.bankCard - 银行卡号
 * @returns {Promise}
 */
export const activateWallet = (id, data) => {
  return request.post(`/api/user/real-info/${id}/activate-wallet`, data);
};

/**
 * 2.7.3 查询余额信息
 * @returns {Promise} 返回用户余额信息
 */
export const getBalanceInfo = () => {
  return request.get('/api/user/balance-info');
};

/**
 * 修改登录密码
 * @param {Object} data
 * @param {string} data.oldPassword
 * @param {string} data.newPassword
 */
export const updateUserPassword = (data) => {
  return request.post('/api/user/password/update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};