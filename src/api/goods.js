import request from '@/utils/request';

// 获取游戏分类列表
export const getCategoryListApi = () => {
  return request.get('/api/category/list');
};

// 获取商品分页列表
export const getGoodsListApi = (params) => {
  return request.get('/api/goods/list', { params });
};

// 获取商品详情
export const getGoodsDetailApi = (id) => {
  return request.get(`/api/goods/detail/${id}`);
};