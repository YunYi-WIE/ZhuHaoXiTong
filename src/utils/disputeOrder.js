/** 用户已发起售后的订单 ID（接口未及时打标时用于立即出现在「售后/仲裁」Tab） */
const STORAGE_KEY = 'zhxh_dispute_order_ids';
const MAX_IDS = 80;

export function getDisputeOrderIds() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export function addDisputeOrderId(id) {
  if (id == null || id === '') return;
  const s = String(id);
  const cur = getDisputeOrderIds().filter((x) => x !== s);
  cur.unshift(s);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cur.slice(0, MAX_IDS)));
}

function rememberedIds() {
  return new Set(getDisputeOrderIds());
}

export function orderHasDisputeMarkers(row) {
  if (!row || typeof row !== 'object') return false;
  const ds = Number(row.disputeStatus);
  if (Number.isFinite(ds) && ds > 0) return true;
  return (
    row.hasDispute === true ||
    row.hasDispute === 1 ||
    row.dispute === true ||
    (row.disputeId != null && row.disputeId !== '') ||
    (row.dispute && typeof row.dispute === 'object' && Object.keys(row.dispute).length > 0)
  );
}

/** 售后/仲裁 Tab：仅租赁中(1)或已完成(2)，且已发起售后（后端 disputeStatus 或本地记录） */
export function isAftersaleTabOrder(row) {
  const id = row?.id != null ? String(row.id) : '';
  if (!id) return false;
  const st = Number(row.status ?? row.orderStatus);
  if (st !== 1 && st !== 2) return false;
  if (rememberedIds().has(id)) return true;
  return orderHasDisputeMarkers(row);
}

export function dedupeOrdersById(list) {
  const m = new Map();
  for (const o of list) {
    if (o?.id != null) m.set(String(o.id), o);
  }
  return Array.from(m.values());
}
