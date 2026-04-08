<template>
  <div class="home-page">
    <NavBar activeMenu="home" />

    <main class="home-content page-shell">
      <div class="tutorial-bar">
        <button type="button" class="tutorial-bar__btn" @click="openTutorial('renter')">
          <van-icon name="guide-o" />
          <span>租号教程与细则</span>
        </button>
        <span class="tutorial-bar__split" aria-hidden="true" />
        <button type="button" class="tutorial-bar__btn" @click="openTutorial('landlord')">
          <van-icon name="records-o" />
          <span>出租账号教程与细则</span>
        </button>
      </div>

      <van-popup
        v-model:show="tutorialPopup.show"
        position="bottom"
        round
        :style="{ height: '72%', display: 'flex', flexDirection: 'column' }"
        class="tutorial-popup-root"
      >
        <div class="tutorial-popup">
          <div class="tutorial-popup__head">
            <span class="tutorial-popup__title">{{ tutorialPopup.title }}</span>
            <van-icon name="cross" class="tutorial-popup__close" @click="tutorialPopup.show = false" />
          </div>
          <div class="tutorial-popup__body">
            <div v-for="(img, idx) in tutorialPopup.images" :key="idx" class="tutorial-popup__img-wrap">
              <img :src="img" alt="" class="tutorial-popup__img" @error="onTutorialImgError" />
            </div>
            <div v-if="tutorialPopup.content" class="tutorial-popup__text">{{ tutorialPopup.content }}</div>
            <van-empty v-if="!tutorialPopup.content && !tutorialPopup.images.length" description="暂无说明，请等待管理员配置" />
          </div>
        </div>
      </van-popup>

      <div class="banner-section">
        <van-skeleton v-if="bannerLoading" title :row="2" />
        <van-swipe
          v-else
          class="my-swipe"
          :autoplay="4200"
          :duration="500"
          lazy-render
          indicator-color="#ffffff"
        >
          <van-swipe-item v-for="b in bannerList" :key="String(b.id)">
            <div class="banner-card" @click="handleBannerClick(b)">
              <img
                class="banner-image"
                :src="safeBannerImage(b)"
                :alt="b?.title || '首页轮播图'"
                loading="lazy"
                @error="onBannerImgError"
              />
              <div class="banner-mask">
                <h3 class="banner-title">{{ b?.title || '官方精选推荐' }}</h3>
                <p class="banner-tip">点击查看详情</p>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="grid-nav-section">
        <div
          class="grid-item"
          v-for="nav in navList"
          :key="String(nav.id ?? nav.path ?? nav.name)"
          @click="handleNav(nav.path)"
        >
          <div class="icon-box" :style="{ background: nav.color }">
            <van-icon :name="nav.icon" />
          </div>
          <span>{{ nav.name }}</span>
        </div>
      </div>

      <div class="account-list-section">
        <div class="filter-action-bar">
          <van-tabs v-model:active="activeTab" class="custom-tabs" shrink>
            <van-tab
              v-for="tab in homeSortTabs"
              :key="String(tab.id)"
              :title="tab.title"
              :name="String(tab.id)"
            />
          </van-tabs>
          
          <van-button icon="filter-o" size="small" class="pc-filter-btn" @click="openFilterDrawer">
            高级筛选
          </van-button>
        </div>

        <div class="account-grid">
          <div v-if="loading" class="loading-wrap">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>

          <div class="account-card" v-for="item in accountList" :key="item.id" @click="goToDetail(item.id)">
            <div class="card-cover">
              <img :src="getGoodsCover(item)" alt="商品封面" />
              <div class="asset-tag">{{ item.gameName || '热门游戏' }}</div>
            </div>

            <div class="card-info">
              <h4 class="title van-multi-ellipsis--l2">{{ item.title || '未命名商品' }}</h4>
              <div class="specs-tags">
                <span v-if="item.gameRegion">{{ item.gameRegion }}</span>
                <span v-if="item.accountLevel">{{ item.accountLevel }}</span>
                <span v-if="item.isFeatured" style="color: #ff976a; background: #fff5ed;">精选</span>
              </div>
              <div class="price-line">
                <span class="price-tag">￥<b>{{ formatPrice(item.pricePerHour) }}</b>/小时</span>
                <van-button size="mini" type="primary" round>立即租号</van-button>
              </div>
            </div>
          </div>

          <div v-if="!loading && accountList.length === 0" class="empty-wrap">
            <van-empty description="暂无符合条件的商品" />
          </div>

        </div>
      </div>
    </main>

    <FilterDrawer 
      ref="filterDrawerRef" 
      v-model="filterParams" 
      @confirm="fetchFeaturedGoods" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showFailToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import FilterDrawer from '@/components/FilterDrawer.vue'; // 引入新组件
import { getGoodsList } from '@/api/goods';
import { getHomeBannerList, getHomeNavList, getHomeTutorialList, getHomeSortList } from '@/api/operate';
import { buildSjzAccountListParams } from '@/utils/goodsQuery';
import { extractListRecords } from '@/utils/extractRecords';
import logoUrl from '@/assets/logo.png'

const router = useRouter();
const filterDrawerRef = ref(null);

const openFilterDrawer = () => {
  if (filterDrawerRef.value) {
    filterDrawerRef.value.show = true;
  } else {
    console.error('filterDrawerRef is null', filterDrawerRef.value);
  }
};

/** @type {import('vue').Ref<{ id: string|number, title: string, sortType: number, sortDesc?: boolean|null }[]>} */
const homeSortTabs = ref([]);
const activeTab = ref('');

const FALLBACK_HOME_SORT = [
  { id: 'local-1', title: '资产号租赁', sortType: 1, sortDesc: null },
  { id: 'local-2', title: '账号等级', sortType: 9, sortDesc: true },
  { id: 'local-3', title: '🔥 特价', sortType: 2, sortDesc: false },
  { id: 'local-4', title: '账号交易', sortType: 5, sortDesc: true },
];

async function loadHomeSortTabs() {
  try {
    const data = await getHomeSortList();
    const list = Array.isArray(data) ? data : [];
    homeSortTabs.value = list.length ? list : FALLBACK_HOME_SORT;
  } catch {
    homeSortTabs.value = FALLBACK_HOME_SORT;
  }
  if (homeSortTabs.value.length) {
    activeTab.value = String(homeSortTabs.value[0].id);
  }
}

function applyHomeSortToFilter() {
  const opt = homeSortTabs.value.find((t) => String(t.id) === String(activeTab.value));
  if (!opt) return;
  filterParams.sortType = opt.sortType;
  if (opt.sortDesc === null || opt.sortDesc === undefined) {
    filterParams.sortDesc = '';
  } else {
    filterParams.sortDesc = opt.sortDesc;
  }
}

watch(activeTab, () => {
  if (!activeTab.value || !homeSortTabs.value.length) return;
  applyHomeSortToFilter();
  fetchFeaturedGoods();
});
const loading = ref(false);
const bannerLoading = ref(false);
const accountList = ref([]);
const bannerList = ref([]);
const navList = ref([]);
/** @type {import('vue').Ref<Record<string, { title?: string; content?: string; images?: string[] }>>} */
const tutorialsByCode = ref({ renter: null, landlord: null });
const tutorialPopup = reactive({
  show: false,
  title: '',
  content: '',
  images: [],
});

function applyTutorialMap(list) {
  const m = { renter: null, landlord: null };
  if (Array.isArray(list)) {
    for (const row of list) {
      const c = row?.code;
      if (c === 'renter' || c === 'landlord') {
        m[c] = {
          title: row.title || '',
          content: row.content || '',
          images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
        };
      }
    }
  }
  tutorialsByCode.value = m;
}

function openTutorial(code) {
  const t = tutorialsByCode.value[code];
  const defaultTitles = {
    renter: '租号教程与细则',
    landlord: '出租账号教程与细则',
  };
  tutorialPopup.title = t?.title || defaultTitles[code] || '教程说明';
  tutorialPopup.content = t?.content || '';
  tutorialPopup.images = t?.images?.length ? [...t.images] : [];
  tutorialPopup.show = true;
}

function onTutorialImgError(e) {
  if (e?.target) e.target.style.display = 'none';
}

// 🚀 首页的筛选参数对象（v-model 绑定子组件时需 let，避免编译告警）
let filterParams = reactive({
  minTotalAmount: '',
  maxTotalAmount: '',
  minHafuCoin: '',
  maxHafuCoin: '',
  insurance: '',
  carryCapacity: '',
  rankLevel: '',
  specialKnifeSkin: [],
  redCharacterSkin: [],
  weaponSkin: [],
  goldCharacterSkin: [],
  awmCount: '',
  staminaLevel: '',
  loginMethod: '',
  sortType: 1,
  sortDesc: '',
  keyword: '',
});

// 获取精选商品列表
const fetchFeaturedGoods = async () => {
  console.log('fetchFeaturedGoods called');
  loading.value = true;
  try {
    const params = buildSjzAccountListParams(filterParams, {
      current: 1,
      size: 12,
    });

    console.log('发送商品列表请求参数:', params);
    const res = await getGoodsList(params);
    console.log('商品列表API响应:', res);
    const records = extractListRecords(res);

    console.log('提取的商品记录:', records.length, '条');
    console.log('提取的记录结构:', records);

    if (records.length === 0) {
      console.warn('没有提取到商品记录');
      console.log('完整的响应对象:', JSON.stringify(res, null, 2));
    } else {
      console.log('第一条记录字段:', Object.keys(records[0]));
      console.log('第一条记录数据:', records[0]);
    }

    // 映射API字段到模板期望的字段
    const mappedRecords = records.map(item => {
      // 根据实际API字段进行映射
      const title = item.ratioInfo || `商家账号 ${item.accountCode || item.id}`;

      // 价格：使用rent字段
      const pricePerHour = item.rent || item.totalAmount || 0;

      // 游戏区域：根据regionAdcode转换
      const gameRegion = getRegionName(item.regionAdcode);

      // 账号等级：level字段加上"级"
      const accountLevel = item.level ? `${item.level}级` : '';

      // 精选标识：运营在后台「账号库」开启 featured_flag；与官方自营 officialFlag 无关
      const isFeatured = Number(item.featuredFlag) === 1;

      // 图片：使用warehouseScreenshot或其他截图
      const images = item.warehouseScreenshot || item.otherScreenshot || item.banRecordScreenshot || '';

      return {
        id: item.id,
        title,
        pricePerHour,
        gameName: '三角洲',
        gameRegion,
        accountLevel,
        isFeatured,
        images,
        // 保留原始字段以备他用
        _raw: item
      };
    });

    console.log('映射后的第一条数据:', mappedRecords[0]);
    accountList.value = mappedRecords;
  } catch (error) {
    console.error('获取商品列表失败:', error);
    showFailToast('加载商品列表失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadHomeSortTabs();
  loadHomeOperateConfig();
});

const defaultBannerFallback = () => [
  { id: 'fallback-1', title: '三角洲行动 · 租号平台', imageUrl: logoUrl, linkUrl: '/lobby' },
];

const defaultNavFallback = () => [
  { id: 'nav-1', name: '账号大厅', icon: 'shop-o', path: '/lobby', color: '#3b82f6' },
  { id: 'nav-2', name: '我的订单', icon: 'orders-o', path: '/order', color: '#10b981' },
  { id: 'nav-3', name: '钱包', icon: 'gold-coin-o', path: '/wallet', color: '#f59e0b' },
  { id: 'nav-boost', name: '代肝服务', icon: 'points', path: '/boost', color: '#ef4444' },
  { id: 'nav-4', name: '客服', icon: 'service-o', path: '/message', color: '#8b5cf6' },
];

/** 无论后台是否已配置，都保证有一个代肝总入口（页内再分哈弗币/安全箱）；会去掉旧版两个分入口 */
const boostNavPresets = () => [
  { id: 'nav-boost', name: '代肝服务', icon: 'points', path: '/boost', color: '#ef4444' },
];

function normalizeNavPath(p) {
  return String(p ?? '')
    .trim()
    .replace(/^\/*/, '/');
}

function mergeBoostNavs(list) {
  const base = Array.isArray(list) ? list.map((n) => ({ ...n })) : [];
  // 移除旧版「/boost?type=」双入口，避免与合并后的单一 /boost 重复
  const filtered = base.filter((n) => {
    const p = normalizeNavPath(n.path);
    if (p === '/boost') return true;
    return !p.startsWith('/boost?');
  });
  const paths = new Set(filtered.map((n) => normalizeNavPath(n.path)));
  const insertBeforeKefu = () => {
    const idx = filtered.findIndex(
      (n) =>
        String(n.path || '').includes('/message') ||
        String(n.name || '').includes('客服')
    );
    return idx >= 0 ? idx : filtered.length;
  };
  let pos = insertBeforeKefu();
  for (const preset of boostNavPresets()) {
    const p = normalizeNavPath(preset.path);
    if (paths.has(p)) continue;
    filtered.splice(pos, 0, { ...preset });
    paths.add(p);
    pos += 1;
  }
  return filtered;
}

const loadHomeOperateConfig = async () => {
  bannerLoading.value = true;
  try {
    const [banners, navs, tutorials] = await Promise.allSettled([
      getHomeBannerList(),
      getHomeNavList(),
      getHomeTutorialList(),
    ]);
    bannerList.value =
      banners.status === 'fulfilled' && Array.isArray(banners.value) && banners.value.length
        ? banners.value
        : defaultBannerFallback();
    let rawNav =
      navs.status === 'fulfilled' && Array.isArray(navs.value) && navs.value.length
        ? navs.value
        : defaultNavFallback();
    navList.value = mergeBoostNavs(rawNav);
    if (tutorials.status === 'fulfilled' && Array.isArray(tutorials.value)) {
      applyTutorialMap(tutorials.value);
    } else {
      applyTutorialMap([]);
    }
  } catch {
    bannerList.value = defaultBannerFallback();
    navList.value = mergeBoostNavs(defaultNavFallback());
    applyTutorialMap([]);
  } finally {
    bannerLoading.value = false;
  }
};

const handleBannerClick = (b) => {
  const url = b?.linkUrl;
  if (!url) return;
  if (/^https?:\/\//i.test(url)) {
    window.location.href = url;
    return;
  }
  router.push(url);
};

const safeBannerImage = (b) => b?.imageUrl || logoUrl;

const onBannerImgError = (e) => {
  if (!e?.target) return;
  e.target.src = logoUrl;
};

// 辅助函数：处理封面图（数据库中 images 是以逗号分隔的字符串）
const getGoodsCover = (goods) => {
  if (goods.images && typeof goods.images === 'string') {
    return goods.images.split(',')[0];
  }
  return 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281';
};

// 辅助函数：根据regionAdcode获取地区名称
const getRegionName = (adcode) => {
  // 如果adcode已经是地区名称字符串（如"国服"），直接返回
  if (typeof adcode === 'string' && !/^\d+$/.test(adcode)) {
    return adcode;
  }

  if (!adcode) return '';

  // 简单映射，可根据需要扩展
  const regionMap = {
    '110101': '北京东城',
    '120101': '天津和平',
    '310101': '上海黄浦',
    '440103': '广州荔湾',
    '440300': '深圳',
    // 可根据需要添加更多映射
  };

  return regionMap[adcode] || `地区${adcode}`;
};

// 辅助函数：格式化价格
const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00';
  return parseFloat(price).toFixed(2);
};

const handleNav = (path) => {
  if (!path) return;
  if (path === 'kefu') {
    router.push('/message');
    return;
  }
  if (/^https?:\/\//i.test(path)) {
    window.location.href = path;
    return;
  }
  router.push(path);
};
const goToDetail = (id) => router.push(`/detail/${id}`);

// navList/bannerList 均改为后端可配置（/api/operate/*），此处仅保留兜底数据生成函数
</script>

<style scoped>
.home-page { min-height: 100vh; background-color: #ffffff; }
.home-content { padding-top: 12px; padding-bottom: 12px; }

.tutorial-bar {
  display: flex;
  align-items: stretch;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8ecf4;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}
.tutorial-bar__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.tutorial-bar__btn:active {
  background: rgba(25, 137, 250, 0.08);
}
.tutorial-bar__btn .van-icon {
  font-size: 16px;
  color: #1989fa;
}
.tutorial-bar__split {
  width: 1px;
  background: #e2e8f0;
  align-self: stretch;
  flex-shrink: 0;
}

.tutorial-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 env(safe-area-inset-bottom, 0);
}
.tutorial-popup__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.tutorial-popup__title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.tutorial-popup__close {
  font-size: 20px;
  color: #94a3b8;
  padding: 4px;
}
.tutorial-popup__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 20px;
  -webkit-overflow-scrolling: touch;
}
.tutorial-popup__img-wrap {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}
.tutorial-popup__img {
  display: block;
  width: 100%;
  vertical-align: top;
}
.tutorial-popup__text {
  font-size: 14px;
  line-height: 1.65;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 宣传栏 */
.banner-section { margin-bottom: 25px; border-radius: 12px; overflow: hidden; }
.my-swipe {
  border-radius: 12px;
  overflow: hidden;
}
.my-swipe :deep(.van-swipe__indicators) {
  bottom: 10px;
}
.my-swipe :deep(.van-swipe__indicator) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.55);
}
.my-swipe :deep(.van-swipe__indicator--active) {
  width: 18px;
  border-radius: 6px;
  background: #fff;
}
.banner-card {
  position: relative;
  height: 160px;
  background: #f3f4f6;
  overflow: hidden;
}
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.banner-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.58) 100%);
}
.banner-title {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}
.banner-tip {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
}

/* 金刚区 */
.grid-nav-section { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 8px; margin-bottom: 24px; text-align: center; }
.grid-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
.icon-box { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; }
.grid-item span { font-size: 12px; color: #333; font-weight: 500; line-height: 1.2; }

/* 筛选条 */
.filter-action-bar { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 16px; }
:deep(.custom-tabs .van-tabs__nav) { background: transparent; }
:deep(.custom-tabs .van-tab--active) { font-weight: bold; color: #1989fa; }
.pc-filter-btn { border-radius: 8px; background: #f7f8fa; border: none; color: #666; width: 100px; }

/* 账号卡片 */
.account-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.account-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f0f0f0; transition: 0.3s; cursor: pointer; }
.account-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-3px); }
.card-cover { position: relative; height: 160px; background: #eee; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.asset-tag { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #ffcc00; font-size: 11px; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
.card-info { padding: 15px; }
.title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; height: 40px; }
.specs-tags { display: flex; gap: 6px; margin-bottom: 15px; flex-wrap: wrap; }
.specs-tags span { font-size: 11px; background: #f0f7ff; color: #1989fa; padding: 3px 8px; border-radius: 4px; }
.price-line { display: flex; justify-content: space-between; align-items: center; }
.price-tag { color: #ff4d4f; font-size: 12px; }
.price-tag b { font-size: 18px; font-weight: 900; }
.loading-wrap, .empty-wrap { grid-column: 1 / -1; padding: 50px 0; text-align: center; }

@media (min-width: 768px) {
  .home-content { padding-top: 24px; padding-bottom: 20px; }
  .account-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .banner-card { height: 260px; }
  .banner-mask { padding: 16px 18px; }
  .banner-title { font-size: 22px; }
  .banner-tip { font-size: 13px; }
  .grid-nav-section { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px 12px; }
  .icon-box { width: 56px; height: 56px; font-size: 28px; }
}

@media (min-width: 1100px) {
  .home-content { padding-top: 30px; padding-bottom: 24px; }
  .account-grid { grid-template-columns: repeat(3, 1fr); gap: 22px; }
  .grid-nav-section { gap: 30px 16px; }
  .icon-box { width: 64px; height: 64px; font-size: 32px; }
}
</style>