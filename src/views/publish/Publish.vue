<template>
  <div class="publish-page">
    <NavBar activeMenu="publish" class="desktop-nav-bar" />

    <van-nav-bar
      title="我要发布账号"
      left-arrow
      fixed
      placeholder
      z-index="999"
      safe-area-inset-top
      class="mobile-nav-bar"
      @click-left="goBack"
    />

    <main class="publish-container page-shell">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" wrapable>
        请如实填写参数；体力、负重须至少 4 级方可上架审核；勾选的皮肤以 ID 列表提交（与大厅筛选相同）。截图将随表单提交，若过大请先压缩。
      </van-notice-bar>

        <div class="section-title">粘贴识别（可选）</div>
        <van-cell-group inset>
          <van-field
            v-model="pasteBlob"
            type="textarea"
            rows="5"
            label="统一格式文案"
            label-align="top"
            placeholder="粘贴流动资产、纯哈夫币、保险格数、体力、负重、AWM、段位、KD 等整段文字"
            autosize
            maxlength="8000"
            show-word-limit
          />
          <div class="paste-actions">
            <van-button type="primary" size="small" round plain block @click="applyPaste">
              识别并填入下方字段
            </van-button>
          </div>
        </van-cell-group>

      <van-form
        class="custom-form"
        @submit="onSubmit"
        @failed="onFailed"
        scroll-to-error
      >
        <div class="section-title">基础配置与定价</div>
        <van-cell-group inset>
          <van-field
            v-model="form.title"
            name="title"
            label="账号标题"
            placeholder="例如：满配人物红皮 高资源"
            :rules="[{ required: true, message: '请填写标题' }]"
          />
          <van-field
            v-model="form.price"
            type="number"
            name="price"
            label="时租价"
            placeholder="元 / 小时"
            :rules="priceRules"
          >
            <template #extra><span class="field-extra">元/小时</span></template>
          </van-field>
          <div class="field-hint">
            <span class="hint-text">租金如何填写？</span>
            <van-button size="mini" type="primary" plain round @click="openPublishRulesDialog('租金/上架规则说明')">
              查看说明
            </van-button>
          </div>
          <van-field
            v-model="form.deposit"
            type="number"
            name="deposit"
            label="押金"
            placeholder="选填，默认 0"
          >
            <template #extra><span class="field-extra">元</span></template>
          </van-field>
          <div class="field-hint">
            <span class="hint-text">押金建议会随资产/皮肤/AWM变化</span>
            <van-button size="mini" type="primary" plain round @click="openPublishRulesDialog('押金/上架规则说明')">
              查看说明
            </van-button>
          </div>
          <div class="suggest-rent-row">
            <van-button
              size="small"
              type="primary"
              plain
              round
              block
              :loading="suggestLoading"
              @click="applyRentSuggest"
            >
              按哈弗币与保险箱等估算建议时租/押金
            </van-button>
            <p class="suggest-tip">以下方「哈弗币参考」「保险箱」「体力/负重」为主；特殊刀皮、人物红皮、武器皮肤数量可后续在后台规则完善后再参与估算。截图在登录且服务端开启云存储时会传到 OSS，仅返回链接。</p>
          </div>
          <van-field :model-value="form.region" name="region" label="游戏大区">
            <template #input>
              <van-radio-group v-model="form.region" direction="horizontal">
                <van-radio name="微信区">微信区</van-radio>
                <van-radio name="QQ区">QQ区</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-cell-group>

        <div class="section-title">三角洲基础参数</div>
        <van-cell-group inset>
          <van-field :model-value="form.staminaLevel" name="staminaLevel" label="体力等级" :rules="staminaRules">
            <template #input>
              <van-radio-group v-model="form.staminaLevel" direction="horizontal" class="radio-wrap">
                <van-radio v-for="item in staminaLevelOptions" :key="String(item.value)" :name="item.value">
                  {{ item.text }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field :model-value="form.carryCapacity" name="carryCapacity" label="负重" :rules="carryRules">
            <template #input>
              <van-radio-group v-model="form.carryCapacity" direction="horizontal" class="radio-wrap">
                <van-radio v-for="item in capacityOptions" :key="String(item.value)" :name="item.value">
                  {{ item.text }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field :model-value="form.rankLevel" name="rankLevel" label="段位" :rules="pickRules">
            <template #input>
              <van-radio-group v-model="form.rankLevel" direction="horizontal" class="radio-wrap">
                <van-radio v-for="item in rankLevelOptions" :key="String(item.value)" :name="item.value">
                  {{ item.text }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="form.leaseDays"
            type="digit"
            name="leaseDays"
            label="租期(天)"
            placeholder="默认可租天数，如 7"
            :rules="leaseDaysRules"
          />
          <van-field
            v-model="form.level"
            type="digit"
            name="level"
            label="账号等级"
            placeholder="游戏内等级，如 30"
            :rules="levelRules"
          />
          <van-field
            v-model="form.kd"
            type="number"
            name="kd"
            label="KD"
            placeholder="如 2.5"
            :rules="kdRules"
          />
          <van-field
            v-model="form.currency"
            name="currency"
            label="哈弗币参考"
            placeholder="如 150M、8000W 或纯数字"
            :rules="[{ required: true, message: '请填写哈弗币大致数量' }]"
          />
        </van-cell-group>

        <div class="section-title">
          关联皮肤
          <span v-if="skinsLoading" class="section-meta">同步中…</span>
          <span v-else-if="!skinGroupsReady" class="section-meta section-meta--warn">接口无数据时无法勾选</span>
          <span v-else class="section-meta">已选 {{ selectedSkinCount }} 项</span>
        </div>
        <van-cell-group inset>
          <van-field v-for="t in SKIN_TYPE_ORDER" :key="t" :label="SKIN_TYPE_LABEL[t]">
            <template #input>
              <div class="tag-options">
                <span
                  v-for="item in skinOptionsByType[t]"
                  :key="item.value"
                  :class="{ active: isSkinSelected(item.value) }"
                  @click="toggleSkin(item.value)"
                >
                  {{ item.text }}
                </span>
                <span v-if="!skinOptionsByType[t]?.length && !skinsLoading" class="skin-empty">暂无选项</span>
              </div>
            </template>
          </van-field>
        </van-cell-group>

        <div class="section-title">武器与资产</div>
        <van-cell-group inset>
          <van-field
            v-model="form.awm"
            type="digit"
            name="awm"
            label="AWM 数量"
            placeholder="0–150，可选"
          />
        </van-cell-group>

        <div class="section-title">登录与保险箱</div>
        <van-cell-group inset>
          <van-field :model-value="form.method" name="method" label="上号方式" :rules="pickRules">
            <template #input>
              <van-radio-group v-model="form.method" direction="horizontal" class="radio-wrap">
                <van-radio v-for="item in loginMethodOptions" :key="item.value" :name="item.value">
                  {{ item.text }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            is-link
            name="insuranceType"
            label="保险箱类型"
            :model-value="insuranceFieldDisplay"
            placeholder="请选择"
            :rules="insuranceFieldRules"
            @click="showSafePicker = true"
          />
          <van-popup v-model:show="showSafePicker" position="bottom" round>
            <van-picker
              v-model="pickerInsuranceValue"
              title="选择保险箱类型"
              :columns="safeColumns"
              :columns-field-names="{ text: 'text', value: 'value' }"
              @confirm="onConfirmSafe"
              @cancel="showSafePicker = false"
            />
          </van-popup>
        </van-cell-group>

        <div class="section-title">资产防伪截图（必填）</div>
        <van-cell-group inset class="uploader-group">
          <div class="upload-item">
            <div class="upload-label"><span class="required">*</span> 1. 腾讯游戏安全中心封禁查询截图</div>
            <p class="upload-desc">证明无开挂记录。</p>
            <van-uploader v-model="form.banImgs" max-count="1" :after-read="afterRead" accept="image/*" />
          </div>
          <van-divider />
          <div class="upload-item">
            <div class="upload-label"><span class="required">*</span> 2. 游戏角色主页截图</div>
            <van-uploader v-model="form.roleImgs" max-count="1" :after-read="afterRead" accept="image/*" />
          </div>
          <van-divider />
          <div class="upload-item">
            <div class="upload-label"><span class="required">*</span> 3. 仓库与保险箱（最多 3 张）</div>
            <van-uploader
              v-model="form.warehouseImgs"
              max-count="3"
              multiple
              :after-read="afterRead"
              accept="image/*"
            />
          </div>
        </van-cell-group>

        <div class="submit-wrap">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            class="submit-btn"
            :loading="submitting"
            :disabled="submitting"
          >
            提交审核
          </van-button>
          <p class="agreement-text">提交即表示您同意平台账号发布与审核规则。</p>
        </div>
      </van-form>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast, showFailToast, showDialog } from 'vant';
import NavBar from '@/components/NavBar.vue';
import {
  createSjzAccount,
  updateSjzAccount,
  getMySjzAccountDetail,
  getSkinGroupList,
  getSjzRentSuggest,
  getSjzPublishRules,
} from '@/api/goods';
import { buildSjzAccountCreateBody, parsePastedListingText, parseHarvardCoinInput } from '@/utils/publishPayload';
import { afterReadOssOrDataUrl } from '@/utils/ossVanUploader';
import { SKIN_TYPE_ORDER, SKIN_TYPE_LABEL, fillSkinOptionsByType } from '@/utils/skinGroups';

const router = useRouter();
const route = useRoute();
const submitting = ref(false);
const pasteBlob = ref('');
const suggestLoading = ref(false);
const publishRules = ref(null);
const showSafePicker = ref(false);
const skinsLoading = ref(false);
// 占位图：用于开发阶段绕过“截图字段过长/无上传接口”问题
const DEFAULT_SCREENSHOT_URL = 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg';

const editId = computed(() => {
  const raw = route.query?.edit;
  const n = parseInt(String(raw ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
});
const isEditMode = computed(() => editId.value != null);

/** @type {import('vue').Reactive<Record<number, { text: string, value: number }[]>>} */
const skinOptionsByType = reactive({
  1: [],
  2: [],
  3: [],
  4: [],
});

const skinGroupsReady = computed(() =>
  SKIN_TYPE_ORDER.some((t) => skinOptionsByType[t]?.length > 0)
);

const selectedSkinCount = computed(() =>
  Array.isArray(form.skinIds) ? form.skinIds.length : 0
);

const form = reactive({
  /** 后端 DTO 必填：@NotBlank(message = "账号编号不能为空") */
  accountCode: '',
  title: '',
  price: '',
  deposit: '',
  region: '微信区',
  method: '',
  currency: '',
  insuranceType: '',
  awm: '',
  leaseDays: '7',
  level: '',
  kd: '',
  banImgs: [],
  roleImgs: [],
  warehouseImgs: [],
  staminaLevel: '',
  carryCapacity: '',
  rankLevel: '',
  /** 合并写入 POST body.skinIds，与 sjz_account_skin_relation.skin_id 一致 */
  skinIds: [],
});

const REGION_ZONE_BY_ADCODE = {
  '310000': '微信区',
  '110000': 'QQ区',
};

function splitCommaNumbers(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function splitCommaStrings(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toUploaderListFromUrls(value) {
  const urls = splitCommaStrings(value);
  return urls.map((url) => ({ url, status: 'done', message: '' }));
}

function applyAccountToForm(res) {
  // 基础字段
  form.accountCode = res?.accountCode ?? form.accountCode ?? '';
  form.title = res?.ratioInfo ?? res?.title ?? '';
  form.price = res?.rent != null ? String(res.rent) : '';
  form.deposit = res?.deposit != null ? String(res.deposit) : '';
  form.region = REGION_ZONE_BY_ADCODE[String(res?.regionAdcode ?? '')] || form.region;
  form.method = res?.loginMethod != null ? Number(res.loginMethod) : '';
  form.currency = res?.hafuCoin != null ? String(res.hafuCoin) : '';
  form.insuranceType = res?.insurance != null ? Number(res.insurance) : '';
  form.awm = res?.awmCount != null ? String(res.awmCount) : '';
  form.leaseDays = res?.leaseDays != null ? String(res.leaseDays) : form.leaseDays;
  form.level = res?.level != null ? String(res.level) : '';
  form.kd = res?.kd != null ? String(res.kd) : '';
  form.staminaLevel = res?.staminaLevel != null ? Number(res.staminaLevel) : '';
  form.carryCapacity = res?.carryCapacity != null ? Number(res.carryCapacity) : '';
  form.rankLevel = res?.rankLevel != null ? Number(res.rankLevel) : '';

  // 皮肤：mine detail 没有 skinIds，使用 specialSkinId（逗号拼接）回填
  const skinIds = Array.isArray(res?.skinIds) ? res.skinIds : splitCommaNumbers(res?.specialSkinId);
  form.skinIds = Array.isArray(skinIds) ? [...skinIds] : [];

  // 截图：回填成 uploader url 列表（不会被 afterRead 覆盖）
  form.banImgs = toUploaderListFromUrls(res?.banRecordScreenshot);
  form.roleImgs = toUploaderListFromUrls(res?.otherScreenshot);
  form.warehouseImgs = toUploaderListFromUrls(res?.warehouseScreenshot);
}

const safeColumns = [
  { text: '基础安全箱（1×2）', value: 1 },
  { text: '进阶安全箱（2×2）', value: 2 },
  { text: '高级安全箱（2×3）', value: 3 },
  { text: '顶级安全箱（3×3）', value: 4 },
];

const loginMethodOptions = [
  { text: 'QQ 账密', value: 1 },
  { text: 'QQ 扫码', value: 2 },
  { text: '微信账密', value: 3 },
  { text: '微信扫码', value: 4 },
];

const MIN_STAMINA_LEVEL = 4;
const MIN_CARRY_LEVEL = 4;

const staminaLevelOptions = [
  { text: '请选择', value: '' },
  ...Array.from({ length: 7 - MIN_STAMINA_LEVEL + 1 }, (_, i) => ({
    text: `${i + MIN_STAMINA_LEVEL}级体力`,
    value: i + MIN_STAMINA_LEVEL,
  })),
];

const capacityOptions = [
  { text: '请选择', value: '' },
  ...Array.from({ length: 7 - MIN_CARRY_LEVEL + 1 }, (_, i) => ({
    text: `${i + MIN_CARRY_LEVEL}级负重`,
    value: i + MIN_CARRY_LEVEL,
  })),
];

const rankLevelTexts = ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '巅峰'];
const rankLevelOptions = [
  { text: '请选择', value: '' },
  ...Array.from({ length: 7 }, (_, i) => ({ text: rankLevelTexts[i], value: i + 1 })),
];

const priceRules = [
  { required: true, message: '请填写时租价' },
  {
    validator: (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0;
    },
    message: '时租价须大于 0',
  },
];

const pickRules = [
  {
    validator: (v) => v !== '' && v !== undefined && v !== null,
    message: '请选择一项',
  },
];

const staminaRules = [
  ...pickRules,
  {
    validator: (v) => Number(v) >= MIN_STAMINA_LEVEL,
    message: `体力至少 ${MIN_STAMINA_LEVEL} 级方可上架`,
  },
];

const carryRules = [
  ...pickRules,
  {
    validator: (v) => Number(v) >= MIN_CARRY_LEVEL,
    message: `负重至少 ${MIN_CARRY_LEVEL} 级方可上架`,
  },
];

const leaseDaysRules = [
  { required: true, message: '请填写租期天数' },
  {
    validator: (v) => {
      const n = parseInt(String(v), 10);
      return Number.isFinite(n) && n >= 1 && n <= 999;
    },
    message: '租期应为 1～999 天',
  },
];

const levelRules = [
  { required: true, message: '请填写账号等级' },
  {
    validator: (v) => {
      const n = parseInt(String(v), 10);
      return Number.isFinite(n) && n >= 1 && n <= 999;
    },
    message: '等级为 1～999 的整数',
  },
];

const kdRules = [
  { required: true, message: '请填写 KD' },
  {
    validator: (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0.01 && n <= 99.99;
    },
    message: 'KD 范围 0.01～99.99',
  },
];

/** 校验以 form.insuranceType 为准（展示为文案，避免与 Picker 返回值结构耦合） */
const insuranceFieldRules = [
  {
    validator: () =>
      form.insuranceType !== '' &&
      form.insuranceType !== undefined &&
      form.insuranceType !== null,
    message: '请选择保险箱类型',
  },
];

/** Picker 绑定值：单列时为第一个滚轮的选中值，需与 options 的 value 类型一致 */
const pickerInsuranceValue = ref([]);

const insuranceFieldDisplay = computed(() =>
  getInsuranceTypeText(form.insuranceType) || ''
);

function getInsuranceTypeText(value) {
  if (value === '' || value === undefined || value === null) return '';
  const hit = safeColumns.find(
    (item) => item.value === value || String(item.value) === String(value)
  );
  return hit ? hit.text : '';
}

function syncPickerFromForm() {
  const v = form.insuranceType;
  pickerInsuranceValue.value =
    v === '' || v === undefined || v === null ? [] : [v];
}

function onConfirmSafe({ selectedValues, selectedOptions }) {
  let raw =
    Array.isArray(selectedValues) && selectedValues.length
      ? selectedValues[0]
      : undefined;
  if (raw === undefined && selectedOptions?.[0]) {
    const o = selectedOptions[0];
    raw = o.value !== undefined ? o.value : o;
  }
  const n = parseInt(String(raw), 10);
  form.insuranceType = Number.isFinite(n) ? n : '';
  showSafePicker.value = false;
}

watch(showSafePicker, (open) => {
  if (open) syncPickerFromForm();
});

function isSkinSelected(value) {
  return Array.isArray(form.skinIds) && form.skinIds.includes(value);
}

function toggleSkin(value) {
  const arr = form.skinIds;
  if (!Array.isArray(arr)) return;
  const i = arr.indexOf(value);
  if (i > -1) arr.splice(i, 1);
  else arr.push(value);
}

async function applyRentSuggest() {
  const hafuCoin = parseHarvardCoinInput(form.currency);
  if (hafuCoin == null || hafuCoin <= 0) {
    showToast('请先填写「哈弗币参考」');
    return;
  }
  const insurance =
    form.insuranceType === '' || form.insuranceType === undefined || form.insuranceType === null
      ? undefined
      : Number(form.insuranceType);
  suggestLoading.value = true;
  try {
    const data = await getSjzRentSuggest({
      hafuCoin,
      insurance,
      awmCount: Number.isFinite(Number(form.awm)) ? Math.max(0, parseInt(String(form.awm || '0'), 10) || 0) : 0,
      knifeCount: 0,
      redCount: 0,
      brickCount: 0,
      fullStamina: form.staminaLevel === 7,
      fullCarry: form.carryCapacity === 7,
    });
    if (data?.suggestedRent != null) {
      form.price = String(data.suggestedRent);
    }
    if (data?.suggestedDeposit != null) {
      form.deposit = String(data.suggestedDeposit);
    }
    showToast('已填入系统估算值，请核对后再提交');
  } catch (e) {
    showToast(e?.message || '获取建议价失败');
  } finally {
    suggestLoading.value = false;
  }
}

async function openPublishRulesDialog(title = '规则说明') {
  const text = publishRules.value?.rulesText;
  await showDialog({
    title,
    message: text || '暂无规则说明（请稍后重试或联系管理员）',
    confirmButtonText: '我已了解',
    messageAlign: 'left',
  });
}

function applyPaste() {
  const patch = parsePastedListingText(pasteBlob.value);
  if (!patch || !Object.keys(patch).length) {
    showToast('未识别到有效字段，请检查格式');
    return;
  }
  if (patch.currency != null) form.currency = String(patch.currency);
  if (patch.staminaLevel != null) form.staminaLevel = Number(patch.staminaLevel);
  if (patch.carryCapacity != null) form.carryCapacity = Number(patch.carryCapacity);
  if (patch.rankLevel != null) form.rankLevel = Number(patch.rankLevel);
  if (patch.insuranceType != null) {
    form.insuranceType = Number(patch.insuranceType);
    syncPickerFromForm();
  }
  if (patch.awm != null) form.awm = String(patch.awm);
  if (patch.kd != null) form.kd = String(patch.kd);
  showToast('已根据识别结果填充，请核对后提交');
}

const afterRead = afterReadOssOrDataUrl;

function validateScreenshots() {
  if (!form.banImgs.length || !form.roleImgs.length || !form.warehouseImgs.length) {
    showToast('请完整上传三类截图');
    return false;
  }
  const all = [...form.banImgs, ...form.roleImgs, ...form.warehouseImgs];
  const bad = all.some((f) => f.status === 'failed' || f.status === 'uploading');
  if (bad) {
    showToast('请等待图片处理完成或删除失败项');
    return false;
  }
  return true;
}

function ensurePlaceholderScreenshot(list) {
  if (Array.isArray(list) && list.length) return false;
  list.splice(0, list.length);
  list.push({ url: DEFAULT_SCREENSHOT_URL, status: 'done', message: '' });
  return true;
}

async function onSubmit() {
  if (submitting.value) return;
  // 没有上传接口时，自动用占位图填充必填截图字段（避免写库超长与必填校验）
  const usedPlaceholder =
    ensurePlaceholderScreenshot(form.banImgs) ||
    ensurePlaceholderScreenshot(form.roleImgs) ||
    ensurePlaceholderScreenshot(form.warehouseImgs);
  if (usedPlaceholder) showToast('已自动使用占位图（开发模式）');
  if (!validateScreenshots()) return;

  submitting.value = true;
  try {
    if (!form.accountCode) {
      // 生成“账号编号”，避免后端 @NotBlank 校验失败
      const suffix = String(Date.now()).slice(-6);
      const rand = Math.floor(Math.random() * 1000);
      form.accountCode = `ACC${suffix}${rand}`;
    }
    const body = buildSjzAccountCreateBody(form);
    if (isEditMode.value) {
      await updateSjzAccount(editId.value, body);
      showSuccessToast('已保存');
    } else {
      await createSjzAccount(body);
      showSuccessToast('已提交，待审核');
    }
    router.push('/my-publish');
  } catch (e) {
    const code = e?.code || e?.response?.status;
    const net =
      e?.message === 'Network Error' ||
      code === 'ERR_NETWORK' ||
      code === 'ECONNABORTED';
    const msg = net
      ? '网络中断：多半是截图太大导致连接被重置，已自动压缩若仍失败请换更小截图或检查后端服务'
      : e?.response?.data?.msg ||
        e?.response?.data?.message ||
        e?.message ||
        '提交失败';
    showFailToast(msg);
  } finally {
    submitting.value = false;
  }
}

function onFailed({ errors } = {}) {
  // van-form 校验失败时不会触发 @submit，因此需要在这里兜底提示
  const first = Array.isArray(errors) ? errors[0] : undefined;
  const msg = first?.message || first?.errorMessage || '请检查必填项';
  showToast(msg);
  // 方便定位是哪个字段不通过
  console.warn('[Publish] form validation failed:', errors);
}

async function loadSkins() {
  skinsLoading.value = true;
  try {
    const data = await getSkinGroupList();
    fillSkinOptionsByType(skinOptionsByType, data);
  } catch (err) {
    console.error(err);
    showToast(err?.message || '皮肤列表加载失败');
  } finally {
    skinsLoading.value = false;
  }
}

onMounted(() => {
  getSjzPublishRules()
    .then((res) => {
      publishRules.value = res;
    })
    .catch(() => {
      publishRules.value = null;
    });
  loadSkins();
  if (isEditMode.value) {
    const id = editId.value;
    getMySjzAccountDetail(id)
      .then((res) => {
        applyAccountToForm(res);
      })
      .catch((e) => {
        console.error(e);
        showToast(e?.response?.data?.msg || e?.message || '加载编辑数据失败');
      });
  }
});

const goBack = () => router.back();
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 40px;
}
.publish-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
}
.paste-actions {
  padding: 0 16px 12px;
}

.suggest-rent-row {
  padding: 0 16px 12px;
}
.suggest-tip {
  margin: 8px 0 0;
  font-size: 11px;
  color: #969799;
  line-height: 1.45;
}

.section-title {
  padding: 12px 16px 8px;
  font-size: 14px;
  color: #646566;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-meta {
  font-size: 12px;
  font-weight: 400;
  color: #969799;
}
.section-meta--warn {
  color: #ee0a24;
}
.custom-form {
  margin-top: 8px;
}
.field-extra {
  color: #969799;
  font-size: 12px;
}
.field-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 16px 10px;
  color: #969799;
  font-size: 12px;
}
.hint-text {
  flex: 1;
  line-height: 1.4;
}
.radio-wrap {
  flex-wrap: wrap;
  row-gap: 8px;
}
.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}
.tag-options span {
  padding: 7px 14px;
  background: #f7f8fa;
  border-radius: 20px;
  font-size: 12px;
  color: #646566;
  border: 1px solid transparent;
  cursor: pointer;
}
.tag-options span.active {
  background: #ecf5ff;
  color: #1989fa;
  font-weight: 600;
  border-color: #a3d0fd;
}
.skin-empty {
  font-size: 12px;
  color: #c8c9cc;
  cursor: default !important;
  background: transparent !important;
  border: none !important;
}
.uploader-group {
  padding: 15px;
}
.upload-item {
  margin-bottom: 10px;
}
.upload-label {
  font-size: 14px;
  color: #323233;
  font-weight: 600;
  margin-bottom: 6px;
}
.upload-label .required {
  color: #ee0a24;
  margin-right: 2px;
}
.upload-desc {
  font-size: 12px;
  color: #969799;
  margin-bottom: 12px;
}
.submit-wrap {
  margin: 28px 16px 24px;
}
.submit-btn {
  font-size: 16px;
  font-weight: 600;
}
.agreement-text {
  text-align: center;
  font-size: 12px;
  color: #969799;
  margin-top: 12px;
}

@media (min-width: 768px) {
  .mobile-nav-bar {
    display: none !important;
  }
}
@media (max-width: 767px) {
  .desktop-nav-bar {
    display: none !important;
  }
}
</style>
