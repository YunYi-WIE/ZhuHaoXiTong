<template>
  <div class="lobby-page">
    <NavBar activeMenu="lobby" class="desktop-nav-bar" />

    <van-nav-bar 
  title="租号大厅" 
  fixed 
  placeholder 
  z-index="999"
  class="mobile-nav-bar"
/>

    <div class="tutorial-bar lobby-tutorial mobile-only">
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

    <main class="lobby-container page-shell">
      <div class="mobile-search-wrap mobile-only">
        <van-search
          v-model="searchVal"
          placeholder="搜索商品标题或账号信息"
          shape="round"
          @search="onSearch"
        />
      </div>

      <van-sticky :offset-top="stickyOffset">
        <div class="filter-bar van-hairline--bottom">
          <div class="filter-item" @click="openFilterDrawer">
            <span>价格区间</span>
            <van-icon name="exchange" size="12" class="exchange-icon" />
          </div>
          <div class="filter-item senior-filter" @click="openFilterDrawer">
            <van-icon name="filter-o" />
            <span>高级筛选</span>
          </div>
        </div>
      </van-sticky>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多账号了"
          @load="onLoad"
          class="account-list-grid"
        >
          <AccountCard 
            v-for="item in accountList" 
            :key="item.id" 
            :info="item" 
            @click="goToDetail(item.id)"
            @rent="goToDetail(item.id)"
            @reserve="onReserve"
          />
        </van-list>
      </van-pull-refresh>
    </main>

    <FilterDrawer 
      ref="filterDrawerRef" 
      v-model="filter" 
      @confirm="onSearch" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import AccountCard from '@/components/AccountCard.vue';
import FilterDrawer from '@/components/FilterDrawer.vue'; // 引入新组件
import { getGoodsList } from '@/api/goods';
import { getHomeTutorialList } from '@/api/operate';
import { buildSjzAccountListParams } from '@/utils/goodsQuery';
import { extractListRecords } from '@/utils/extractRecords';
import { openCustomerService } from '@/utils/customerService';

const router = useRouter();
const route = useRoute();
const filterDrawerRef = ref(null);

const openFilterDrawer = () => {
  if (filterDrawerRef.value) {
    filterDrawerRef.value.show = true;
  } else {
    console.error('filterDrawerRef is null', filterDrawerRef.value);
  }
};

// 搜索与列表状态
const searchVal = ref('');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);

// 🚀 大厅的筛选参数对象（与FilterDrawer组件保持一致）
let filter = reactive({
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

function onReserve() {
  openCustomerService();
}

function formatHafuShort(n) {
  if (n == null || n === '') return '';
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  if (num >= 1e8) return `哈弗币约${(num / 1e8).toFixed(2)}亿`;
  if (num >= 1e4) return `哈弗币约${(num / 1e4).toFixed(1)}万`;
  return `哈弗币${num}`;
}

function buildRatioLine(item) {
  const ri = item.ratioInfo;
  if (ri != null && String(ri).trim()) return String(ri).trim().replace(/#/g, ' · ');
  const lease = item.leaseDays != null ? `${item.leaseDays}天` : '—';
  const hf = formatHafuShort(item.hafuCoin);
  return hf ? `${hf} · 租期${lease}` : `租期${lease}`;
}

const pageParams = reactive({
  current: 0, // 🚀 修复：初始为0，因为 onLoad 第一次执行会自动 +1 变成 1
  size: 10
});

const accountList = ref([]);
const stickyOffset = computed(() => window.innerWidth >= 768 ? 60 : 46);

// 核心：请求接口获取数据
const fetchGoodsList = async (isRefresh = false) => {
  try {
    const params = buildSjzAccountListParams(filter, {
      current: Math.max(1, pageParams.current),
      size: pageParams.size,
      keyword: searchVal.value || filter.keyword,
    });
    
    const res = await getGoodsList(params);
    console.log('Lobby API响应:', res);

    const records = extractListRecords(res);

    console.log('Lobby提取记录:', records.length, '条');

    // 映射API字段到AccountCard组件期望的字段（类似Home.vue的做法）
    const mappedRecords = records.map(item => {
      // 根据实际API字段进行映射
      const title = item.ratioInfo || `商家账号 ${item.accountCode || item.id}`;

      // 价格：使用rent字段
      const pricePerHour = item.rent || item.totalAmount || 0;

      // 游戏区域：根据regionAdcode转换
      const gameRegion = getRegionName(item.regionAdcode);

      // 账号等级：level字段加上"级"
      const accountLevel = item.level ? `${item.level}级` : '';

      const isFeatured = Number(item.featuredFlag) === 1;

      // 图片：使用warehouseScreenshot或其他截图
      const images = item.warehouseScreenshot || item.otherScreenshot || item.banRecordScreenshot || item.images || '';

      // 标签：使用tags字段或从其他字段生成
      const tags = item.tags || '';

      return {
        id: item.id,
        title,
        pricePerHour,
        ratioLine: buildRatioLine(item),
        // 游戏名称固定为"三角洲游戏"（根据项目实际情况）
        gameName: '三角洲游戏',
        gameRegion,
        accountLevel,
        tags,
        isFeatured,
        images,
        // 保留其他可能需要的原始字段
        _raw: item
      };
    });

    console.log('映射后的记录:', mappedRecords.length, '条');
    if (mappedRecords.length > 0) {
      console.log('第一条映射记录:', mappedRecords[0]);
    }

    if (isRefresh) {
      accountList.value = mappedRecords;
      refreshing.value = false;
    } else {
      accountList.value.push(...mappedRecords);
    }
    
    loading.value = false;
    // 如果返回数据少于请求的 pageSize，说明没有下一页了
    if (!records || records.length < pageParams.size) {
      finished.value = true;
    }
  } catch (error) {
    console.error('获取列表失败:', error);
    loading.value = false;
    refreshing.value = false;
    finished.value = true;
  }
};

// 辅助函数：根据regionAdcode获取地区名称（复制自Home.vue）
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

onMounted(async () => {
  if (route.query.q) {
    searchVal.value = route.query.q;
  }
  try {
    const tutorials = await getHomeTutorialList();
    if (Array.isArray(tutorials)) applyTutorialMap(tutorials);
  } catch {
    /* 忽略 */
  }
});

const onSearch = () => {
  pageParams.current = 0; // 重置页码
  finished.value = false;
  loading.value = true;
  fetchGoodsList(true);
};

const onRefresh = () => {
  pageParams.current = 0;
  finished.value = false;
  fetchGoodsList(true);
};

const onLoad = () => {
  pageParams.current += 1;
  fetchGoodsList();
};

const goToDetail = (id) => router.push(`/detail/${id}`);
</script>

<style scoped>
.lobby-page { min-height: 100vh; background-color: #f7f8fa; }
.lobby-container { padding-bottom: 50px; }
.mobile-search-wrap { padding: 10px 16px; background: #fff; }

/* 🚀 优化后的大厅过滤栏样式 */
.filter-bar { background: #fff; height: 46px; display: flex; align-items: center; padding: 0 12px; gap: 10px; }
.filter-item { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 13px; color: #666; background: #f7f8fa; height: 32px; border-radius: 16px; cursor: pointer; transition: all 0.2s; }
.senior-filter { color: #1989fa; font-weight: bold; background: #f0f7ff; }
.exchange-icon { transform: rotate(90deg); color: #ccc; }
.down-arrow { color: #a3d0fd; }

.account-list-grid { padding: 10px 2px; display: grid; gap: 12px; grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .account-list-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 14px 0; gap: 14px; }
  .mobile-nav-bar, .mobile-only { display: none !important; }
}

@media (min-width: 1100px) {
  .account-list-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
}
@media (max-width: 767px) { .desktop-nav-bar { display: none !important; } }

.lobby-tutorial { margin: 0 12px 8px; }
.tutorial-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}
.tutorial-bar__btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #1989fa;
  cursor: pointer;
}
.tutorial-bar__split {
  width: 1px;
  height: 16px;
  background: #ebedf0;
}
.tutorial-popup { display: flex; flex-direction: column; height: 100%; }
.tutorial-popup__head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #ebedf0;
}
.tutorial-popup__title { font-weight: 700; font-size: 16px; }
.tutorial-popup__close { font-size: 20px; color: #999; cursor: pointer; }
.tutorial-popup__body { flex: 1; overflow-y: auto; padding: 12px 16px 20px; }
.tutorial-popup__img-wrap { margin-bottom: 12px; border-radius: 8px; overflow: hidden; }
.tutorial-popup__img { width: 100%; display: block; vertical-align: top; }
.tutorial-popup__text {
  font-size: 14px;
  line-height: 1.65;
  color: #333;
  white-space: pre-wrap;
}
@media (min-width: 768px) {
  .lobby-tutorial { display: none !important; }
}
</style>