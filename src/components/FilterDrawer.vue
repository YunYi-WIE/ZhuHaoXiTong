<template>
  <van-popup
    v-model:show="show"
    position="right"
    :style="{ width: '85%', height: '100%' }"
    class="filter-drawer"
    round
  >
    <div class="filter-content">
      <div class="filter-header">
        <h3>高级筛选</h3>
        <van-icon name="cross" @click="show = false" />
      </div>

      <div class="filter-body">
        <div class="filter-group">
          <div class="group-title">合计金额区间 (元，租金+押金)</div>
          <div class="price-inputs">
            <input type="number" v-model="localFilter.minTotalAmount" placeholder="最低" />
            <span class="split-line">-</span>
            <input type="number" v-model="localFilter.maxTotalAmount" placeholder="最高" />
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">哈弗币区间（与库内整数一致）</div>
          <div class="price-inputs">
            <input type="number" v-model="localFilter.minHafuCoin" placeholder="最低" />
            <span class="split-line">-</span>
            <input type="number" v-model="localFilter.maxHafuCoin" placeholder="最高" />
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">保险箱类型</div>
          <div class="tag-options">
            <span
              v-for="item in insuranceOptions"
              :key="String(item.value)"
              :class="{ active: localFilter.insurance === item.value }"
              @click="localFilter.insurance = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">体力等级</div>
          <div class="tag-options">
            <span
              v-for="item in staminaLevelOptions"
              :key="item.value"
              :class="{ active: localFilter.staminaLevel === item.value }"
              @click="localFilter.staminaLevel = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">负重</div>
          <div class="tag-options">
            <span
              v-for="item in capacityOptions"
              :key="item.value"
              :class="{ active: localFilter.carryCapacity === item.value }"
              @click="localFilter.carryCapacity = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">段位等级</div>
          <div class="tag-options">
            <span
              v-for="item in rankLevelOptions"
              :key="item.value"
              :class="{ active: localFilter.rankLevel === item.value }"
              @click="localFilter.rankLevel = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <template v-for="skinType in SKIN_TYPE_ORDER" :key="skinType">
          <div v-if="skinOptionsByType[skinType]?.length" class="filter-group">
            <div class="group-title">{{ SKIN_TYPE_LABEL[skinType] }}</div>
            <div class="tag-options">
              <span
                v-for="item in skinOptionsByType[skinType]"
                :key="item.value"
                :class="{ active: skinSelection[skinType].includes(item.value) }"
                @click="toggleSkin(skinType, item.value)"
              >
                {{ item.text }}
              </span>
            </div>
          </div>
        </template>

        <div v-if="skinsLoading" class="skin-loading-hint">皮肤列表加载中…</div>
        <div
          v-else-if="!skinsLoading && !skinGroupsLoaded"
          class="skin-loading-hint muted"
        >
          皮肤列表暂无法加载，请稍后重试
        </div>

        <div class="filter-group">
          <div class="group-title">AWM 数量</div>
          <div class="tag-options">
            <span
              v-for="item in awmCountOptions"
              :key="String(item.value)"
              :class="{ active: localFilter.awmCount === item.value }"
              @click="localFilter.awmCount = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">上号方式</div>
          <div class="tag-options">
            <span
              v-for="item in loginMethodOptions"
              :key="item.value"
              :class="{ active: localFilter.loginMethod === item.value }"
              @click="localFilter.loginMethod = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">排序字段</div>
          <div class="tag-options tag-options--wrap">
            <span
              v-for="item in sortTypeOptions"
              :key="String(item.value)"
              :class="{ active: localFilter.sortType === item.value }"
              @click="localFilter.sortType = item.value"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="filter-group">
          <div class="group-title">排序方向（可选）</div>
          <div class="tag-options">
            <span
              v-for="item in sortDescOptions"
              :key="sortDescKey(item.value)"
              :class="{ active: sortDescActive(item.value) }"
              @click="onPickSortDesc(item.value)"
            >
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>

      <div class="filter-footer van-hairline--top">
        <van-button block round class="reset-btn" @click="reset">重置</van-button>
        <van-button block round type="primary" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { showToast } from 'vant';
import { getSkinGroupList } from '@/api/goods';
import { getDefaultFilterDrawerModel } from '@/utils/goodsQuery';

/** C 端文档：皮肤类型 1-4 */
const SKIN_TYPE_ORDER = [1, 2, 3, 4];
const SKIN_TYPE_LABEL = {
  1: '特殊刀皮',
  2: '人物红皮',
  3: '武器皮肤',
  4: '人物金皮',
};

const SKIN_PROPS = {
  1: 'specialKnifeSkin',
  2: 'redCharacterSkin',
  3: 'weaponSkin',
  4: 'goldCharacterSkin',
};

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => getDefaultFilterDrawerModel(),
  },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const show = ref(false);
const skinsLoading = ref(false);
const skinGroupsLoaded = ref(false);

/** @type {Record<number, { text: string, value: number }[]>} */
const skinOptionsByType = reactive({
  1: [],
  2: [],
  3: [],
  4: [],
});

/** 与 localFilter 中四个数组同步的选取器，按类型分桶 */
const skinSelection = reactive({
  1: [],
  2: [],
  3: [],
  4: [],
});

const mergeFilters = (defaultObj, sourceObj) => {
  const result = { ...defaultObj };
  if (sourceObj) {
    Object.keys(sourceObj).forEach((key) => {
      if (sourceObj[key] !== undefined) {
        result[key] = sourceObj[key];
      }
    });
  }
  return result;
};

const localFilter = reactive(mergeFilters(getDefaultFilterDrawerModel(), props.modelValue));

function syncSkinSelectionFromFilter() {
  SKIN_TYPE_ORDER.forEach((t) => {
    const prop = SKIN_PROPS[t];
    const arr = localFilter[prop];
    skinSelection[t] = Array.isArray(arr) ? [...arr] : [];
  });
}

syncSkinSelectionFromFilter();

function normalizeSkinEntry(raw) {
  const id = raw.id ?? raw.skinId;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return null;
  const text = raw.skinName ?? raw.name ?? `皮肤 #${n}`;
  return { text, value: n };
}

function applySkinGroupsFromPayload(payload) {
  SKIN_TYPE_ORDER.forEach((t) => {
    skinOptionsByType[t] = [];
  });

  if (!payload) return;

  const pushList = (skinType, list) => {
    if (!SKIN_TYPE_LABEL[skinType] || !Array.isArray(list)) return;
    const opts = list.map(normalizeSkinEntry).filter(Boolean);
    skinOptionsByType[skinType] = opts;
  };

  if (Array.isArray(payload)) {
    payload.forEach((g) => {
      const t = parseInt(g.skinType ?? g.type ?? g.skinTypeCode, 10);
      const list = g.skins ?? g.list ?? g.items ?? g.records ?? [];
      pushList(t, list);
    });
    return;
  }

  if (typeof payload === 'object') {
    SKIN_TYPE_ORDER.forEach((t) => {
      const list = payload[t] ?? payload[String(t)];
      if (Array.isArray(list)) pushList(t, list);
    });
    if (payload.groups && Array.isArray(payload.groups)) {
      payload.groups.forEach((g) => {
        const t = parseInt(g.skinType ?? g.type, 10);
        const list = g.skins ?? g.list ?? g.items ?? [];
        pushList(t, list);
      });
    }
  }
}

async function loadSkinGroups() {
  skinsLoading.value = true;
  skinGroupsLoaded.value = false;
  try {
    const data = await getSkinGroupList();
    applySkinGroupsFromPayload(data);
    skinGroupsLoaded.value = SKIN_TYPE_ORDER.some((t) => skinOptionsByType[t].length > 0);
    if (!skinGroupsLoaded.value) {
      showToast('暂无上架皮肤数据');
    }
  } catch (e) {
    console.error(e);
    showToast(e?.message || '皮肤列表加载失败');
    skinGroupsLoaded.value = false;
  } finally {
    skinsLoading.value = false;
  }
}

onMounted(() => {
  loadSkinGroups();
});

const capacityOptions = [
  { text: '全部', value: '' },
  ...Array.from({ length: 7 }, (_, i) => ({ text: `${i + 1}级负重`, value: i + 1 })),
];

const loginMethodOptions = [
  { text: '全部', value: '' },
  { text: 'QQ账密', value: 1 },
  { text: 'QQ扫码', value: 2 },
  { text: '微信账密', value: 3 },
  { text: '微信扫码', value: 4 },
];

const insuranceOptions = [
  { text: '全部', value: '' },
  { text: '基础 1×2', value: 1 },
  { text: '进阶 2×2', value: 2 },
  { text: '高级 2×3', value: 3 },
  { text: '顶级 3×3', value: 4 },
];

const sortTypeOptions = [
  { text: '综合', value: 1 },
  { text: '合计金额', value: 2 },
  { text: '最新', value: 3 },
  { text: '哈弗币', value: 4 },
  { text: '时租', value: 5 },
  { text: 'AWM', value: 6 },
  { text: '6头', value: 7 },
  { text: '6甲', value: 8 },
  { text: '账号等级', value: 9 },
];

/** @type {{ text: string, value: '' | boolean }[]} */
const sortDescOptions = [
  { text: '默认', value: '' },
  { text: '降序', value: true },
  { text: '升序', value: false },
];

function sortDescKey(v) {
  if (v === '') return 'def';
  return v === true ? 'desc' : 'asc';
}

function sortDescActive(v) {
  const cur = localFilter.sortDesc;
  if (v === '') return cur === '' || cur === undefined || cur === null;
  return cur === v;
}

function onPickSortDesc(v) {
  localFilter.sortDesc = v === '' ? '' : v;
}

const awmCountOptions = [
  { text: '全部', value: '' },
  { text: '0', value: 0 },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '5', value: 5 },
  { text: '10+', value: 10 },
];

const staminaLevelOptions = [{ text: '全部', value: '' }].concat(
  Array.from({ length: 7 }, (_, i) => ({ text: `${i + 1}级`, value: i + 1 }))
);

const rankLevelTexts = ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '巅峰'];
const rankLevelOptions = [{ text: '全部', value: '' }].concat(
  Array.from({ length: 7 }, (_, i) => ({ text: rankLevelTexts[i], value: i + 1 }))
);

const toggleSkin = (skinType, value) => {
  const arr = skinSelection[skinType];
  const i = arr.indexOf(value);
  if (i > -1) arr.splice(i, 1);
  else arr.push(value);
  const prop = SKIN_PROPS[skinType];
  localFilter[prop] = [...arr];
};

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localFilter, getDefaultFilterDrawerModel());
    if (newVal) {
      Object.keys(newVal).forEach((key) => {
        if (newVal[key] !== undefined) {
          localFilter[key] = newVal[key];
        }
      });
    }
    syncSkinSelectionFromFilter();
  },
  { deep: true }
);

const reset = () => {
  Object.assign(localFilter, getDefaultFilterDrawerModel());
  syncSkinSelectionFromFilter();
};

const confirm = () => {
  SKIN_TYPE_ORDER.forEach((t) => {
    const prop = SKIN_PROPS[t];
    localFilter[prop] = [...skinSelection[t]];
  });
  emit('update:modelValue', { ...localFilter });
  emit('confirm', { ...localFilter });
  show.value = false;
};

defineExpose({ show });
</script>

<style scoped>
.filter-drawer { display: flex; flex-direction: column; }
.filter-content { height: 100%; display: flex; flex-direction: column; background: #fff; }
.filter-header { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f2f3f5; }
.filter-header h3 { margin: 0; font-size: 16px; font-weight: bold; }
.filter-body { flex: 1; overflow-y: auto; padding: 20px; }

.filter-group { margin-bottom: 25px; }
.group-title { font-size: 14px; color: #333; font-weight: bold; margin-bottom: 12px; }

.skin-loading-hint { font-size: 12px; color: #1989fa; margin: -10px 0 20px; }
.skin-loading-hint.muted { color: #999; }

.price-inputs { display: flex; align-items: center; gap: 10px; }
.price-inputs input { flex: 1; height: 38px; background: #f7f8fa; border: none; border-radius: 8px; padding: 0 12px; font-size: 13px; outline: none; }
.price-inputs input::placeholder { color: #999; }
.split-line { color: #ccc; }

.tag-options { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-options span { padding: 7px 16px; background: #f7f8fa; border-radius: 20px; font-size: 12px; color: #666; transition: all 0.2s; border: 1px solid transparent; }
.tag-options span.active { background: #eef5fe; color: #1989fa; font-weight: bold; border-color: #a3d0fd; }

.tag-options--wrap span { font-size: 11px; padding: 6px 12px; }

:deep(.van-field__control) { font-size: 13px; color: #1989fa; font-weight: bold; }

.filter-footer { padding: 15px 20px; display: flex; gap: 12px; background: #fff; position: sticky; bottom: 0; }
.reset-btn { background: #f2f3f5; color: #666; border: none; }
.confirm-btn { flex: 1.5; }
</style>
