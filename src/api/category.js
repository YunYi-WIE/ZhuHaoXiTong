import request from '@/utils/request';

/**
 * 2.10.1 获取游戏分类列表
 * 查询所有可显示的游戏分类，按权重排序
 * @returns {Promise} 返回游戏分类列表
 */
export const getCategoryList = () => {
  return request.get('/api/category/list');
};