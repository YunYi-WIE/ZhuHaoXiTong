import request from '@/utils/request';

export const getBoostServiceList = () => request.get('/api/operate/boost/list');

export const createBoostOrder = (data) =>
  request.post('/api/boost/order/create', data, {
    headers: { 'Content-Type': 'application/json' },
  });

export const payBoostOrder = (id, data) => request.post(`/api/boost/order/pay/${id}`, data);

export const getBoostOrderDetail = (id) => request.get(`/api/boost/order/detail/${id}`);

export const getMyBoostOrderList = (params) => request.get('/api/boost/order/list', { params });

