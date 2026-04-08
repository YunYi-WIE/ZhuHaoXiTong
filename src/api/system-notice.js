import request from '@/utils/request';

/**
 * 2.12.1 查询通知详情
 * @param {number} id - 通知ID
 * @returns {Promise}
 */
export const getSystemNoticeDetail = (id) => {
  return request.get(`/api/system-notice/${id}`);
};

/**
 * 2.12.2 查询通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise}
 */
export const getSystemNoticeList = (params) => {
  return request.get('/api/system-notice/page', { params });
};