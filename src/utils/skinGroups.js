/** 与 FilterDrawer / 后端皮肤分组一致：类型 1–4 */

export const SKIN_TYPE_ORDER = [1, 2, 3, 4];

export const SKIN_TYPE_LABEL = {
  1: '特殊刀皮',
  2: '人物红皮',
  3: '武器皮肤',
  4: '人物金皮',
};

/** type -> Publish / Filter 表单字段名 */
export const SKIN_PROP_BY_TYPE = {
  1: 'specialKnifeSkin',
  2: 'redCharacterSkin',
  3: 'weaponSkin',
  4: 'goldCharacterSkin',
};

export function normalizeSkinEntry(raw) {
  const id = raw.id ?? raw.skinId;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return null;
  const text = raw.skinName ?? raw.name ?? `皮肤 #${n}`;
  return { text, value: n };
}

/**
 * 将接口返回的皮肤分组写入 optionsByType[type] = {text,value}[]
 * @param {Record<number, {text:string,value:number}[]>} targetBuckets reactive empty 1..4
 * @param {*} payload getSkinGroupList 返回值
 */
export function fillSkinOptionsByType(targetBuckets, payload) {
  SKIN_TYPE_ORDER.forEach((t) => {
    targetBuckets[t] = [];
  });
  if (!payload) return;

  const pushList = (skinType, list) => {
    if (!SKIN_TYPE_LABEL[skinType] || !Array.isArray(list)) return;
    const opts = list.map(normalizeSkinEntry).filter(Boolean);
    targetBuckets[skinType] = opts;
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
    if (Array.isArray(payload.groups)) {
      payload.groups.forEach((g) => {
        const t = parseInt(g.skinType ?? g.type, 10);
        const list = g.skins ?? g.list ?? g.items ?? [];
        pushList(t, list);
      });
    }
  }
}
