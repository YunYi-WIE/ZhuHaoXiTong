import request from '@/utils/request';

/**
 * C 端钱包/提现：与后端已实现的接口一致。
 * （历史文档中的 /api/wallet/* 多数未实现，已移除，避免误用。）
 */

/** @returns {Promise} GET /api/user/balance-info */
export const getWalletBalance = () => request.get('/api/user/balance-info');

/** @param {{ amount: number }} data */
export const createWithdraw = (data) => request.post('/api/withdraw/apply', data);

/** @param {{ current?: number, size?: number, status?: number }} params */
export const getWithdrawList = (params) => request.get('/api/withdraw/list', { params });

/** @param {number|string} id */
export const getWithdrawDetail = (id) => request.get(`/api/withdraw/${id}`);
