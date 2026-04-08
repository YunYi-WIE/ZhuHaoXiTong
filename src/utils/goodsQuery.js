/** 筛选抽屉与大厅共用的默认状态（字段对齐 GoodsQueryDTO） */

export function getDefaultFilterDrawerModel() {

  return {

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

    /** @type {'' | boolean} 空=不传，由后端按排序类型默认 */

    sortDesc: '',

    keyword: '',

  };

}



/**

 * 构建 C 端「三角洲账号列表」GET /api/sjz-account/list 查询参数（GoodsQueryDTO）

 */

function toPositiveInt(v) {

  if (v === '' || v === undefined || v === null) return undefined;

  const n = parseInt(String(v), 10);

  return Number.isFinite(n) ? n : undefined;

}



function toOptionalInt(v) {

  if (v === '' || v === undefined || v === null) return undefined;

  const n = parseInt(String(v), 10);

  return Number.isFinite(n) ? n : undefined;

}



function toOptionalAmount(v) {

  if (v === '' || v === undefined || v === null) return undefined;

  const n = parseFloat(String(v).replace(/,/g, ''));

  if (!Number.isFinite(n) || n < 0) return undefined;

  return n;

}



/**

 * @param {Record<string, any>} filter - 与 FilterDrawer / 大厅筛选状态一致

 * @param {{ current?: number, size?: number, keyword?: string }} extra

 * @returns {Record<string, any>} 已剔除空值的扁平 query 参数；skinIds 为 number[]（由 getSjzAccountList 序列化）

 */

export function buildSjzAccountListParams(filter, extra = {}) {

  const current = extra.current;

  const size = extra.size;

  const keyword = extra.keyword !== undefined ? extra.keyword : filter.keyword;



  /** @type {Record<string, any>} */

  const out = {};

  if (current !== undefined && current !== null) out.current = current;

  if (size !== undefined && size !== null) out.size = size;

  if (keyword) out.keyword = String(keyword).trim();



  const st = toOptionalInt(filter.sortType);

  if (st !== undefined) out.sortType = st;



  if (filter.sortDesc === true || filter.sortDesc === false) {

    out.sortDesc = filter.sortDesc;

  }



  const minT = toOptionalAmount(filter.minTotalAmount);

  const maxT = toOptionalAmount(filter.maxTotalAmount);

  if (minT !== undefined) out.minTotalAmount = minT;

  if (maxT !== undefined) out.maxTotalAmount = maxT;



  const minH = toOptionalInt(filter.minHafuCoin);

  const maxH = toOptionalInt(filter.maxHafuCoin);

  if (minH !== undefined) out.minHafuCoin = minH;

  if (maxH !== undefined) out.maxHafuCoin = maxH;



  const ins = toOptionalInt(filter.insurance);

  if (ins !== undefined) out.insurance = ins;



  const lm = toOptionalInt(filter.loginMethod);

  if (lm !== undefined) out.loginMethod = lm;

  const sl = toOptionalInt(filter.staminaLevel);

  if (sl !== undefined) out.staminaLevel = sl;

  const cc = toOptionalInt(filter.carryCapacity);

  if (cc !== undefined) out.carryCapacity = cc;

  const rl = toOptionalInt(filter.rankLevel);

  if (rl !== undefined) out.rankLevel = rl;



  const awm = toOptionalInt(filter.awmCount);

  if (awm !== undefined) out.awmCount = awm;



  const skinIds = []

    .concat(filter.specialKnifeSkin || [], filter.redCharacterSkin || [], filter.weaponSkin || [], filter.goldCharacterSkin || [])

    .map((id) => parseInt(String(id), 10))

    .filter((id) => Number.isFinite(id));



  if (skinIds.length) out.skinIds = skinIds;



  return out;

}

