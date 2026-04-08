/**
 * 商品模块模拟数据 - 支持高级筛选
 */

// 生成模拟商品列表（支持高级筛选）
export const generateGoodsList = (count = 50) => {
  // 基础数据选项 - 只生成三角洲游戏账号（与高级筛选组件兼容）
  const games = ['三角洲特种部队', '三角洲行动', '三角洲：黑鹰坠落'];
  const regions = ['国服', '亚服', '欧服', '美服', '俄服', '东南亚服', '日韩服'];
  // 注意：段位等级需与FilterDrawer.vue中的rankLevelTexts保持一致（1-7）
  const rankLevelTexts = ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '巅峰'];
  // 注意：上号方式需与FilterDrawer.vue中的loginMethodOptions保持一致（1-4）
  const loginMethods = ['QQ账号', 'QQ扫码', '微信账号', '微信扫码'];

  // 筛选选项值域
  const insuranceTypes = [1, 2, 3, 4]; // 1-4: 基础安全箱到顶级安全箱
  const specialKnifeSkins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 1-10: 影锋到暗星
  const redCharacterSkins = [1, 2, 3, 4, 5, 6, 7]; // 1-7: 维什戴尔到赛伊德-转生
  const weaponSkins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 1-11: M7楼镜攻势到M250电玩高手s2
  const goldCharacterSkins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 1-10: 牧羊人-街头之星到蛊-不羁人生

  return Array.from({ length: count }, (_, index) => {
    // 随机生成多选皮肤数组（模拟用户拥有多个皮肤）
    const randomSkinCount = Math.floor(Math.random() * 3) + 1; // 1-3个皮肤
    const randomSpecialKnifeSkins = [...new Set(
      Array.from({ length: randomSkinCount }, () =>
        specialKnifeSkins[Math.floor(Math.random() * specialKnifeSkins.length)]
      )
    )];

    const randomRedCharacterSkins = [...new Set(
      Array.from({ length: randomSkinCount }, () =>
        redCharacterSkins[Math.floor(Math.random() * redCharacterSkins.length)]
      )
    )];

    const randomWeaponSkins = [...new Set(
      Array.from({ length: Math.min(randomSkinCount, 4) }, () =>
        weaponSkins[Math.floor(Math.random() * weaponSkins.length)]
      )
    )];

    const randomGoldCharacterSkins = [...new Set(
      Array.from({ length: randomSkinCount }, () =>
        goldCharacterSkins[Math.floor(Math.random() * goldCharacterSkins.length)]
      )
    )];

    // 基础属性 - 三角洲游戏专用（与高级筛选组件兼容）
    const gameIndex = index % games.length;
    const gameName = games[gameIndex];
    const rankLevel = (index % 7) + 1; // 1-7段位等级（与筛选组件一致）
    const staminaLevel = (index % 7) + 1; // 1-7体力等级（与筛选组件一致）
    const carryCapacityLevel = (index % 7) + 1; // 1-7负重等级（与筛选组件一致）
    const loginMethod = (index % 4) + 1; // 1-4上号方式（与筛选组件一致）
    const insuranceType = insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)];

    // AWM子弹数量（0-150）
    const awmCount = Math.floor(Math.random() * 151);

    // 哈弗币数量（100M = 100,000,000）
    const harvardCoinOptions = [
      { type: 'below-100M', min: 10000000, max: 99999999 },   // 1000万-9999万
      { type: '100M-200M', min: 100000000, max: 199999999 }, // 1亿-1.99亿
      { type: 'custom', min: 200000000, max: 500000000 }     // 2亿-5亿
    ];
    const harvardCoinOption = harvardCoinOptions[Math.floor(Math.random() * harvardCoinOptions.length)];
    const hafuCoin = Math.floor(Math.random() * (harvardCoinOption.max - harvardCoinOption.min + 1)) + harvardCoinOption.min;

    // 价格相关
    const pricePerHour = parseFloat((10 + Math.random() * 90).toFixed(2)); // 10-100元/小时
    const totalAmount = parseFloat((pricePerHour * (5 + Math.random() * 20)).toFixed(2)); // 基于时租价计算总价
    const deposit = Math.floor(totalAmount * 0.5); // 押金为总价50%
    const rent = Math.floor(pricePerHour * 0.8); // 租金为时租价80%

    // 生成时间（递减，越新的账号index越小）
    const now = Date.now();
    const createdAt = new Date(now - index * 3600000).toISOString(); // 每间隔1小时
    const updatedAt = new Date(now - index * 1800000).toISOString(); // 每间隔0.5小时

    return {
      id: index + 1,
      accountCode: `ACC${10000 + index}`,
      title: `${gameName}${index % 3 === 0 ? '极品' : index % 3 === 1 ? '豪华' : '精品'}账号 - ${rankLevelTexts[rankLevel - 1]}段位`,
      gameName: gameName,
      gameRegion: regions[index % regions.length],
      pricePerHour: pricePerHour,
      totalAmount: totalAmount,
      accountLevel: `${20 + (index % 80)}级`,
      rankLevel: rankLevel,
      staminaLevel: staminaLevel,
      carryCapacityLevel: carryCapacityLevel, // 负重等级 (1-10)
      carryCapacity: 100 + (carryCapacityLevel * 100) + (index % 50), // 基于负重等级计算容量
      kd: parseFloat((1.0 + Math.random() * 4.0).toFixed(1)), // 1.0-5.0 KD
      rent: rent,
      deposit: deposit,
      loginMethod: loginMethod,
      loginMethodText: loginMethods[loginMethod - 1],
      leaseDays: 7 + (index % 30), // 7-37天租期
      images: `https://picsum.photos/seed/goods${index + 1}/300/200,https://picsum.photos/seed/goods${index + 2}/300/200,https://picsum.photos/seed/goods${index + 3}/300/200`,
      isFeatured: index % 7 === 0, // 每7个有一个是精选
      tags: index % 4 === 0 ? '热门,推荐' : index % 4 === 1 ? '特价,限时' : index % 4 === 2 ? '新上架,高胜率' : '免押金,急速',
      status: 1, // 1-上架中
      createdAt: createdAt,
      updatedAt: updatedAt,

      // 高级筛选字段
      hafuCoin: hafuCoin, // 哈弗币数量
      insurance: insuranceType, // 保险类型 (1-4)
      awmCount: awmCount, // AWM子弹数量 (0-150)
      specialSkinId: randomSpecialKnifeSkins.length > 0 ? randomSpecialKnifeSkins[0] : 0, // 主特殊刀皮ID（向后兼容）

      // 新增多选皮肤字段（用于高级筛选）
      specialKnifeSkins: randomSpecialKnifeSkins, // 特殊刀皮数组
      redCharacterSkins: randomRedCharacterSkins, // 人物红皮数组
      weaponSkins: randomWeaponSkins, // 武器皮肤数组
      goldCharacterSkins: randomGoldCharacterSkins, // 人物金皮数组

      // 其他扩展字段 - 三角洲游戏专用
      description: `此账号为${gameName}${regions[index % regions.length]}的精英账号，拥有${rankLevelTexts[rankLevel - 1]}段位，KD${parseFloat((1.0 + Math.random() * 4.0).toFixed(1))}，${staminaLevel}级体力，${carryCapacityLevel}级负重。装备精良，战绩优异，账号安全可靠，欢迎租赁！`,
      winRate: parseFloat((45 + Math.random() * 45).toFixed(1)), // 胜率45%-90%
      matchCount: 200 + (index % 1800), // 对局数200-2000
      friendCount: 30 + (index % 170), // 战友数30-200
      lastOnline: new Date(now - (index % 5) * 86400000).toISOString(), // 最近在线时间
      // 三角洲游戏特有字段
      missionCompleted: 50 + (index % 950), // 完成任务数50-1000
      headshotRate: parseFloat((20 + Math.random() * 60).toFixed(1)), // 爆头率20%-80%
      favoriteWeapon: ['M4A1', 'AK-47', 'AWP', 'M24', 'SCAR-L', 'Vector', 'MP5'][index % 7], // 常用武器
      playTime: parseFloat((100 + Math.random() * 900).toFixed(1)), // 游戏时长100-1000小时
    };
  });
};

// 商品列表数据（支持高级筛选）
export const goodsList = (current = 1, size = 12, filters = {}) => {
  const allGoods = generateGoodsList(100); // 生成100个商品用于更好的筛选测试

  // 应用筛选条件
  let filteredGoods = [...allGoods];

  // 关键词筛选
  if (filters.keyword) {
    filteredGoods = filteredGoods.filter(item =>
      item.title.includes(filters.keyword) ||
      item.accountCode.includes(filters.keyword) ||
      item.description.includes(filters.keyword)
    );
  }

  // 游戏名称筛选
  if (filters.gameName) {
    filteredGoods = filteredGoods.filter(item =>
      item.gameName === filters.gameName
    );
  }

  // 价格区间筛选
  if (filters.minTotalAmount !== undefined && filters.minTotalAmount !== '') {
    filteredGoods = filteredGoods.filter(item =>
      item.totalAmount >= parseFloat(filters.minTotalAmount)
    );
  }

  if (filters.maxTotalAmount !== undefined && filters.maxTotalAmount !== '') {
    filteredGoods = filteredGoods.filter(item =>
      item.totalAmount <= parseFloat(filters.maxTotalAmount)
    );
  }

  // 保险类型筛选
  if (filters.insuranceType !== undefined && filters.insuranceType !== '') {
    const insuranceValue = parseInt(filters.insuranceType);
    if (!isNaN(insuranceValue)) {
      filteredGoods = filteredGoods.filter(item =>
        item.insurance === insuranceValue
      );
    }
  }

  // 哈弗币数量筛选
  if (filters.harvardCoinType !== undefined && filters.harvardCoinType !== '') {
    if (filters.harvardCoinType === 'below-100M') {
      filteredGoods = filteredGoods.filter(item => item.hafuCoin < 100000000);
    } else if (filters.harvardCoinType === '100M-200M') {
      filteredGoods = filteredGoods.filter(item => item.hafuCoin >= 100000000 && item.hafuCoin <= 199999999);
    } else if (filters.harvardCoinType === 'custom') {
      // 自定义区间筛选
      const min = filters.harvardCoinMin ? parseInt(filters.harvardCoinMin) : 0;
      const max = filters.harvardCoinMax ? parseInt(filters.harvardCoinMax) : Infinity;
      filteredGoods = filteredGoods.filter(item => item.hafuCoin >= min && item.hafuCoin <= max);
    }
  }

  // AWM子弹数量范围筛选
  if (filters.awmCount !== undefined && filters.awmCount !== '') {
    if (filters.awmCount === '0-50') {
      filteredGoods = filteredGoods.filter(item => item.awmCount >= 0 && item.awmCount <= 50);
    } else if (filters.awmCount === '50-100') {
      filteredGoods = filteredGoods.filter(item => item.awmCount >= 50 && item.awmCount <= 100);
    } else if (filters.awmCount === '>100') {
      filteredGoods = filteredGoods.filter(item => item.awmCount > 100);
    } else {
      // 如果是数字，精确匹配
      const awmValue = parseInt(filters.awmCount);
      if (!isNaN(awmValue)) {
        filteredGoods = filteredGoods.filter(item => item.awmCount === awmValue);
      }
    }
  }

  // 特殊刀皮筛选（多选）- 支持数组和逗号分隔字符串
  if (filters.specialKnifeSkin) {
    let skinValues = [];
    if (Array.isArray(filters.specialKnifeSkin)) {
      skinValues = filters.specialKnifeSkin.map(v => v.toString());
    } else if (typeof filters.specialKnifeSkin === 'string') {
      skinValues = filters.specialKnifeSkin.split(',').map(v => v.trim()).filter(v => v);
    }

    if (skinValues.length > 0) {
      filteredGoods = filteredGoods.filter(item =>
        item.specialKnifeSkins.some(skin => skinValues.includes(skin.toString()))
      );
    }
  }

  // 人物红皮筛选（多选）- 支持数组和逗号分隔字符串
  if (filters.redCharacterSkin) {
    let skinValues = [];
    if (Array.isArray(filters.redCharacterSkin)) {
      skinValues = filters.redCharacterSkin.map(v => v.toString());
    } else if (typeof filters.redCharacterSkin === 'string') {
      skinValues = filters.redCharacterSkin.split(',').map(v => v.trim()).filter(v => v);
    }

    if (skinValues.length > 0) {
      filteredGoods = filteredGoods.filter(item =>
        item.redCharacterSkins.some(skin => skinValues.includes(skin.toString()))
      );
    }
  }

  // 武器皮肤筛选（多选）- 支持数组和逗号分隔字符串
  if (filters.weaponSkin) {
    let skinValues = [];
    if (Array.isArray(filters.weaponSkin)) {
      skinValues = filters.weaponSkin.map(v => v.toString());
    } else if (typeof filters.weaponSkin === 'string') {
      skinValues = filters.weaponSkin.split(',').map(v => v.trim()).filter(v => v);
    }

    if (skinValues.length > 0) {
      filteredGoods = filteredGoods.filter(item =>
        item.weaponSkins.some(skin => skinValues.includes(skin.toString()))
      );
    }
  }

  // 人物金皮筛选（多选）- 支持数组和逗号分隔字符串
  if (filters.goldCharacterSkin) {
    let skinValues = [];
    if (Array.isArray(filters.goldCharacterSkin)) {
      skinValues = filters.goldCharacterSkin.map(v => v.toString());
    } else if (typeof filters.goldCharacterSkin === 'string') {
      skinValues = filters.goldCharacterSkin.split(',').map(v => v.trim()).filter(v => v);
    }

    if (skinValues.length > 0) {
      filteredGoods = filteredGoods.filter(item =>
        item.goldCharacterSkins.some(skin => skinValues.includes(skin.toString()))
      );
    }
  }

  // 上号方式筛选
  if (filters.loginMethod !== undefined && filters.loginMethod !== '') {
    const loginMethodValue = parseInt(filters.loginMethod);
    if (!isNaN(loginMethodValue)) {
      filteredGoods = filteredGoods.filter(item =>
        item.loginMethod === loginMethodValue
      );
    }
  }

  // 体力等级筛选
  if (filters.staminaLevel !== undefined && filters.staminaLevel !== '') {
    const staminaValue = parseInt(filters.staminaLevel);
    if (!isNaN(staminaValue)) {
      filteredGoods = filteredGoods.filter(item =>
        item.staminaLevel === staminaValue
      );
    }
  }

  // 段位等级筛选
  if (filters.rankLevel !== undefined && filters.rankLevel !== '') {
    const rankValue = parseInt(filters.rankLevel);
    if (!isNaN(rankValue)) {
      filteredGoods = filteredGoods.filter(item =>
        item.rankLevel === rankValue
      );
    }
  }

  // 负重（背包容量等级）筛选 - 三角洲游戏专用
  if (filters.carryCapacity !== undefined && filters.carryCapacity !== '') {
    const capacityValue = parseInt(filters.carryCapacity);
    if (!isNaN(capacityValue)) {
      filteredGoods = filteredGoods.filter(item => {
        // 三角洲游戏负重等级直接对应carryCapacityLevel字段
        const capacityLevel = item.carryCapacityLevel || Math.floor((item.carryCapacity - 100) / 100) + 1;
        return capacityLevel === capacityValue;
      });
    }
  }

  // 应用排序
  if (filters.sortType === 2) {
    // 价格最低
    filteredGoods.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else if (filters.sortType === 3) {
    // 最新上架
    filteredGoods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (filters.sortType === 4) {
    // KD最高
    filteredGoods.sort((a, b) => b.kd - a.kd);
  } else if (filters.sortType === 5) {
    // 胜率最高
    filteredGoods.sort((a, b) => b.winRate - a.winRate);
  } else if (filters.sortType === 9) {
    const desc = filters.sortDesc !== false;
    filteredGoods.sort((a, b) => {
      const va = a.level ?? 0;
      const vb = b.level ?? 0;
      return desc ? vb - va : va - vb;
    });
  }

  // 分页
  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredGoods.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredGoods.length,
      size: size,
      current: current,
      pages: Math.ceil(filteredGoods.length / size)
    },
    empty: filteredGoods.length === 0
  };
};

// 商品详情数据
export const goodsDetail = (id) => {
  const allGoods = generateGoodsList(100);
  const goods = allGoods.find(item => item.id === parseInt(id)) || allGoods[0];

  // 添加更多详情字段
  const detail = {
    ...goods,
    // 确保图片字段格式正确（字符串转数组）
    imageList: goods.images ? goods.images.split(',') : [],
    // 扩展详情信息
    warehouseScreenshot: 'https://picsum.photos/seed/warehouse/600/400',
    banRecordScreenshot: 'https://picsum.photos/seed/banrecord/600/400',
    otherScreenshot: 'https://picsum.photos/seed/other/600/400',
    equipmentScreenshot: 'https://picsum.photos/seed/equipment/600/400',
    // 账号详细信息 - 三角洲游戏专用
    remark: '此账号为三角洲游戏精英账号，拥有丰富战斗经验和精良装备。账号经过平台审核，信息真实可靠，适合追求高游戏体验的玩家。',
    ratioInfo: '鼠标灵敏度: 800DPI, 游戏灵敏度: 35, 压枪设置: 自定义宏, 键位设置: 专业FPS配置',
    regionAdcode: '440300', // 深圳地区编码
    serverName: goods.gameRegion,
    // 安全信息
    isRealAuth: true,
    authLevel: 4,
    safeScore: 98,
    // 租号规则 - 三角洲游戏专用
    rentRules: [
      '租赁期间严禁使用外挂、作弊软件',
      '禁止恶意破坏账号装备、消耗游戏货币',
      '禁止修改账号绑定信息、删除战友',
      '如遇账号登录问题，请立即联系客服',
      '租赁期间请遵守游戏规则，文明游戏',
      '租赁到期后请及时归还，超时将收取额外费用'
    ],
    // 历史记录
    rentCount: Math.floor(Math.random() * 60) + 20,
    avgRating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
    lastRentTime: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000).toISOString(),
    // 三角洲游戏特有信息
    eliteMissionCompleted: goods.missionCompleted || Math.floor(Math.random() * 100) + 50,
    headshotRate: goods.headshotRate || parseFloat((20 + Math.random() * 60).toFixed(1)),
    favoriteWeapon: goods.favoriteWeapon || ['M4A1', 'AK-47', 'AWP', 'M24', 'SCAR-L', 'Vector', 'MP5'][Math.floor(Math.random() * 7)],
    totalPlayTime: goods.playTime || parseFloat((100 + Math.random() * 900).toFixed(1)),
    battlePassLevel: Math.floor(Math.random() * 100) + 1, // 战斗通行证等级
    specialAchievements: ['百杀成就', '爆头大师', '任务专家', '团队领袖', '精准射手'][Math.floor(Math.random() * 5)],
    // 时间字段别名（向后兼容）
    createTime: goods.createdAt,
    updateTime: goods.updatedAt
  };

  return {
    msg: '获取成功',
    code: 0,
    data: detail,
    empty: false
  };
};

// 我的商品列表（卖家视角）
export const myGoodsList = (current = 1, size = 10, status = 1) => {
  const allGoods = generateGoodsList(25);
  const myGoods = allGoods.map((item, index) => ({
    ...item,
    // 卖家特定字段
    status: status || (index % 4 === 0 ? 1 : index % 4 === 1 ? 2 : index % 4 === 2 ? 3 : 4), // 1-上架 2-下架 3-审核中 4-已出租
    views: 100 + index * 75,
    favorites: Math.floor((100 + index * 75) * 0.1), // 收藏数约为浏览量的10%
    orders: index % 8,
    completedOrders: Math.floor((index % 8) * 0.7),
    earnings: parseFloat((index * 38.5).toFixed(2)),
    totalEarnings: parseFloat((index * 38.5 * 1.3).toFixed(2)),
    // 管理信息
    lastEditTime: new Date(Date.now() - index * 7200000).toISOString(), // 每2小时
    auditStatus: index % 5 === 0 ? 2 : 1, // 1-审核通过 2-待审核
    auditRemark: index % 5 === 0 ? '请补充更多账号截图' : '审核通过',
    // 租约信息
    currentRent: index % 10 === 0 ? {
      renter: '用户' + (1000 + index),
      rentStart: new Date(Date.now() - 86400000).toISOString(),
      rentEnd: new Date(Date.now() + 86400000 * 3).toISOString(),
      hours: 24
    } : null,
    // 统计信息 - 三角洲游戏专用
    avgRentTime: parseFloat((8 + Math.random() * 40).toFixed(1)), // 平均租赁时长8-48小时
    renewalRate: parseFloat((35 + Math.random() * 45).toFixed(1)), // 续租率35%-80%
    // 三角洲游戏卖家特有信息
    weaponMastery: parseFloat((60 + Math.random() * 35).toFixed(1)), // 武器精通度60%-95%
    missionSuccessRate: parseFloat((70 + Math.random() * 25).toFixed(1)), // 任务成功率70%-95%
    recommendedFor: ['新手入门', '中级提升', '高手冲榜', '团队作战', '单人任务'][index % 5] // 推荐用途
  }));

  // 根据状态筛选
  let filteredGoods = myGoods;
  if (status === 1) {
    filteredGoods = myGoods.filter(item => item.status === 1); // 上架中
  } else if (status === 2) {
    filteredGoods = myGoods.filter(item => item.status === 2); // 已下架
  } else if (status === 3) {
    filteredGoods = myGoods.filter(item => item.status === 3); // 审核中
  } else if (status === 4) {
    filteredGoods = myGoods.filter(item => item.status === 4); // 已出租
  }

  const startIndex = (current - 1) * size;
  const endIndex = startIndex + size;
  const pageData = filteredGoods.slice(startIndex, endIndex);

  return {
    msg: '获取成功',
    code: 0,
    data: {
      records: pageData,
      total: filteredGoods.length,
      size: size,
      current: current,
      pages: Math.ceil(filteredGoods.length / size)
    },
    empty: filteredGoods.length === 0
  };
};