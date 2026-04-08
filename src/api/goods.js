import request from '@/utils/request';

/**
 * 2.6.1 创建商家账号
 * @param {Object} data - 账号创建参数
 * @returns {Promise}
 */
export const createSjzAccount = (data) => {
  return request.post('/api/sjz-account', data, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
};

/**
 * 2.6.2 修改商家账号
 * @param {number} id - 账号ID
 * @param {Object} data - 账号修改参数
 * @returns {Promise}
 */
export const updateSjzAccount = (id, data) => {
  return request.put(`/api/sjz-account/${id}`, data);
};

/**
 * 2.6.3 删除商家账号
 * @param {number} id - 账号ID
 * @returns {Promise}
 */
export const deleteSjzAccount = (id) => {
  return request.delete(`/api/sjz-account/${id}`);
};

/**
 * 上架规则与上架费（无需登录）
 * @returns {Promise<{ listingFee, minStaminaLevel, minCarryCapacity, rulesText }>}
 */
export const getSjzPublishRules = () => {
  return request.get('/api/sjz-account/publish-rules');
};

/**
 * 时租/押金建议（文档阶梯规则）
 * @param {Object} params
 * @param {number} [params.hafuCoin] 与发布页哈弗币整数口径一致
 * @param {number} [params.million] 或直接传百万单位
 */
export const getSjzRentSuggest = (params = {}) => {
  return request.get('/api/sjz-account/rent-suggest', { params });
};

/**
 * 2.6.4 发布商家账号（需同意规则）
 * @param {number} id - 账号ID
 * @param {{ agreeListingRules: boolean }} body
 * @returns {Promise}
 */
export const publishSjzAccount = (id, body = { agreeListingRules: true }) => {
  return request.post(`/api/sjz-account/${id}/publish`, body);
};

/**
 * 2.6.5 下架商家账号
 * @param {number} id - 账号ID
 * @returns {Promise}
 */
export const unpublishSjzAccount = (id) => {
  return request.post(`/api/sjz-account/${id}/unpublish`);
};

/**
 * 2.6.6 获取商家账号详情（用于详情页展示）
 * @param {number} id - 账号ID
 * @returns {Promise}
 */
export const getSjzAccountDetail = (id) => {
  return request.get(`/api/sjz-account/detail/${id}`);
};

/**
 * 2.6.7 获取商家账号分页列表（支持高级筛选）
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} params.keyword - 搜索关键字（账号编号）
 * @param {string} params.regionAdcode - 地区编码
 * @param {number} params.minTotalAmount - 最小总价
 * @param {number} params.maxTotalAmount - 最大总价
 * @param {number} params.loginMethod - 上号方式：1-QQ账密, 2-QQ扫码, 3-微信账密, 4-微信扫码
 * @param {number} params.staminaLevel - 体力等级：1-7
 * @param {number} params.carryCapacity - 负重
 * @param {number} params.rankLevel - 段位：1-7
 * @param {number[]} params.skinIds - 皮肤ID列表（数组）
 * @param {number} params.awmCount - AWM数量
 * @param {number} params.sortType - 排序类型: 1-综合, 2-合计, 3-最新, 4-哈弗币, 5-时租, 6-AWM, 7-6头, 8-6甲, 9-账号等级
 * @returns {Promise}
 */
export const getSjzAccountList = (params) => {
  const flat = { ...(params || {}) };
  const skinIds = flat.skinIds;
  delete flat.skinIds;

  const usp = new URLSearchParams();
  Object.entries(flat).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.append(k, String(v));
  });
  if (Array.isArray(skinIds)) {
    skinIds.forEach((id) => {
      if (id === undefined || id === null || id === '') return;
      usp.append('skinIds', String(id));
    });
  }

  const q = usp.toString();
  return request.get(q ? `/api/sjz-account/list?${q}` : '/api/sjz-account/list');
};

/**
 * 2.6.8 获取我的商家账号详情
 * @param {number} id - 账号ID
 * @returns {Promise}
 */
export const getMySjzAccountDetail = (id) => {
  return request.get(`/api/sjz-account/mine/${id}`);
};

/**
 * 2.6.9 获取我的商家账号列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {number} params.status - 状态
 * @returns {Promise}
 */
export const getMySjzAccountList = (params) => {
  return request.get('/api/sjz-account/mine/list', { params });
};

// 为了保持向后兼容，提供别名函数
/**
 * @deprecated 请使用 getSjzAccountList
 */
export const getGoodsList = (params) => {
  return getSjzAccountList(params);
};

/**
 * @deprecated 请使用 getSjzAccountDetail
 */
export const getGoodsDetail = (id) => {
  return getSjzAccountDetail(id);
};

/**
 * 2.11.1 查询皮肤分组列表
 * 按皮肤类型返回所有上架皮肤
 * @returns {Promise}
 */
export const getSkinGroupList = () => {
  return request.get('/api/skin/group');
};