/**
 * 支付模块模拟数据
 */

// 支付订单成功响应（已在order.js中定义，这里作为补充）
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

// 获取支付方式列表
export const getPaymentMethods = () => {
  const methods = [
    { id: 1, code: 'alipay', name: '支付宝', icon: 'alipay', description: '推荐使用，到账快', enabled: true },
    { id: 2, code: 'wechat', name: '微信支付', icon: 'wechat', description: '便捷支付', enabled: true },
    { id: 3, code: 'balance', name: '账户余额', icon: 'gold-coin', description: '余额充足，支付快捷', enabled: true },
    { id: 4, code: 'bankcard', name: '银行卡支付', icon: 'credit-pay', description: '支持储蓄卡/信用卡', enabled: false }
  ];

  return {
    msg: '获取成功',
    code: 0,
    data: methods,
    empty: false
  };
};

// 获取支付状态
export const getPaymentStatus = (orderId) => {
  const status = {
    orderId: orderId,
    status: 'paid', // unpaid, paying, paid, failed
    amount: 23.20,
    payTime: new Date().toISOString(),
    payMethod: 'alipay',
    transactionId: 'TX' + Date.now().toString().slice(-10)
  };

  return {
    msg: '获取成功',
    code: 0,
    data: status,
    empty: false
  };
};

// 创建支付订单（预支付）
export const createPayment = (orderId, payMethod) => {
  const payment = {
    paymentId: 'PAY' + Date.now().toString().slice(-10),
    orderId: orderId,
    payMethod: payMethod,
    amount: 23.20,
    qrCode: payMethod === 'alipay' ? 'https://picsum.photos/seed/alipayqr/300/300' : 'https://picsum.photos/seed/wechatqr/300/300',
    expireTime: new Date(Date.now() + 900000).toISOString(), // 15分钟后过期
    createTime: new Date().toISOString()
  };

  return {
    msg: '创建支付订单成功',
    code: 0,
    data: payment,
    empty: false
  };
};

// 模拟支付回调
export const paymentCallback = (paymentId) => {
  return {
    msg: '支付成功',
    code: 0,
    data: {
      paymentId: paymentId,
      status: 'success',
      completeTime: new Date().toISOString()
    },
    empty: false
  };
};

// 充值接口
export const recharge = (amount, method) => {
  return {
    msg: '充值申请已提交',
    code: 0,
    data: {
      rechargeId: 'RECH' + Date.now().toString().slice(-10),
      amount: amount,
      method: method,
      status: 'processing',
      createTime: new Date().toISOString()
    },
    empty: false
  };
};

// 获取充值记录
export const getRechargeRecords = (current = 1, size = 10) => {
  const records = [
    { id: 1, amount: 100.00, method: 'alipay', status: 'success', createTime: '2026-03-20 10:30:00' },
    { id: 2, amount: 200.00, method: 'wechat', status: 'success', createTime: '2026-03-15 14:45:00' },
    { id: 3, amount: 50.00, method: 'alipay', status: 'failed', createTime: '2026-03-10 09:20:00' },
    { id: 4, amount: 300.00, method: 'balance', status: 'success', createTime: '2026-03-01 10:10:00' },
    { id: 5, amount: 150.00, method: 'wechat', status: 'success', createTime: '2026-02-25 16:30:00' }
  ];

  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = records.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: records.length,
      size: size,
      current: current,
      pages: Math.ceil(records.length / size)
    },
    empty: records.length === 0
  };
};