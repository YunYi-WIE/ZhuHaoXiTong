/**
 * 分类模块模拟数据
 */

// 游戏分类列表
export const getCategoryList = () => {
  const categories = [
    { id: 1, name: '和平精英', icon: 'https://picsum.photos/seed/game1/50/50', weight: 100, status: 1, createTime: '2023-01-01 00:00:00' },
    { id: 2, name: '王者荣耀', icon: 'https://picsum.photos/seed/game2/50/50', weight: 95, status: 1, createTime: '2023-01-02 00:00:00' },
    { id: 3, name: '原神', icon: 'https://picsum.photos/seed/game3/50/50', weight: 90, status: 1, createTime: '2023-01-03 00:00:00' },
    { id: 4, name: '英雄联盟', icon: 'https://picsum.photos/seed/game4/50/50', weight: 85, status: 1, createTime: '2023-01-04 00:00:00' },
    { id: 5, name: '穿越火线', icon: 'https://picsum.photos/seed/game5/50/50', weight: 80, status: 1, createTime: '2023-01-05 00:00:00' },
    { id: 6, name: '永劫无间', icon: 'https://picsum.photos/seed/game6/50/50', weight: 75, status: 1, createTime: '2023-01-06 00:00:00' },
    { id: 7, name: '金铲铲之战', icon: 'https://picsum.photos/seed/game7/50/50', weight: 70, status: 1, createTime: '2023-01-07 00:00:00' },
    { id: 8, name: 'PUBG', icon: 'https://picsum.photos/seed/game8/50/50', weight: 65, status: 1, createTime: '2023-01-08 00:00:00' },
    { id: 9, name: '光遇', icon: 'https://picsum.photos/seed/game9/50/50', weight: 60, status: 1, createTime: '2023-01-09 00:00:00' },
    { id: 10, name: '蛋仔派对', icon: 'https://picsum.photos/seed/game10/50/50', weight: 55, status: 1, createTime: '2023-01-10 00:00:00' }
  ];

  return {
    msg: '获取成功',
    code: 0,
    data: categories,
    empty: false
  };
};

// 热门分类（带统计信息）
export const getHotCategories = () => {
  const hotCategories = [
    { id: 1, name: '和平精英', icon: 'https://picsum.photos/seed/game1/50/50', onlineCount: 12543, goodsCount: 342 },
    { id: 2, name: '王者荣耀', icon: 'https://picsum.photos/seed/game2/50/50', onlineCount: 18765, goodsCount: 512 },
    { id: 3, name: '原神', icon: 'https://picsum.photos/seed/game3/50/50', onlineCount: 9342, goodsCount: 287 },
    { id: 4, name: '英雄联盟', icon: 'https://picsum.photos/seed/game4/50/50', onlineCount: 7564, goodsCount: 198 },
    { id: 5, name: '穿越火线', icon: 'https://picsum.photos/seed/game5/50/50', onlineCount: 6543, goodsCount: 167 }
  ];

  return {
    msg: '获取成功',
    code: 0,
    data: hotCategories,
    empty: false
  };
};

// 分类筛选条件
export const getCategoryFilters = (categoryId) => {
  const filters = {
    regions: [
      { id: 1, name: '微信区' },
      { id: 2, name: 'QQ区' },
      { id: 3, name: '国际服' },
      { id: 4, name: '体验服' }
    ],
    levels: [
      { id: 1, name: '青铜' },
      { id: 2, name: '白银' },
      { id: 3, name: '黄金' },
      { id: 4, name: '铂金' },
      { id: 5, name: '钻石' },
      { id: 6, name: '星耀' },
      { id: 7, name: '王者' }
    ],
    priceRanges: [
      { id: 1, name: '0-50元' },
      { id: 2, name: '50-100元' },
      { id: 3, name: '100-200元' },
      { id: 4, name: '200元以上' }
    ]
  };

  return {
    msg: '获取成功',
    code: 0,
    data: filters,
    empty: false
  };
};