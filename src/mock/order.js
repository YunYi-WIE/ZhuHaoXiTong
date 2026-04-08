/**
 * 订单模块模拟数据
 */

// 导入商品数据用于生成订单
import { generateGoodsList } from './goods.js';

// 订单状态映射
const orderStatusMap = {
  0: '待支付',
  1: '已支付',
  2: '进行中',
  3: '已完成',
  4: '已取消',
  5: '已退款'
};

// 生成模拟订单列表
const generateOrderList = (count = 15) => {
  const goodsList = generateGoodsList(count);
  const statuses = [0, 1, 2, 3, 4]; // 订单状态

  return goodsList.map((goods, index) => {
    const rentHours = [1, 2, 4, 8, 12, 24][index % 6];
    const totalAmount = goods.rent * rentHours + goods.deposit;
    const status = statuses[index % statuses.length];
    const createdAt = new Date(Date.now() - (index * 86400000)).toISOString(); // 递减天数

    // 根据状态设置时间
    let payTime = null;
    let startTime = null;
    let endTime = null;
    let finishTime = null;
    let cancelTime = null;

    if (status >= 1) {
      payTime = new Date(new Date(createdAt).getTime() + 300000).toISOString(); // 5分钟后支付
    }

    if (status >= 2) {
      startTime = new Date(new Date(payTime).getTime() + 600000).toISOString(); // 支付后10分钟开始
    }

    if (status >= 3) {
      endTime = new Date(new Date(startTime).getTime() + rentHours * 3600000).toISOString(); // 租赁时长后结束
      finishTime = new Date(new Date(endTime).getTime() + 300000).toISOString(); // 结束后5分钟确认完成
    }

    if (status === 4) {
      cancelTime = new Date(new Date(createdAt).getTime() + 1800000).toISOString(); // 创建后30分钟取消
    }

    return {
      id: 1000 + index,
      orderNo: `ORD${Date.now().toString().slice(-8)}${String(index).padStart(4, '0')}`,
      goodsId: goods.id,
      goodsInfo: {
        ...goods,
        title: goods.title,
        gameName: goods.gameName,
        images: goods.images
      },
      userId: 1,
      rentHours: rentHours,
      unitPrice: goods.rent,
      rentAmount: goods.rent * rentHours,
      deposit: goods.deposit,
      totalAmount: totalAmount,
      actualAmount: totalAmount, // 实际支付金额
      status: status,
      statusText: orderStatusMap[status],
      payMethod: index % 3 === 0 ? 'balance' : index % 3 === 1 ? 'alipay' : 'wechat',
      payTime: payTime,
      startTime: startTime,
      endTime: endTime,
      finishTime: finishTime,
      cancelTime: cancelTime,
      createdAt: createdAt,
      updatedAt: new Date(Date.now() - (index * 43200000)).toISOString(), // 半天的递减
      remark: index % 5 === 0 ? '账号使用顺利，体验很好' : '',
      refundReason: status === 5 ? '临时有事，不需要租了' : null,
      accountInfo: status >= 2 ? {
        loginMethod: goods.loginMethodText,
        account: `test${1000 + index}@qq.com`,
        password: index % 2 === 0 ? 'test123456' : null,
        qrCode: index % 2 === 1 ? 'https://picsum.photos/seed/qrcode/200/200' : null,
        expireTime: endTime
      } : null
    };
  });
};

// 订单列表
export const orderList = (current = 1, size = 10, status = null) => {
  const allOrders = generateOrderList(25);

  // 状态筛选
  let filteredOrders = allOrders;
  if (status !== null && status !== undefined) {
    filteredOrders = allOrders.filter(order => order.status === parseInt(status));
  }

  // 按创建时间倒序排序
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 分页
  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredOrders.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredOrders.length,
      size: size,
      current: current,
      pages: Math.ceil(filteredOrders.length / size)
    },
    empty: filteredOrders.length === 0
  };
};

// 订单详情
export const orderDetail = (id) => {
  const allOrders = generateOrderList(25);
  const order = allOrders.find(o => o.id === parseInt(id)) || allOrders[0];

  return {
    msg: '获取成功',
    code: 0,
    data: order,
    empty: false
  };
};

// 创建订单成功响应
export const createOrderSuccess = (goodsId, rentHours) => {
  const goodsList = generateGoodsList(1);
  const goods = goodsList[0];
  const totalAmount = goods.rent * rentHours + goods.deposit;

  const newOrder = {
    id: 9999,
    orderNo: `ORD${Date.now().toString().slice(-8)}9999`,
    goodsId: goodsId,
    goodsInfo: {
      ...goods,
      title: goods.title,
      gameName: goods.gameName,
      images: goods.images
    },
    rentHours: rentHours,
    unitPrice: goods.rent,
    rentAmount: goods.rent * rentHours,
    deposit: goods.deposit,
    totalAmount: totalAmount,
    status: 0,
    statusText: '待支付',
    createdAt: new Date().toISOString(),
    payDeadline: new Date(Date.now() + 1800000).toISOString() // 30分钟后过期
  };

  return {
    msg: '订单创建成功',
    code: 0,
    data: newOrder,
    empty: false
  };
};

// 支付订单成功响应
export const payOrderSuccess = {
  msg: '支付成功',
  code: 0,
  data: {
    payTime: new Date().toISOString(),
    orderStatus: 1,
    accountInfo: {
      loginMethod: 'QQ扫码',
      qrCode: 'https://picsum.photos/seed/qrcode/200/200',
      expireTime: new Date(Date.now() + 3600000).toISOString() // 1小时后过期
    }
  },
  empty: false
};

// 取消订单成功响应
export const cancelOrderSuccess = {
  msg: '订单取消成功',
  code: 0,
  data: {
    cancelTime: new Date().toISOString(),
    refundAmount: 50.00,
    refundStatus: '处理中'
  },
  empty: false
};

// 完成订单成功响应
export const finishOrderSuccess = {
  msg: '订单已完成',
  code: 0,
  data: {
    finishTime: new Date().toISOString(),
    depositReturned: true,
    returnAmount: 100.00
  },
  empty: false
};