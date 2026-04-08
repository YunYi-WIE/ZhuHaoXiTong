import request from '@/utils/request';

/**
 * 2.9.2 创建订单
 * @param {Object} data - 订单创建参数
 * @param {number} data.accountId - 账号ID (根据API文档)
 * @returns {Promise}
 */
export const createOrder = (data) => {
  return request.post('/api/order/create', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * 2.9.6 支付订单
 * @param {number|string} id - 订单ID
 * @param {Object} [body] - 如 { payMethod: 'balance' | 'wechat' | 'alipay' }；微信 Native 扫码常返回 codeUrl / qrCode
 * @returns {Promise}
 */
export const payOrder = (id, body = {}) => {
  const keys = Object.keys(body || {});
  if (!keys.length) {
    return request.post(`/api/order/pay/${id}`);
  }
  return request.post(`/api/order/pay/${id}`, body, {
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * 2.9.5 获取我的订单分页列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {number} params.status - 订单状态
 * @param {number|boolean} [params.hasDispute] - 为 1/true 时仅返回已发起投诉/售后的订单（需后端支持）
 * @returns {Promise}
 */
export const getMyOrderList = (params) => {
  return request.get('/api/order/list', { params });
};

/**
 * 2.9.1 取消订单
 * @param {number} id - 订单ID
 * @returns {Promise}
 */
export const cancelOrder = (id) => {
  return request.post(`/api/order/cancel/${id}`);
};

/**
 * 2.9.3 获取订单详情
 * @param {number} id - 订单ID
 * @returns {Promise}
 */
export const getOrderDetail = (id) => {
  return request.get(`/api/order/detail/${id}`);
};

/**
 * 2.9.4 完成订单（确认收货）
 * @param {number} id - 订单ID
 * @returns {Promise}
 */
export const finishOrder = (id) => {
  return request.post(`/api/order/finish/${id}`);
};

/**
 * 2.9.7 查询订单轨迹
 * @param {number} id - 订单ID
 * @returns {Promise}
 */
export const getOrderTimeline = (id) => {
  return request.get(`/api/order/${id}/timeline`);
};

/**
 * 2.9.8 查询订单最新投诉
 * @param {number} id - 订单ID
 * @returns {Promise}
 */
export const getOrderDispute = (id) => {
  return request.get(`/api/order/${id}/dispute`);
};

/**
 * 2.9.9 发起订单投诉
 * @param {number} id - 订单ID
 * @param {Object} data - 投诉参数
 * @param {string} data.reason - 投诉理由
 * @param {string} data.evidenceImages - 证据图片，多个用逗号分隔
 * @param {number} [data.refundAmount] - 退款金额（元）
 * @param {number} [data.requestedAmount] - 与 refundAmount 同义时传相同值，兼容旧字段
 * @returns {Promise}
 */
export const createOrderDispute = (id, data) => {
  return request.post(`/api/order/${id}/dispute`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
};