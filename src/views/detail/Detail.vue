<template>
  <div class="detail-page">
    <NavBar class="desktop-only" />

    <van-nav-bar
      title="账号详情"
      left-arrow
      class="detail-page__nav mobile-only"
      fixed
      placeholder
      z-index="999"
      @click-left="router.back()"
    />

    <main class="detail-page__main page-shell">
      <div class="detail-page__crumb desktop-only">
        <span class="link" @click="router.push('/')">首页</span>
        <van-icon name="arrow" class="sep" />
        <span class="link" @click="router.push('/lobby')">租号大厅</span>
        <van-icon name="arrow" class="sep" />
        <span class="current">详情</span>
      </div>

      <section class="detail-page__hero global-card shadow-sm">
        <div class="detail-page__gallery">
          <van-swipe
            class="detail-page__swipe"
            :autoplay="imageList.length > 1 ? 3500 : 0"
            indicator-color="#1989fa"
            :show-indicators="imageList.length > 1"
          >
            <van-swipe-item v-if="!imageList.length">
              <van-image
                :src="PLACEHOLDER_GALLERY"
                fit="cover"
                class="detail-page__swipe-img"
                @click.stop="openGalleryPreview(0)"
              />
            </van-swipe-item>
            <van-swipe-item v-for="(img, i) in imageList" :key="i">
              <van-image
                :src="img"
                fit="cover"
                class="detail-page__swipe-img"
                @click.stop="openGalleryPreview(i)"
              />
            </van-swipe-item>
          </van-swipe>
          <div class="detail-page__gallery-badges">
            <span class="pill pill--dark">{{ goods.gameName || '三角洲账号' }}</span>
            <span v-if="goods.accountCode" class="pill pill--code" @click.stop="copyCode">
              {{ goods.accountCode }}
              <van-icon name="description" class="pill__ico" />
            </span>
          </div>
        </div>

        <div class="detail-page__summary">
          <header class="detail-page__head">
            <h1 class="detail-page__title">
              <span v-if="goods.isFeatured" class="tag tag--hot">精选</span>
              <span v-if="goods.officialFlag" class="tag tag--official">官方</span>
              {{ goods.title || '加载中…' }}
            </h1>
          </header>

          <div class="price-card">
            <div class="price-card__row price-card__row--highlight">
              <div class="price-card__label">时租</div>
              <div class="price-card__value">
                ￥<strong>{{ priceHourly }}</strong><span class="unit">/小时</span>
              </div>
            </div>
            <div class="price-card__row">
              <div class="price-card__label">租金小计</div>
              <div class="price-card__value price-card__value--sub">
                ￥{{ rentSubtotal }}<span class="hint">（{{ rentHours }} 小时）</span>
              </div>
            </div>
            <div class="price-card__row">
              <div class="price-card__label">押金</div>
              <div class="price-card__value price-card__value--sub">
                {{ depositNum > 0 ? `￥${depositText}` : '免押金' }}
              </div>
            </div>
            <div class="price-card__divider" />
            <div class="price-card__row price-card__row--total">
              <div class="price-card__label">预估下单支付</div>
              <div class="price-card__value price-card__value--danger">
                ￥<strong>{{ estimatePay }}</strong>
              </div>
            </div>
            <p class="price-card__note">
              价格（本页预估）= <strong>时租 × 所选租赁时长 + 押金</strong>；下单后请以订单页为准。
            </p>
          </div>

          <div class="detail-page__duration">
            <span class="detail-page__duration-label">租赁时长</span>
            <div class="detail-page__duration-ctrl">
              <van-stepper
                v-model="rentHours"
                min="1"
                max="24"
                integer
                input-width="48px"
                button-size="30px"
              />
              <span class="detail-page__duration-unit">小时</span>
            </div>
          </div>

          <div class="detail-page__actions desktop-only">
            <van-button
              type="primary"
              round
              block
              class="detail-page__btn-main"
              @click="handleCreateOrder"
            >
              立即租赁
            </van-button>
            <van-button round block class="detail-page__btn-sub" type="warning" plain @click="openReserve">
              预约租号
            </van-button>
            <van-button round block class="detail-page__btn-sub" icon="chat-o" @click="openHelp">
              联系客服
            </van-button>
          </div>
        </div>
      </section>

      <section class="spec-card global-card shadow-sm">
        <h2 class="spec-card__title">账号信息</h2>
        <van-cell-group :border="false" class="spec-card__cells">
          <van-cell v-if="goods.accountCode" title="账号编号" :value="goods.accountCode" />
          <van-cell v-if="goods.statusText" title="账号状态" :value="goods.statusText" />
          <van-cell
            v-if="goods.auditRejectReason"
            title="驳回原因"
            :value="goods.auditRejectReason"
          />
          <van-cell title="游戏区服" :value="goods.gameRegion || '—'" />
          <van-cell v-if="goods.regionAdcode" title="地区编码" :value="String(goods.regionAdcode)" />
          <van-cell title="体力等级" :value="goods.staminaText" />
          <van-cell title="负重" :value="goods.carryText" />
          <van-cell title="排位段位" :value="goods.rankTier || '—'" />
          <van-cell title="账号等级" :value="goods.levelText != null ? goods.levelText : '—'" />
          <van-cell title="KD" :value="goods.kdText != null ? goods.kdText : '—'" />
          <van-cell title="哈弗币（参考）" :value="goods.hafuCoinText || '—'" />
          <van-cell title="保险箱" :value="goods.insuranceText || '—'" />
          <van-cell title="租期（天）" :value="goods.leaseDaysText != null ? goods.leaseDaysText : '—'" />
          <van-cell title="上号方式" :value="goods.loginMethodText" />
          <van-cell v-if="goods.awmText" title="AWM 数量" :value="goods.awmText" />
          <van-cell
            v-if="goods.sixHelmetText != null"
            title="6 头数量"
            :value="goods.sixHelmetText"
          />
          <van-cell
            v-if="goods.sixArmorText != null"
            title="6 甲数量"
            :value="goods.sixArmorText"
          />
          <van-cell
            v-if="goods.specialSkinText"
            title="关联皮肤"
            :value="goods.specialSkinText"
          />
          <van-cell
            v-if="listTotalText"
            title="资料合计(租+押)"
            :value="listTotalText"
            title-class="spec-cell-muted"
          />
        </van-cell-group>
      </section>

      <section class="tabs-card global-card shadow-sm">
        <van-tabs v-model:active="activeTab" color="#1989fa" line-width="32px" animated swipeable>
          <van-tab title="账号描述" name="desc">
            <div class="tab-body">
              <p class="tab-text">{{ goods.description || '暂无描述' }}</p>
            </div>
          </van-tab>
          <van-tab title="租赁须知" name="rules">
            <div class="tab-body">
              <div class="notice-block">
                <p class="notice-block__title"><van-icon name="warning-o" /> 严禁行为</p>
                <ul class="notice-list">
                  <li>禁止开挂；禁止毁号、盗用资产、恶意掉分。</li>
                  <li>密码异常请立即联系客服；超时未反馈可能影响售后。</li>
                  <li>租期与扣费规则以订单及平台公示为准。</li>
                </ul>
              </div>
            </div>
          </van-tab>
          <van-tab title="平台保障" name="safe">
            <div class="tab-body">
              <div class="safe-line">
                <van-icon name="shield-o" class="safe-line__ico" />
                <div>
                  <b>验号担保</b>
                  <p>账号信息经平台审核，截图与描述供参考，请以实际验号为准。</p>
                </div>
              </div>
              <div class="safe-line">
                <van-icon name="gold-coin-o" class="safe-line__ico" />
                <div>
                  <b>履约支持</b>
                  <p>租赁遇到问题可通过客服与订单纠纷渠道处理。</p>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </section>

      <section v-if="imageSections.length" class="proof-card spec-card global-card shadow-sm">
        <h2 class="spec-card__title">账号截图</h2>
        <div class="proof-card__body">
          <div v-for="(block, bi) in imageSections" :key="bi" class="proof-block">
            <h3 class="proof-block__title">{{ block.title }}</h3>
            <div class="proof-grid">
              <van-image
                v-for="(url, ui) in block.urls"
                :key="`${bi}-${ui}-${url}`"
                :src="url"
                fit="cover"
                class="proof-thumb"
                @click="openGalleryPreview(galleryIndexForUrl(url))"
              />
            </div>
          </div>
        </div>
      </section>

      <section v-if="disclaimerText" class="disclaimer-card global-card shadow-sm">
        <h2 class="spec-card__title">免责声明</h2>
        <p class="disclaimer-text">{{ disclaimerText }}</p>
      </section>
    </main>

    <van-action-bar class="mobile-only detail-page__bar" placeholder safe-area-inset-bottom>
      <div class="detail-page__bar-price">
        <span class="muted">预估</span>
        <span class="num">￥{{ estimatePay }}</span>
      </div>
      <van-action-bar-button type="warning" class="detail-page__bar-btn detail-page__bar-btn--sub" @click="openReserve">
        预约
      </van-action-bar-button>
      <van-action-bar-button type="primary" class="detail-page__bar-btn" @click="handleCreateOrder">
        租赁
      </van-action-bar-button>
    </van-action-bar>

    <van-dialog
      v-model:show="showHelp"
      title="联系客服"
      show-cancel-button
      confirm-button-color="#1989fa"
    >
      <div class="help-dialog">
        <van-image v-if="helpQr" :src="helpQr" width="160" height="160" fit="contain" />
        <p v-if="helpWx" class="help-dialog__tip">{{ helpWx }}</p>
        <p v-if="!helpQr && !helpWx" class="help-dialog__tip">暂无客服配置，请稍后在订单或消息中心联系平台。</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  showLoadingToast,
  showSuccessToast,
  showFailToast,
  showToast,
  showImagePreview,
} from 'vant';
import NavBar from '@/components/NavBar.vue';
import { getGoodsDetail } from '@/api/goods';
import { createOrder } from '@/api/order';
import { unwrapOrderPayload } from '@/utils/orderDisplay';
import { useSiteBrandingStore } from '@/stores/siteBranding';
import { openCustomerService } from '@/utils/customerService';

const router = useRouter();
const route = useRoute();
const branding = useSiteBrandingStore();

const disclaimerText = computed(() => (branding.detailDisclaimer || '').trim());
const helpQr = computed(() => (branding.customerQrUrl || '').trim());
const helpWx = computed(() => (branding.customerWechat || '').trim());

const goodsId = route.params.id;

const activeTab = ref('desc');
const showHelp = ref(false);
const rentHours = ref(2);

function openReserve() {
  openCustomerService();
}

function openHelp() {
  if (helpQr.value || helpWx.value) {
    showHelp.value = true;
    return;
  }
  openCustomerService();
}

const LOGIN_METHOD_MAP = {
  1: 'QQ 账密',
  2: 'QQ 扫码',
  3: '微信账密',
  4: '微信扫码',
};

const REGION_SAMPLES = {
  110101: '北京东城',
  120101: '天津和平',
  310101: '上海黄浦',
  440103: '广州荔湾',
  440300: '深圳',
};

const RANK_MAP = {
  1: '青铜',
  2: '白银',
  3: '黄金',
  4: '铂金',
  5: '钻石',
  6: '黑鹰',
  7: '巅峰',
};

const INSURANCE_MAP = {
  1: '基础安全箱（1×2）',
  2: '进阶安全箱（2×2）',
  3: '高级安全箱（2×3）',
  4: '顶级安全箱（3×3）',
};

const STATUS_MAP = {
  1: '未发布',
  2: '待审核',
  3: '已上架',
  4: '交易中',
  5: '审核不通过',
  6: '已禁用',
};

const REGION_ZONE = {
  310000: '微信区',
  110000: 'QQ区',
};

const goods = ref({
  id: null,
  title: '',
  gameName: '三角洲行动',
  accountCode: '',
  gameRegion: '',
  regionAdcode: '',
  statusText: '',
  auditRejectReason: '',
  staminaText: '—',
  carryText: '—',
  rankTier: '',
  levelText: null,
  kdText: null,
  leaseDaysText: null,
  hafuCoinText: '',
  insuranceText: '',
  specialSkinText: '',
  sixHelmetText: null,
  sixArmorText: null,
  loginMethodText: '—',
  awmText: '',
  rent: 0,
  deposit: 0,
  totalAmountList: null,
  description: '',
  isFeatured: false,
  officialFlag: false,
  _raw: null,
});

function collectImageUrls(raw) {
  if (!raw || typeof raw !== 'object') return [];
  const parts = [raw.banRecordScreenshot, raw.otherScreenshot, raw.warehouseScreenshot]
    .filter((x) => typeof x === 'string' && x.trim())
    .join(',');
  const list = parts.split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean);
  const seen = new Set();
  const out = [];
  list.forEach((url) => {
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  });
  return out;
}

const imageList = computed(() => collectImageUrls(goods.value._raw));

function splitRawImagesField(value) {
  if (value == null || value === '') return [];
  if (typeof value !== 'string') return [];
  return value
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 底部展示用：按审核字段分组，顺序与后台核验一致 */
const imageSections = computed(() => {
  const raw = goods.value._raw;
  if (!raw || typeof raw !== 'object') return [];
  const blocks = [
    { title: '1. 封禁历史查询截图', urls: splitRawImagesField(raw.banRecordScreenshot) },
    { title: '2. 游戏角色截图', urls: splitRawImagesField(raw.otherScreenshot) },
    { title: '3. 主仓库/保险箱截图', urls: splitRawImagesField(raw.warehouseScreenshot) },
  ];
  return blocks.filter((b) => b.urls.length > 0);
});

function galleryIndexForUrl(url) {
  const idx = imageList.value.indexOf(url);
  return idx >= 0 ? idx : 0;
}

const PLACEHOLDER_GALLERY =
  'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg';

function openGalleryPreview(index) {
  const urls = imageList.value.length
    ? [...imageList.value]
    : [PLACEHOLDER_GALLERY];
  const i = Math.min(Math.max(0, index), urls.length - 1);
  showImagePreview({
    images: urls,
    startPosition: i,
    closeable: true,
  });
}

const hourlyRate = computed(() => {
  const r = goods.value.rent;
  const n = Number(r);
  return Number.isFinite(n) && n >= 0 ? n : 0;
});

const priceHourly = computed(() => hourlyRate.value.toFixed(2));

const depositNum = computed(() => {
  const d = Number(goods.value.deposit);
  return Number.isFinite(d) && d >= 0 ? d : 0;
});

const depositText = computed(() => depositNum.value.toFixed(2));

const rentSubtotal = computed(() =>
  (Math.round(hourlyRate.value * rentHours.value * 100) / 100).toFixed(2)
);

const estimatePay = computed(() =>
  (Math.round((hourlyRate.value * rentHours.value + depositNum.value) * 100) / 100).toFixed(2)
);

const listTotalText = computed(() => {
  const t = goods.value.totalAmountList;
  if (t == null || t === '') return '';
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return '';
  return `￥${n.toFixed(2)}（后台：租金+押金）`;
});

function regionLabel(adcode) {
  if (adcode == null || adcode === '') return '';
  const key = Number(adcode);
  if (Number.isFinite(key) && REGION_SAMPLES[key]) return REGION_SAMPLES[key];
  const s = String(adcode);
  if (REGION_ZONE[s]) return `${REGION_ZONE[s]}（${s}）`;
  return REGION_SAMPLES[key] || s;
}

function formatHafuCoin(n) {
  if (n == null || n === '') return '';
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  if (num >= 1e8) return `${(num / 1e8).toFixed(2)} 亿`;
  if (num >= 1e4) return `${(num / 1e4).toFixed(1)} 万`;
  return String(num);
}

function mapDetail(res) {
  const loginMethod = res.loginMethod ?? res.loginMethodType;
  const stamina = res.staminaLevel ?? res.stamina;
  const carry = res.carryCapacity ?? res.carry;
  const awm = res.awmCount ?? res.awm;
  const insurance = res.insurance;
  const sixH = res.sixHelmetCount;
  const sixA = res.sixArmorCount;
  const skinName = res.specialSkinName ? String(res.specialSkinName).trim() : '';
  const skinId = res.specialSkinId ? String(res.specialSkinId).trim() : '';
  const specialSkinText =
    skinName || (skinId ? `皮肤ID：${skinId}` : '');

  return {
    id: res.id,
    title: res.ratioInfo || (res.accountCode ? `账号 ${res.accountCode}` : ''),
    gameName: '三角洲行动',
    accountCode: res.accountCode || '',
    regionAdcode: res.regionAdcode != null ? res.regionAdcode : '',
    gameRegion: regionLabel(res.regionAdcode) || res.regionName || '',
    statusText: STATUS_MAP[res.status] || (res.status != null ? `状态 ${res.status}` : ''),
    auditRejectReason: res.auditRejectReason || '',
    staminaText:
      stamina != null && stamina !== '' ? `${staminaLevelText(stamina)}` : '—',
    carryText: carry != null && carry !== '' ? `${carry} 级` : '—',
    rankTier: RANK_MAP[res.rankLevel] || (res.rankLevel ? `段位 ${res.rankLevel}` : ''),
    levelText:
      res.level != null && res.level !== '' ? `${res.level} 级` : null,
    kdText:
      res.kd != null && res.kd !== '' ? String(res.kd) : null,
    leaseDaysText:
      res.leaseDays != null && res.leaseDays !== '' ? `${res.leaseDays} 天` : null,
    hafuCoinText: formatHafuCoin(res.hafuCoin),
    insuranceText:
      INSURANCE_MAP[insurance] ||
      (insurance != null ? `类型 ${insurance}` : ''),
    specialSkinText,
    sixHelmetText:
      sixH != null && sixH !== '' && Number(sixH) > 0 ? String(sixH) : null,
    sixArmorText:
      sixA != null && sixA !== '' && Number(sixA) > 0 ? String(sixA) : null,
    loginMethodText:
      LOGIN_METHOD_MAP[loginMethod] ||
      (loginMethod ? `方式 ${loginMethod}` : '—'),
    awmText: awm != null && awm !== '' && Number(awm) > 0 ? String(awm) : '',
    rent: Number(res.rent) || 0,
    deposit: Number(res.deposit) || 0,
    totalAmountList:
      res.totalAmount != null && res.totalAmount !== '' ? res.totalAmount : null,
    description: res.remark || res.description || '',
    isFeatured: Number(res.featuredFlag) === 1,
    officialFlag: Number(res.officialFlag) === 1,
    _raw: res,
  };
}

function staminaLevelText(stamina) {
  const n = Number(stamina);
  if (Number.isFinite(n)) return `${n} 级`;
  return `${stamina} 级`;
}

async function copyCode() {
  const code = goods.value.accountCode;
  if (!code) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
    } else {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('已复制账号编号');
  } catch {
    showFailToast('复制失败');
  }
}

onMounted(async () => {
  branding.fetchBranding().catch(() => {});
  if (!goodsId) return;
  try {
    showLoadingToast({ message: '加载中…', forbidClick: true });
    const res = await getGoodsDetail(goodsId);
    if (res && typeof res === 'object') {
      goods.value = mapDetail(res);
    } else {
      goods.value = mapDetail({});
    }
  } catch (e) {
    console.error(e);
    showFailToast('获取详情失败');
  }
});

const handleCreateOrder = async () => {
  const accountId = Number(goods.value.id ?? goodsId);
  if (!Number.isFinite(accountId)) {
    showFailToast('账号信息异常');
    return;
  }
  try {
    showLoadingToast({ message: '创建订单…', forbidClick: true });
    const orderRes = await createOrder({ accountId });
    showSuccessToast('下单成功');
    const orderEntity = unwrapOrderPayload(orderRes) || orderRes;
    const newOrderId =
      orderEntity?.id ??
      orderRes?.id ??
      orderRes?.orderId ??
      orderRes?.data?.id ??
      orderRes;
    router.push({ path: '/pay', query: { orderId: String(newOrderId) } });
  } catch (error) {
    const msg =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      '创建订单失败';
    showFailToast(msg);
  }
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f2f3f5;
  color: #323233;
  padding-bottom: env(safe-area-inset-bottom);
}

.detail-page__nav :deep(.van-nav-bar) {
  background: #fff;
}
.detail-page__nav :deep(.van-nav-bar__title) {
  font-weight: 600;
}

.detail-page__main {
  padding-top: 12px;
  padding-bottom: 24px;
}

.detail-page__crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #969799;
  margin-bottom: 16px;
}
.detail-page__crumb .link {
  cursor: pointer;
}
.detail-page__crumb .link:hover {
  color: #1989fa;
}
.detail-page__crumb .sep {
  color: #dcdee0;
  font-size: 12px;
}
.detail-page__crumb .current {
  color: #323233;
  font-weight: 600;
}

.global-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.shadow-sm {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Hero: mobile column, desktop row */
.detail-page__hero {
  margin-bottom: 12px;
}

.detail-page__gallery {
  position: relative;
  background: #000;
}

.detail-page__swipe {
  width: 100%;
}

.detail-page__swipe-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.detail-page__gallery-badges {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: 2;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
}
.pill--dark {
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  backdrop-filter: blur(6px);
}
.pill--code {
  background: rgba(255, 255, 255, 0.92);
  color: #323233;
  cursor: pointer;
  max-width: 100%;
}
.pill__ico {
  font-size: 14px;
  color: #1989fa;
}

.detail-page__summary {
  padding: 16px 16px 20px;
}

.detail-page__head {
  margin-bottom: 12px;
}

.detail-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.45;
  color: #323233;
}

.tag {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  margin-bottom: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
.tag--hot {
  background: #fff1f0;
  color: #ee0a24;
  border: 1px solid #ffcdd1;
}
.tag--official {
  background: #e8f4ff;
  color: #1989fa;
  border: 1px solid #b3d8ff;
}

.price-card {
  background: linear-gradient(180deg, #f7f9fc 0%, #fff 100%);
  border: 1px solid #ebedf0;
  border-radius: 10px;
  padding: 14px 14px 12px;
  margin-bottom: 16px;
}

.price-card__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.price-card__row:last-child {
  margin-bottom: 0;
}
.price-card__row--highlight {
  margin-bottom: 12px;
}
.price-card__row--total {
  margin-top: 4px;
  margin-bottom: 0;
  align-items: center;
}

.price-card__label {
  font-size: 13px;
  color: #969799;
}
.price-card__value {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}
.price-card__value strong {
  font-size: 26px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #ee0a24;
}
.price-card__row--highlight .price-card__value {
  color: #ee0a24;
}
.price-card__value .unit {
  font-size: 12px;
  font-weight: 500;
  margin-left: 2px;
}
.price-card__value--sub {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.price-card__value--sub .hint {
  font-size: 12px;
  font-weight: 400;
  color: #969799;
  margin-left: 4px;
}
.price-card__value--danger {
  color: #ee0a24;
}
.price-card__value--danger strong {
  font-size: 22px;
}

.price-card__divider {
  height: 1px;
  background: #ebedf0;
  margin: 10px 0;
}

.price-card__note {
  margin: 12px 0 0;
  font-size: 11px;
  color: #c8c9cc;
  line-height: 1.5;
}

.detail-page__duration {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #f7f8fa;
  border-radius: 10px;
  margin-bottom: 16px;
}
.detail-page__duration-label {
  font-size: 14px;
  font-weight: 500;
  color: #646566;
}
.detail-page__duration-ctrl {
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-page__duration-unit {
  font-size: 14px;
  color: #646566;
}

.detail-page__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail-page__btn-main {
  font-weight: 600;
  height: 48px;
}
.detail-page__btn-sub {
  font-weight: 600;
  height: 48px;
  background: #f2f3f5;
  color: #323233;
  border: none;
}

.spec-card {
  margin-bottom: 12px;
  padding: 4px 0 8px;
}
.spec-card__title {
  margin: 0;
  padding: 14px 16px 8px;
  font-size: 16px;
  font-weight: 700;
}
.spec-card__cells :deep(.van-cell) {
  padding-top: 10px;
  padding-bottom: 10px;
}
.spec-card__cells :deep(.spec-cell-muted) {
  color: #969799;
}

.disclaimer-card .disclaimer-text {
  margin: 0 16px 16px;
  font-size: 13px;
  line-height: 1.7;
  color: #646566;
  white-space: pre-wrap;
}

.proof-card__body {
  padding: 0 16px 16px;
}
.proof-block {
  margin-bottom: 18px;
}
.proof-block:last-child {
  margin-bottom: 0;
}
.proof-block__title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #646566;
}
.proof-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.proof-thumb {
  width: 100%;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #ebedf0;
  background: #f7f8fa;
}
.proof-thumb :deep(.van-image__img) {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  vertical-align: top;
}

.tabs-card {
  padding-bottom: 8px;
}
.tabs-card :deep(.van-tabs__nav) {
  padding: 0 8px;
}
.tab-body {
  padding: 16px;
  min-height: 120px;
}
.tab-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
  color: #646566;
  white-space: pre-wrap;
}

.notice-block {
  background: #fff7e6;
  border: 1px solid #ffe7ba;
  border-radius: 8px;
  padding: 14px;
}
.notice-block__title {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #d46b08;
}
.notice-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #873800;
  line-height: 1.7;
}

.safe-line {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
}
.safe-line:last-child {
  margin-bottom: 0;
}
.safe-line__ico {
  flex-shrink: 0;
  font-size: 22px;
  color: #1989fa;
  margin-top: 2px;
}
.safe-line b {
  display: block;
  color: #323233;
  margin-bottom: 4px;
}
.safe-line p {
  margin: 0;
}

.detail-page__bar {
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
}
.detail-page__bar-price {
  flex: 1;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.detail-page__bar-price .muted {
  font-size: 11px;
  color: #969799;
}
.detail-page__bar-price .num {
  font-size: 18px;
  font-weight: 800;
  color: #ee0a24;
  font-variant-numeric: tabular-nums;
}
.detail-page__bar-btn {
  flex: 1.2;
  max-width: 160px;
  margin-right: 8px !important;
  font-weight: 600;
}

.help-dialog {
  text-align: center;
  padding: 20px 16px 8px;
}
.help-dialog__tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: #969799;
}

@media (max-width: 767px) {
  .desktop-only {
    display: none !important;
  }
  .detail-page__main {
    padding-top: 12px;
    padding-bottom: 72px;
  }
  .detail-page__hero {
    border-radius: 0;
    margin-left: -12px;
    margin-right: -12px;
    margin-top: -1px;
  }
  .detail-page__gallery {
    aspect-ratio: 4 / 3;
    max-height: 72vw;
  }
  .detail-page__swipe,
  .detail-page__swipe :deep(.van-swipe-item) {
    height: 100%;
  }
  .detail-page__summary {
    margin-top: -20px;
    padding-top: 20px;
    position: relative;
    z-index: 2;
    background: #fff;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  }
  .price-card__value strong {
    font-size: 22px;
  }
  .detail-page__duration {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .detail-page__duration-ctrl {
    width: 100%;
    justify-content: space-between;
  }
  .detail-page__bar-btn {
    max-width: none;
    margin-right: 0 !important;
  }
}

@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
  .detail-page__main {
    padding-top: 72px;
    padding-bottom: 48px;
  }
  .detail-page__hero {
    display: flex;
    gap: 28px;
    padding: 20px;
  }
  .detail-page__gallery {
    width: 420px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    height: 360px;
  }
  .detail-page__swipe,
  .detail-page__swipe :deep(.van-swipe__track),
  .detail-page__swipe :deep(.van-swipe-item) {
    height: 100%;
  }
  .detail-page__summary {
    flex: 1;
    padding: 8px 8px 12px 0;
    display: flex;
    flex-direction: column;
  }
  .detail-page__title {
    font-size: 22px;
  }
  .detail-page__actions {
    margin-top: auto;
    padding-top: 16px;
  }
  .proof-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 380px) {
  .detail-page__main {
    padding-top: 10px;
  }
  .detail-page__hero {
    margin-left: -8px;
    margin-right: -8px;
  }
  .detail-page__title {
    font-size: 16px;
    line-height: 1.35;
  }
  .price-card {
    padding: 12px 10px 10px;
  }
  .price-card__value strong {
    font-size: 20px;
  }
  .tabs-card :deep(.van-tabs__line) {
    width: 24px !important;
  }
}
</style>
