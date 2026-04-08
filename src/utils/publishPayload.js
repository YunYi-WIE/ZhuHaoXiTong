/**
 * 发布页 -> POST /api/sjz-account 请求体（字段尽量对齐列表/详情实体，未确认字段可由后端忽略）
 */

/** 后端 JSON 绑定为 Java int 时不得超过此值 */
const JAVA_INT_MAX = 2147483647;

function clampNonNegativeJavaInt(n) {
  if (n === undefined || n === null || !Number.isFinite(Number(n))) return undefined;
  const r = Math.round(Number(n));
  if (r < 0) return 0;
  if (r > JAVA_INT_MAX) return JAVA_INT_MAX;
  return r;
}

function toInt(v) {
  if (v === '' || v === undefined || v === null) return undefined;
  const n = parseInt(String(v), 10);
  if (!Number.isFinite(n)) return undefined;
  if (n > JAVA_INT_MAX || n < -JAVA_INT_MAX) {
    return n > 0 ? JAVA_INT_MAX : -JAVA_INT_MAX - 1;
  }
  return n;
}

function toNumber(v) {
  if (v === '' || v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function stripEmpty(obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  /** @type {Record<string, any>} */
  const o = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    o[k] = v;
  }
  return o;
}

/** 与表 sjz_account_skin_relation.skin_id 一致：去重后的 Long/int 安全列表 */
export function normalizeSkinIdsForApi(raw) {
  if (!Array.isArray(raw) || !raw.length) return [];
  const seen = new Set();
  const out = [];
  for (const x of raw) {
    const n = parseInt(String(x), 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    const v = n > JAVA_INT_MAX ? JAVA_INT_MAX : n;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** 哈弗币：支持「150M」「1.2亿」纯数字等，得到约整数（与 mock 中 hafuCoin 量级一致） */
export function parseHarvardCoinInput(text) {
  if (text === undefined || text === null) return undefined;
  const s = String(text).trim();
  if (!s) return undefined;
  const u = s.toUpperCase().replace(/\s/g, '');
  const yi = u.match(/^([\d.]+)\s*亿/);
  if (yi) return clampNonNegativeJavaInt(parseFloat(yi[1]) * 1e8);
  const m = u.match(/^([\d.]+)\s*M$/);
  if (m) return clampNonNegativeJavaInt(parseFloat(m[1]) * 1e6);
  const wan = u.match(/^([\d.]+)\s*W$/);
  if (wan) return clampNonNegativeJavaInt(parseFloat(wan[1]) * 1e4);
  const digits = u.replace(/[^\d]/g, '');
  if (digits) {
    const n = parseInt(digits, 10);
    if (!Number.isFinite(n)) return undefined;
    return n > JAVA_INT_MAX ? JAVA_INT_MAX : n;
  }
  return undefined;
}

const REGION_ADCODE_BY_ZONE = {
  微信区: '310000',
  QQ区: '110000',
};

/** @param {any[]} list van-uploader 文件列表 */
export function joinUploaderDataUrls(list) {
  if (!Array.isArray(list) || !list.length) return '';
  const parts = [];
  for (const item of list) {
    // 优先取 url（上传后返回的相对路径 /uploads/... 或绝对 http(s)）
    const u = item?.url;
    if (typeof u === 'string' && u.trim()) {
      parts.push(u.trim());
      continue;
    }
    // 兼容旧逻辑：仍允许 dataURL（但不推荐，会导致字段过长）
    const c = item?.content;
    if (typeof c === 'string' && c.startsWith('data:')) parts.push(c);
  }
  return parts.join(',');
}

/**
 * @param {Record<string, any>} form Publish.vue 表单
 */
export function buildSjzAccountCreateBody(form) {
  // 后端 DTO 中 rent/deposit 是 Integer：这里强制按整数提交
  let rent = toNumber(form.price);
  let deposit = toNumber(form.deposit);
  if (rent !== undefined) rent = Math.round(rent);
  if (deposit !== undefined) deposit = Math.round(deposit);
  if (rent !== undefined && rent > JAVA_INT_MAX) rent = JAVA_INT_MAX;
  if (deposit !== undefined && deposit > JAVA_INT_MAX) deposit = JAVA_INT_MAX;

  const staminaLevel = toInt(form.staminaLevel);
  const carryCapacity = toInt(form.carryCapacity);
  const rankLevel = toInt(form.rankLevel);
  const loginMethod = toInt(form.method);
  const insurance = toInt(form.insuranceType);
  let awmCount = toInt(form.awm);
  if (awmCount !== undefined && awmCount > JAVA_INT_MAX) awmCount = JAVA_INT_MAX;

  const leaseDays = toInt(form.leaseDays);
  const level = toInt(form.level);
  let kd = toNumber(form.kd);
  if (kd !== undefined && Number.isFinite(kd)) {
    // 后端 DTO：@Digits(integer=4, fraction=1)
    // 为避免“最多保留1位小数”校验失败，这里强制保留 1 位小数。
    kd = Math.round(kd * 10) / 10;
  }

  // 后端校验：totalAmount 必须等于 rent + deposit
  const depositValue = deposit !== undefined ? deposit : 0;
  const totalAmount =
    rent !== undefined
      ? clampNonNegativeJavaInt(rent + depositValue)
      : undefined;

  const hafuCoin = clampNonNegativeJavaInt(parseHarvardCoinInput(form.currency));
  const regionAdcode = REGION_ADCODE_BY_ZONE[form.region] || undefined;

  const banRecordScreenshot = joinUploaderDataUrls(form.banImgs);
  const otherScreenshot = joinUploaderDataUrls(form.roleImgs);
  const warehouseScreenshot = joinUploaderDataUrls(form.warehouseImgs);

  const remarkParts = [];
  if (form.currency && String(form.currency).trim()) {
    remarkParts.push(`哈弗币参考：${String(form.currency).trim()}`);
  }
  const remark = remarkParts.join('；') || undefined;

  const skinIds = normalizeSkinIdsForApi(form.skinIds);

  const body = stripEmpty({
    accountCode: form.accountCode?.trim() || undefined,
    ratioInfo: form.title?.trim() || undefined,
    rent,
    deposit: deposit !== undefined ? deposit : 0,
    regionAdcode,
    leaseDays,
    level,
    kd,
    staminaLevel,
    carryCapacity,
    rankLevel,
    loginMethod,
    insurance,
    awmCount: awmCount !== undefined ? awmCount : 0,
    hafuCoin,
    remark,
    skinIds: skinIds.length ? skinIds : undefined,
    totalAmount,
    banRecordScreenshot: banRecordScreenshot || undefined,
    otherScreenshot: otherScreenshot || undefined,
    warehouseScreenshot: warehouseScreenshot || undefined,
  });

  return body;
}

const RANK_KEYWORDS = [
  ['青铜', 1],
  ['白银', 2],
  ['黄金', 3],
  ['铂金', 4],
  ['钻石', 5],
  ['黑鹰', 6],
  ['巅峰', 7],
];

/**
 * 识别「流动资产 / 纯哈夫币 / 体力 / 负重 …」一类统一粘贴文案，返回可合并进发布表单的字段片段。
 * @param {string} raw
 * @returns {Record<string, string|number>}
 */
export function parsePastedListingText(raw) {
  /** @type {Record<string, string|number>} */
  const out = {};
  if (raw == null || !String(raw).trim()) return out;
  const norm = String(raw).replace(/：/g, ':');
  const lines = norm.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const tail = line.includes(':') ? line.split(':').slice(1).join(':').trim() : '';

    if (/^流动资产/i.test(line)) {
      if (tail) out.currency = out.currency || tail;
    }
    if (/纯哈夫币|纯哈弗币/i.test(line)) {
      if (tail) out.currency = tail;
    }
    if (/保险格数/i.test(line)) {
      const n = parseInt(tail, 10);
      if (n >= 1 && n <= 4) out.insuranceType = n;
    }
    if (/^体力/i.test(line)) {
      const n = parseInt(tail, 10);
      if (n >= 1 && n <= 7) out.staminaLevel = n;
    }
    if (/^负重/i.test(line)) {
      const n = parseInt(tail, 10);
      if (n >= 1 && n <= 7) out.carryCapacity = n;
    }
    if (/AWM/i.test(line)) {
      const digits = tail.replace(/[^\d]/g, '');
      const n = parseInt(digits, 10);
      if (Number.isFinite(n) && n >= 0) out.awm = String(Math.min(n, JAVA_INT_MAX));
    }
    if (/段位/i.test(line)) {
      for (const [kw, rank] of RANK_KEYWORDS) {
        if (tail.includes(kw)) {
          out.rankLevel = rank;
          break;
        }
      }
    }
    if (/绝密\s*KD/i.test(line) || /^KD\s*:/i.test(line)) {
      const n = parseFloat(tail);
      if (Number.isFinite(n)) out.kd = String(n);
    }
  }
  return out;
}
