/**
 * 消息模块模拟数据
 */

// 获取消息列表
export const getMessageList = (current = 1, size = 20, type = 'system') => {
  const allMessages = {
    system: [
      { id: 1, type: 'system', title: '【重要通知】平台防骗公告', content: '近期发现有不法分子冒充客服进行诈骗，请大家不要相信任何私下交易，平台唯一官方客服在APP内。\n\n保护好您的个人财产安全！', time: '10:30', createTime: '2026-03-23 10:30:00', isRead: false },
      { id: 2, type: 'system', title: '周末狂欢！发布免手续费开启', content: '本周末（周六至周日），所有发布成功的账号租赁订单，平台免收10%服务费！快来上架你的极品号吧！', time: '昨天', createTime: '2026-03-22 14:20:00', isRead: true },
      { id: 3, type: 'system', title: '系统维护通知', content: '为提供更好的服务，平台将于3月25日凌晨2:00-4:00进行系统维护，期间将无法访问，请提前做好准备。', time: '前天', createTime: '2026-03-21 09:15:00', isRead: true },
      { id: 4, type: 'system', title: '新功能上线：账号估值', content: '平台新增账号估值功能，输入您的账号信息即可获得专业估价，快来试试吧！', time: '3天前', createTime: '2026-03-20 11:00:00', isRead: false },
      { id: 5, type: 'system', title: '安全中心升级完成', content: '为保障用户资金安全，平台安全中心已完成升级，新增异地登录提醒和设备管理功能。', time: '5天前', createTime: '2026-03-18 16:45:00', isRead: true }
    ],
    trade: [
      { id: 6, type: 'trade', title: '订单支付成功', content: '您租赁的【顶级资产200M哈弗币+全套金皮】已支付成功，卖家已发放验证码，快去上号吧！\n\n订单号：RN202603239871\n祝您游戏愉快！', time: '09:15', createTime: '2026-03-23 09:15:00', isRead: false, orderId: 1001 },
      { id: 7, type: 'trade', title: '订单即将开始', content: '您租赁的【王者荣耀V10全皮肤账号】即将开始，请做好准备及时上号，以免影响使用体验。', time: '昨天', createTime: '2026-03-22 18:30:00', isRead: true, orderId: 1002 },
      { id: 8, type: 'trade', title: '订单已完成', content: '您租赁的【原神全角色满命座账号】已使用完毕，押金100元已返还至您的账户。', time: '前天', createTime: '2026-03-21 22:15:00', isRead: true, orderId: 1003 },
      { id: 9, type: 'trade', title: '订单已取消', content: '您创建的订单【和平精英战神号】已成功取消，支付金额已原路退回。', time: '3天前', createTime: '2026-03-20 14:20:00', isRead: true, orderId: 1004 },
      { id: 10, type: 'trade', title: '新订单提醒', content: '您的商品【极品王者荣耀账号】已被用户下单，请及时处理。', time: '4天前', createTime: '2026-03-19 10:05:00', isRead: true, orderId: 1005 }
    ],
    dispute: [
      { id: 11, type: 'dispute', title: '【仲裁结果通知】您的订单已处理', content: '您发起的申诉已处理完毕，客服仲裁结果为：支持买家，全额退款。资金已原路退回至您的支付账户。\n\n如有异议，请在24小时内联系人工客服。', time: '周一', createTime: '2026-03-18 16:20:00', isRead: true, orderId: 1006 },
      { id: 12, type: 'dispute', title: '售后申请已提交', content: '买家对订单【和平精英战神号】发起了售后申请，请及时处理。', time: '上周', createTime: '2026-03-15 11:30:00', isRead: true, orderId: 1007 },
      { id: 13, type: 'dispute', title: '仲裁处理中', content: '您发起的仲裁申请已受理，客服将在24小时内处理，请耐心等待。', time: '上周', createTime: '2026-03-14 09:45:00', isRead: true, orderId: 1008 },
      { id: 14, type: 'dispute', title: '售后处理完成', content: '您的售后申请已处理完成，退款金额已到账。', time: '2周前', createTime: '2026-03-10 14:10:00', isRead: true, orderId: 1009 }
    ]
  };

  const messages = allMessages[type] || allMessages.system;

  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = messages.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: messages.length,
      size: size,
      current: current,
      pages: Math.ceil(messages.length / size)
    },
    empty: messages.length === 0
  };
};

// 获取未读消息数量
export const getUnreadCount = () => {
  return {
    msg: '获取成功',
    code: 0,
    data: {
      system: 2,
      trade: 1,
      dispute: 0,
      total: 3
    },
    empty: false
  };
};

// 标记消息为已读
export const markAsRead = (id) => {
  return {
    msg: '标记成功',
    code: 0,
    data: { id, readTime: new Date().toISOString() },
    empty: false
  };
};

// 批量标记为已读
export const batchMarkAsRead = (ids) => {
  return {
    msg: '批量标记成功',
    code: 0,
    data: { ids, readTime: new Date().toISOString() },
    empty: false
  };
};

// 删除消息
export const deleteMessage = (id) => {
  return {
    msg: '删除成功',
    code: 0,
    data: null,
    empty: true
  };
};