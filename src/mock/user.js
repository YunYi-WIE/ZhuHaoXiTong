/**
 * 用户模块模拟数据
 */

// 获取用户基本信息
export const getUserInfo = () => {
  // 检查localStorage中是否有认证状态，模拟后端状态持久化
  const hasRealAuth = localStorage.getItem('mock_real_auth') === 'true';

  const userInfo = {
    id: 1,
    phone: '13800138000',
    username: '测试用户',
    avatar: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
    balance: 1000.50,
    totalBalance: 1250.80,
    frozenBalance: 250.30,
    isRealAuth: hasRealAuth,
    realName: hasRealAuth ? '张三' : '',
    idCard: hasRealAuth ? '110101199001011234' : '',
    gender: 1,
    birthday: '1990-01-01',
    createTime: '2023-01-01 10:00:00',
    lastLoginTime: '2026-03-22 15:30:45',
    level: 3,
    levelName: '黄金会员',
    experience: 450,
    nextLevelExperience: 1000,
    orderCount: 15,
    totalSpent: 3250.00
  };

  return {
    msg: '获取成功',
    code: 0,
    data: userInfo,
    empty: false
  };
};

// 修改用户基本信息
export const updateUserInfo = (data) => {
  return {
    msg: '修改成功',
    code: 0,
    data: {
      ...data,
      updateTime: new Date().toISOString()
    },
    empty: false
  };
};

// 查询当前用户实名信息
export const getUserRealInfo = () => {
  const realInfo = {
    id: 1,
    userId: 1,
    realName: '张三',
    idCard: '110101199001011234',
    phone: '13800138000',
    bankCard: '6228480012345678901',
    bankName: '中国农业银行',
    status: 1, // 1-已认证
    auditTime: '2023-02-01 14:30:00',
    createTime: '2023-01-15 10:00:00'
  };

  return {
    msg: '获取成功',
    code: 0,
    data: realInfo,
    empty: false
  };
};

// 新增实名信息
export const createUserRealInfo = (data) => {
  // 模拟保存认证状态到localStorage
  localStorage.setItem('mock_real_auth', 'true');
  localStorage.setItem('mock_real_info', JSON.stringify(data));

  return {
    msg: '实名认证提交成功，请等待审核',
    code: 0,
    data: {
      id: 2,
      ...data,
      status: 1, // 1-已认证（模拟立即通过）
      createTime: new Date().toISOString(),
      auditTime: new Date().toISOString()
    },
    empty: false
  };
};

// 修改实名信息
export const updateUserRealInfo = (id, data) => {
  // 更新localStorage中的认证信息
  localStorage.setItem('mock_real_info', JSON.stringify(data));

  return {
    msg: '修改成功',
    code: 0,
    data: {
      id: id,
      ...data,
      updateTime: new Date().toISOString()
    },
    empty: false
  };
};

// 删除实名信息
export const deleteUserRealInfo = (id) => {
  return {
    msg: '删除成功',
    code: 0,
    data: null,
    empty: true
  };
};

// 激活钱包
export const activateWallet = (id, data) => {
  return {
    msg: '钱包激活成功',
    code: 0,
    data: {
      walletId: 1001,
      walletStatus: 1,
      activateTime: new Date().toISOString(),
      ...data
    },
    empty: false
  };
};

// 获取用户余额明细
export const getBalanceRecords = (current = 1, size = 10) => {
  const records = [
    { id: 1, type: 1, amount: 100.00, balance: 1100.50, remark: '充值', createTime: '2026-03-20 10:30:00' },
    { id: 2, type: 2, amount: -50.00, balance: 1050.50, remark: '租号消费', createTime: '2026-03-19 15:20:00' },
    { id: 3, type: 3, amount: 20.00, balance: 1070.50, remark: '退款', createTime: '2026-03-18 09:15:00' },
    { id: 4, type: 1, amount: 200.00, balance: 1270.50, remark: '充值', createTime: '2026-03-15 14:45:00' },
    { id: 5, type: 2, amount: -30.00, balance: 1240.50, remark: '租号消费', createTime: '2026-03-12 19:30:00' },
    { id: 6, type: 4, amount: 100.00, balance: 1340.50, remark: '活动奖励', createTime: '2026-03-10 11:20:00' },
    { id: 7, type: 2, amount: -80.00, balance: 1260.50, remark: '租号消费', createTime: '2026-03-08 16:40:00' },
    { id: 8, type: 3, amount: 50.00, balance: 1310.50, remark: '押金返还', createTime: '2026-03-05 13:25:00' },
    { id: 9, type: 1, amount: 300.00, balance: 1610.50, remark: '充值', createTime: '2026-03-01 10:10:00' },
    { id: 10, type: 2, amount: -120.00, balance: 1490.50, remark: '租号消费', createTime: '2026-02-28 18:15:00' }
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

// 获取用户优惠券
export const getUserCoupons = (current = 1, size = 10, status = 1) => {
  const coupons = [
    { id: 1, name: '新用户专享券', type: 1, discount: 10, minAmount: 50, expireTime: '2026-04-01 23:59:59', status: 1 },
    { id: 2, name: '满减券', type: 2, discount: 20, minAmount: 100, expireTime: '2026-03-30 23:59:59', status: 1 },
    { id: 3, name: '折扣券', type: 3, discount: 0.8, minAmount: 200, expireTime: '2026-03-25 23:59:59', status: 1 },
    { id: 4, name: '体验券', type: 4, discount: 0, minAmount: 0, expireTime: '2026-03-20 23:59:59', status: 2 },
    { id: 5, name: '节日专享券', type: 1, discount: 15, minAmount: 80, expireTime: '2026-03-15 23:59:59', status: 3 }
  ];

  // 按状态筛选
  const filteredCoupons = coupons.filter(coupon => {
    if (status === 1) return coupon.status === 1; // 未使用
    if (status === 2) return coupon.status === 2; // 已使用
    if (status === 3) return coupon.status === 3; // 已过期
    return true;
  });

  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredCoupons.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredCoupons.length,
      size: size,
      current: current,
      pages: Math.ceil(filteredCoupons.length / size)
    },
    empty: filteredCoupons.length === 0
  };
};