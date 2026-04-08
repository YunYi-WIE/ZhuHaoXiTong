/**
 * 钱包模块模拟数据
 */

// 钱包余额查询
export const getWalletBalance = () => {
  const balanceData = {
    balance: 128.50, // 账户余额
    frozenBalance: 200.00, // 冻结押金
    totalBalance: 328.50, // 总余额
    availableBalance: 128.50, // 可用余额
    currency: 'CNY',
    walletStatus: 1, // 1-正常，0-冻结
    walletId: 1001,
    lastUpdateTime: new Date().toISOString()
  };

  return {
    msg: '获取成功',
    code: 0,
    data: balanceData,
    empty: false
  };
};

// 钱包详情查询（包含余额、状态、银行卡信息等）
export const getWalletDetail = () => {
  const walletDetail = {
    walletId: 1001,
    userId: 1,
    balance: 128.50,
    frozenBalance: 200.00,
    totalBalance: 328.50,
    availableBalance: 128.50,
    currency: 'CNY',
    walletStatus: 1,
    walletStatusText: '正常',
    bankCard: {
      id: 1,
      bankName: '中国农业银行',
      cardNumber: '6228******6789',
      cardHolder: '张三',
      isDefault: true,
      bindTime: '2023-02-01 14:30:00'
    },
    createTime: '2023-01-01 10:00:00',
    lastUpdateTime: new Date().toISOString(),
    totalRecharge: 5000.00,
    totalWithdraw: 200.00,
    totalConsume: 4671.50
  };

  return {
    msg: '获取成功',
    code: 0,
    data: walletDetail,
    empty: false
  };
};

// 充值申请
export const createRecharge = (data) => {
  const { amount, payMethod } = data;

  const rechargeData = {
    rechargeId: 'RECH' + Date.now().toString().slice(-10),
    amount: amount,
    payMethod: payMethod,
    status: 'pending',
    qrCode: payMethod === 'alipay' ? 'https://picsum.photos/seed/alipayqr/300/300' : 'https://picsum.photos/seed/wechatqr/300/300',
    expireTime: new Date(Date.now() + 900000).toISOString(), // 15分钟后过期
    createTime: new Date().toISOString()
  };

  return {
    msg: '充值申请已提交',
    code: 0,
    data: rechargeData,
    empty: false
  };
};

// 提现申请
export const createWithdraw = (data) => {
  const { amount, bankCardId } = data;

  const withdrawData = {
    withdrawId: 'WDRW' + Date.now().toString().slice(-10),
    amount: amount,
    bankCardId: bankCardId || 1,
    status: 'pending',
    processingFee: 2.00,
    actualAmount: amount - 2.00,
    estimateArrivalTime: new Date(Date.now() + 86400000).toISOString(), // 24小时后到账
    createTime: new Date().toISOString()
  };

  return {
    msg: '提现申请已提交',
    code: 0,
    data: withdrawData,
    empty: false
  };
};

// 提现记录查询
export const getWithdrawRecords = (params) => {
  const { page = 1, size = 10, status } = params || {};

  const records = [
    { id: 1, amount: 100.00, bankCard: '6228******6789', status: 'success', actualAmount: 98.00, createTime: '2026-03-20 10:30:00', completeTime: '2026-03-20 11:30:00' },
    { id: 2, amount: 200.00, bankCard: '6228******6789', status: 'success', actualAmount: 198.00, createTime: '2026-03-15 14:45:00', completeTime: '2026-03-15 15:45:00' },
    { id: 3, amount: 50.00, bankCard: '6228******6789', status: 'failed', actualAmount: 48.00, createTime: '2026-03-10 09:20:00', failReason: '银行卡信息错误' },
    { id: 4, amount: 300.00, bankCard: '6228******6789', status: 'pending', actualAmount: 298.00, createTime: '2026-03-01 10:10:00' },
    { id: 5, amount: 150.00, bankCard: '6228******6789', status: 'processing', actualAmount: 148.00, createTime: '2026-02-25 16:30:00' }
  ];

  // 状态筛选
  let filteredRecords = records;
  if (status) {
    filteredRecords = records.filter(record => record.status === status);
  }

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredRecords.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredRecords.length,
      size: size,
      current: page,
      pages: Math.ceil(filteredRecords.length / size)
    },
    empty: filteredRecords.length === 0
  };
};

// 充值记录查询
export const getRechargeRecords = (params) => {
  const { page = 1, size = 10, status } = params || {};

  const records = [
    { id: 1, amount: 100.00, method: 'alipay', status: 'success', createTime: '2026-03-20 10:30:00' },
    { id: 2, amount: 200.00, method: 'wechat', status: 'success', createTime: '2026-03-15 14:45:00' },
    { id: 3, amount: 50.00, method: 'alipay', status: 'failed', createTime: '2026-03-10 09:20:00' },
    { id: 4, amount: 300.00, method: 'balance', status: 'success', createTime: '2026-03-01 10:10:00' },
    { id: 5, amount: 150.00, method: 'wechat', status: 'success', createTime: '2026-02-25 16:30:00' }
  ];

  // 状态筛选
  let filteredRecords = records;
  if (status) {
    filteredRecords = records.filter(record => record.status === status);
  }

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredRecords.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredRecords.length,
      size: size,
      current: page,
      pages: Math.ceil(filteredRecords.length / size)
    },
    empty: filteredRecords.length === 0
  };
};

// 交易记录查询（包含收入和支出）
export const getTransactionRecords = (params) => {
  const { page = 1, size = 10, type = 'all', startDate, endDate } = params || {};

  const records = [
    { id: 1, type: 'income', amount: 100.00, balance: 1100.50, remark: '充值', createTime: '2026-03-20 10:30:00' },
    { id: 2, type: 'expense', amount: -50.00, balance: 1050.50, remark: '租号消费', createTime: '2026-03-19 15:20:00' },
    { id: 3, type: 'income', amount: 20.00, balance: 1070.50, remark: '退款', createTime: '2026-03-18 09:15:00' },
    { id: 4, type: 'income', amount: 200.00, balance: 1270.50, remark: '充值', createTime: '2026-03-15 14:45:00' },
    { id: 5, type: 'expense', amount: -30.00, balance: 1240.50, remark: '租号消费', createTime: '2026-03-12 19:30:00' },
    { id: 6, type: 'income', amount: 100.00, balance: 1340.50, remark: '活动奖励', createTime: '2026-03-10 11:20:00' },
    { id: 7, type: 'expense', amount: -80.00, balance: 1260.50, remark: '租号消费', createTime: '2026-03-08 16:40:00' },
    { id: 8, type: 'income', amount: 50.00, balance: 1310.50, remark: '押金返还', createTime: '2026-03-05 13:25:00' },
    { id: 9, type: 'income', amount: 300.00, balance: 1610.50, remark: '充值', createTime: '2026-03-01 10:10:00' },
    { id: 10, type: 'expense', amount: -120.00, balance: 1490.50, remark: '租号消费', createTime: '2026-02-28 18:15:00' }
  ];

  // 类型筛选
  let filteredRecords = records;
  if (type !== 'all') {
    filteredRecords = records.filter(record => record.type === type);
  }

  // 日期筛选（如果提供了日期范围）
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    filteredRecords = filteredRecords.filter(record => {
      const recordDate = new Date(record.createTime);
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    });
  }

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredRecords.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredRecords.length,
      size: size,
      current: page,
      pages: Math.ceil(filteredRecords.length / size)
    },
    empty: filteredRecords.length === 0
  };
};

// 绑定银行卡
export const bindBankCard = (data) => {
  return {
    msg: '银行卡绑定成功',
    code: 0,
    data: {
      id: 2,
      bankCardNumber: data.bankCardNumber ? data.bankCardNumber.replace(/(\d{4})\d+(\d{4})/, '$1******$2') : '',
      bankCardHolder: data.bankCardHolder,
      bankCardPhone: data.bankCardPhone ? data.bankCardPhone.replace(/(\d{3})\d+(\d{4})/, '$1****$2') : '',
      bankName: data.bankName || '中国银行',
      isDefault: true,
      bindTime: new Date().toISOString()
    },
    empty: false
  };
};

// 更换银行卡
export const changeBankCard = (data) => {
  return {
    msg: '银行卡更换成功',
    code: 0,
    data: {
      id: 1,
      bankCardNumber: data.bankCardNumber ? data.bankCardNumber.replace(/(\d{4})\d+(\d{4})/, '$1******$2') : '',
      bankCardHolder: data.bankCardHolder,
      bankCardPhone: data.bankCardPhone ? data.bankCardPhone.replace(/(\d{3})\d+(\d{4})/, '$1****$2') : '',
      bankName: data.bankName || '中国银行',
      isDefault: true,
      updateTime: new Date().toISOString()
    },
    empty: false
  };
};

// 获取当前绑定的银行卡信息
export const getBankCardInfo = () => {
  const bankCardInfo = {
    id: 1,
    bankCardNumber: '6228480012345678901',
    bankCardHolder: '张三',
    bankCardPhone: '13800138000',
    bankName: '中国农业银行',
    isDefault: true,
    bindTime: '2023-02-01 14:30:00'
  };

  return {
    msg: '获取成功',
    code: 0,
    data: bankCardInfo,
    empty: false
  };
};

// 解绑银行卡
export const unbindBankCard = () => {
  return {
    msg: '银行卡解绑成功',
    code: 0,
    data: null,
    empty: true
  };
};